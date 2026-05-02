'use server';

import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { redirect } from 'next/navigation';
import { AuthError } from 'next-auth';
import { db, schema } from '@/db';
import { signIn } from '@/auth';
import { issueToken, consumeToken } from '@/lib/auth-tokens';
import {
  buildAppUrl,
  passwordResetTemplate,
  sendEmail,
  verifyEmailTemplate,
} from '@/lib/email';

const PASSWORD_MIN = 8;

const signupSchema = z.object({
  name: z.string().trim().min(1).max(80).optional().or(z.literal('')),
  email: z.string().trim().email().toLowerCase(),
  password: z.string().min(PASSWORD_MIN).max(200),
});

export interface ActionResult {
  ok: boolean;
  error?: string;
  message?: string;
}

export async function signupAction(_: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const parsed = signupSchema.safeParse({
    name: (formData.get('name') ?? '') as string,
    email: formData.get('email'),
    password: formData.get('password'),
  });
  if (!parsed.success) {
    return { ok: false, error: 'Enter a valid email and a password of 8+ characters.' };
  }
  const { email, password, name } = parsed.data;

  const existing = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.email, email))
    .limit(1);
  if (existing[0]) {
    if (existing[0].passwordHash) {
      return { ok: false, error: 'An account with that email already exists. Try logging in.' };
    }
    // Account exists from Google signin but no password set — treat signup as
    // adding a password.
    const passwordHash = await bcrypt.hash(password, 10);
    await db
      .update(schema.users)
      .set({ passwordHash, name: name || existing[0].name })
      .where(eq(schema.users.id, existing[0].id));
    await sendVerifyEmail(existing[0].id, email, name || existing[0].name);
    return { ok: true, message: 'Password added. Check your inbox to verify your email.' };
  }

  const adminBootstrap = process.env.ADMIN_BOOTSTRAP_EMAIL?.toLowerCase();
  const passwordHash = await bcrypt.hash(password, 10);
  const inserted = await db
    .insert(schema.users)
    .values({
      email,
      name: name || null,
      passwordHash,
      role: adminBootstrap === email ? 'admin' : 'user',
    })
    .returning({ id: schema.users.id });
  await sendVerifyEmail(inserted[0].id, email, name || null);

  // Auto-login + redirect. signIn throws NEXT_REDIRECT on success which Next
  // catches; AuthError means credentials genuinely failed.
  const callbackUrl = (formData.get('callbackUrl') as string) || '/preview?welcome=1';
  try {
    await signIn('credentials', { email, password, redirectTo: callbackUrl });
  } catch (err) {
    if (err instanceof AuthError) {
      return {
        ok: false,
        error: 'Account created but auto-login failed. Please log in manually.',
      };
    }
    throw err; // NEXT_REDIRECT bubbles up — framework handles the redirect.
  }
  return { ok: true };
}

async function sendVerifyEmail(userId: string, email: string, name: string | null): Promise<void> {
  const token = await issueToken({ userId, purpose: 'email_verify' });
  const link = buildAppUrl(`/verify-email/confirm?token=${encodeURIComponent(token)}`);
  const tpl = verifyEmailTemplate({ name, link });
  await sendEmail({ to: email, ...tpl });
}

const loginSchema = z.object({
  email: z.string().email().toLowerCase(),
  password: z.string().min(1),
});

export async function loginAction(_: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const parsed = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });
  if (!parsed.success) return { ok: false, error: 'Enter your email and password.' };
  try {
    await signIn('credentials', {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: (formData.get('callbackUrl') as string) || '/preview',
    });
  } catch (err) {
    if (err instanceof AuthError) {
      return { ok: false, error: 'Wrong email or password.' };
    }
    throw err;
  }
  return { ok: true };
}

const resetReqSchema = z.object({ email: z.string().email().toLowerCase() });

export async function requestPasswordReset(
  _: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = resetReqSchema.safeParse({ email: formData.get('email') });
  if (!parsed.success) return { ok: false, error: 'Enter a valid email.' };
  const rows = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.email, parsed.data.email))
    .limit(1);
  // Always respond the same so we don't leak whether an account exists.
  if (rows[0] && rows[0].passwordHash) {
    const token = await issueToken({ userId: rows[0].id, purpose: 'password_reset' });
    const link = buildAppUrl(`/reset-password/confirm?token=${encodeURIComponent(token)}`);
    const tpl = passwordResetTemplate({ name: rows[0].name, link });
    await sendEmail({ to: parsed.data.email, ...tpl });
  }
  return { ok: true, message: 'If that email is on file, a reset link is on its way.' };
}

const resetSchema = z.object({
  token: z.string().min(10),
  password: z.string().min(PASSWORD_MIN).max(200),
});

export async function resetPasswordAction(
  _: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = resetSchema.safeParse({
    token: formData.get('token'),
    password: formData.get('password'),
  });
  if (!parsed.success) return { ok: false, error: 'Password must be at least 8 characters.' };
  const consumed = await consumeToken({ token: parsed.data.token, purpose: 'password_reset' });
  if (!consumed) return { ok: false, error: 'This link is invalid or has expired.' };
  const passwordHash = await bcrypt.hash(parsed.data.password, 10);
  await db
    .update(schema.users)
    .set({ passwordHash })
    .where(eq(schema.users.id, consumed.userId));
  return { ok: true, message: 'Password updated. You can log in now.' };
}

export async function resendVerificationAction(
  _: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const email = (formData.get('email') as string)?.toLowerCase().trim();
  if (!email) return { ok: false, error: 'Enter your email.' };
  const rows = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.email, email))
    .limit(1);
  if (rows[0] && !rows[0].emailVerified) {
    await sendVerifyEmail(rows[0].id, email, rows[0].name);
  }
  return { ok: true, message: 'If that account needs verification, a fresh link is on its way.' };
}

export async function loginWithGoogle(callbackUrl?: string): Promise<void> {
  await signIn('google', { redirectTo: callbackUrl || '/account' });
}
