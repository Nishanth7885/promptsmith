import 'server-only';
import { createHash, randomBytes } from 'node:crypto';
import { and, eq, gt, isNull } from 'drizzle-orm';
import { db, schema } from '@/db';

const VERIFY_TTL_MS = 1000 * 60 * 60 * 24; // 24h
const RESET_TTL_MS = 1000 * 60 * 60; // 1h

function hashToken(raw: string): string {
  return createHash('sha256').update(raw).digest('hex');
}

export async function issueToken(args: {
  userId: string;
  purpose: 'email_verify' | 'password_reset';
}): Promise<string> {
  const raw = randomBytes(32).toString('base64url');
  const ttl = args.purpose === 'email_verify' ? VERIFY_TTL_MS : RESET_TTL_MS;
  await db.insert(schema.authTokens).values({
    userId: args.userId,
    purpose: args.purpose,
    tokenHash: hashToken(raw),
    expiresAt: new Date(Date.now() + ttl),
  });
  return raw;
}

export async function consumeToken(args: {
  token: string;
  purpose: 'email_verify' | 'password_reset';
}): Promise<{ userId: string } | null> {
  const tokenHash = hashToken(args.token);
  const rows = await db
    .select()
    .from(schema.authTokens)
    .where(
      and(
        eq(schema.authTokens.tokenHash, tokenHash),
        eq(schema.authTokens.purpose, args.purpose),
        isNull(schema.authTokens.usedAt),
        gt(schema.authTokens.expiresAt, new Date()),
      ),
    )
    .limit(1);
  const row = rows[0];
  if (!row) return null;
  await db
    .update(schema.authTokens)
    .set({ usedAt: new Date() })
    .where(eq(schema.authTokens.id, row.id));
  return { userId: row.userId };
}
