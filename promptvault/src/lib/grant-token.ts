// SERVER-ONLY signed grant token. Issued after a confirmed PAID order so the
// browser can prove "I'm allowed to unlock content" without us having to
// maintain server sessions. Stored in localStorage by the client; verified
// server-side wherever it matters (currently nowhere — content is delivered
// client-side from bundled JSON, so the token is mostly an honesty signal +
// audit hook for future server-gated download).
import 'server-only';
import { createHmac, timingSafeEqual, randomBytes } from 'node:crypto';

const SECRET =
  process.env.PROMPTSMITH_GRANT_SECRET ?? process.env.CASHFREE_SECRET_KEY ?? '';
const TTL_MS = 1000 * 60 * 60 * 24 * 365 * 5; // 5 years (lifetime product)

export interface GrantPayload {
  orderId: string;
  email: string;
  issuedAt: number; // ms epoch
}

function b64url(buf: Buffer): string {
  return buf.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromB64url(s: string): Buffer {
  const pad = s.length % 4 === 0 ? '' : '='.repeat(4 - (s.length % 4));
  return Buffer.from(s.replace(/-/g, '+').replace(/_/g, '/') + pad, 'base64');
}

export function signGrantToken(payload: GrantPayload): string {
  if (!SECRET) {
    // Fall back to a random per-process secret so dev still works.
    // Tokens won't survive server restart in this case — fine for dev.
    process.env.PROMPTSMITH_GRANT_SECRET = randomBytes(32).toString('hex');
  }
  const secret = process.env.PROMPTSMITH_GRANT_SECRET ?? SECRET;
  const body = b64url(Buffer.from(JSON.stringify(payload), 'utf8'));
  const sig = b64url(createHmac('sha256', secret).update(body).digest());
  return `${body}.${sig}`;
}

export function verifyGrantToken(token: string): GrantPayload | null {
  if (!token || typeof token !== 'string') return null;
  const [body, sig] = token.split('.');
  if (!body || !sig) return null;
  const secret = process.env.PROMPTSMITH_GRANT_SECRET ?? SECRET;
  if (!secret) return null;
  const expected = createHmac('sha256', secret).update(body).digest();
  let actual: Buffer;
  try {
    actual = fromB64url(sig);
  } catch {
    return null;
  }
  if (actual.length !== expected.length) return null;
  if (!timingSafeEqual(actual, expected)) return null;
  let payload: GrantPayload;
  try {
    payload = JSON.parse(fromB64url(body).toString('utf8')) as GrantPayload;
  } catch {
    return null;
  }
  if (Date.now() - payload.issuedAt > TTL_MS) return null;
  return payload;
}
