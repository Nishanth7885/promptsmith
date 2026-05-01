import 'server-only';
import { Resend } from 'resend';

const FROM = process.env.EMAIL_FROM ?? 'Prompt Smith <hello@promptsmith.ink>';
const APP_URL = (process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000').replace(/\/+$/, '');

let _resend: Resend | null = null;
function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  if (!_resend) _resend = new Resend(key);
  return _resend;
}

interface SendArgs {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail({ to, subject, html, text }: SendArgs): Promise<void> {
  const resend = getResend();
  if (!resend) {
    // Dev / unconfigured fallback: log to stdout so you can copy the link.
    console.log(`\n[email:dry-run] -> ${to}\nSubject: ${subject}\n${text ?? html}\n`);
    return;
  }
  const { error } = await resend.emails.send({ from: FROM, to, subject, html, text });
  if (error) throw new Error(`Resend send failed: ${error.message ?? JSON.stringify(error)}`);
}

// ---------- templates ----------

export function verifyEmailTemplate(args: { name?: string | null; link: string }): {
  subject: string;
  html: string;
  text: string;
} {
  const greet = args.name ? `Hi ${args.name},` : 'Hi,';
  return {
    subject: 'Verify your Prompt Smith email',
    text: `${greet}\n\nConfirm your email to activate your Prompt Smith account:\n${args.link}\n\nThis link expires in 24 hours.`,
    html: `
      <div style="font-family:system-ui,sans-serif;max-width:520px;margin:0 auto;padding:24px;color:#0f172a">
        <h2 style="margin:0 0 16px">Verify your email</h2>
        <p>${greet}</p>
        <p>Confirm your email to activate your Prompt Smith account.</p>
        <p style="margin:24px 0">
          <a href="${args.link}" style="background:#0f172a;color:#fff;text-decoration:none;padding:12px 20px;border-radius:8px;display:inline-block">Verify email</a>
        </p>
        <p style="color:#64748b;font-size:13px">If the button doesn't work, paste this into your browser:<br>${args.link}</p>
        <p style="color:#64748b;font-size:13px">This link expires in 24 hours.</p>
      </div>`,
  };
}

export function passwordResetTemplate(args: { name?: string | null; link: string }): {
  subject: string;
  html: string;
  text: string;
} {
  const greet = args.name ? `Hi ${args.name},` : 'Hi,';
  return {
    subject: 'Reset your Prompt Smith password',
    text: `${greet}\n\nClick to reset your password:\n${args.link}\n\nThis link expires in 1 hour. If you didn't request this, ignore this email.`,
    html: `
      <div style="font-family:system-ui,sans-serif;max-width:520px;margin:0 auto;padding:24px;color:#0f172a">
        <h2 style="margin:0 0 16px">Reset your password</h2>
        <p>${greet}</p>
        <p>We got a request to reset your Prompt Smith password.</p>
        <p style="margin:24px 0">
          <a href="${args.link}" style="background:#0f172a;color:#fff;text-decoration:none;padding:12px 20px;border-radius:8px;display:inline-block">Reset password</a>
        </p>
        <p style="color:#64748b;font-size:13px">If the button doesn't work, paste this into your browser:<br>${args.link}</p>
        <p style="color:#64748b;font-size:13px">This link expires in 1 hour. If you didn't request this, you can ignore this email.</p>
      </div>`,
  };
}

export function receiptTemplate(args: {
  name?: string | null;
  orderId: string;
  amount: string;
  currency: string;
  accessUrl: string;
}): { subject: string; html: string; text: string } {
  const greet = args.name ? `Hi ${args.name},` : 'Hi,';
  return {
    subject: 'Your Prompt Smith access — receipt',
    text: `${greet}\n\nThanks for your purchase. Order ${args.orderId}, ${args.currency} ${args.amount}.\n\nAccess your prompts: ${args.accessUrl}`,
    html: `
      <div style="font-family:system-ui,sans-serif;max-width:520px;margin:0 auto;padding:24px;color:#0f172a">
        <h2 style="margin:0 0 16px">Thanks for your purchase</h2>
        <p>${greet}</p>
        <p>Your Prompt Smith access is ready.</p>
        <table style="border-collapse:collapse;margin:16px 0;font-size:14px">
          <tr><td style="padding:4px 16px 4px 0;color:#64748b">Order</td><td>${args.orderId}</td></tr>
          <tr><td style="padding:4px 16px 4px 0;color:#64748b">Amount</td><td>${args.currency} ${args.amount}</td></tr>
        </table>
        <p style="margin:24px 0">
          <a href="${args.accessUrl}" style="background:#0f172a;color:#fff;text-decoration:none;padding:12px 20px;border-radius:8px;display:inline-block">Open your prompts</a>
        </p>
        <p style="color:#64748b;font-size:13px">Lifetime access. Save this email — it's your receipt.</p>
      </div>`,
  };
}

export function buildAppUrl(path: string): string {
  return `${APP_URL}${path.startsWith('/') ? path : '/' + path}`;
}
