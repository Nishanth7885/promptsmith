import Link from 'next/link';
import { eq } from 'drizzle-orm';
import { db, schema } from '@/db';
import { consumeToken } from '@/lib/auth-tokens';

export const metadata = { title: 'Verifying email' };
export const dynamic = 'force-dynamic';

export default async function ConfirmEmailPage({
  searchParams,
}: {
  searchParams: { token?: string };
}) {
  const token = searchParams.token;
  let outcome: 'ok' | 'invalid' | 'missing' = 'missing';
  if (token) {
    const consumed = await consumeToken({ token, purpose: 'email_verify' });
    if (consumed) {
      await db
        .update(schema.users)
        .set({ emailVerified: new Date() })
        .where(eq(schema.users.id, consumed.userId));
      outcome = 'ok';
    } else {
      outcome = 'invalid';
    }
  }
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
      {outcome === 'ok' && (
        <>
          <h1 className="text-2xl font-semibold tracking-tight">Email verified</h1>
          <p className="text-sm text-slate-600 mt-2">Your account is fully active. You can log in now.</p>
        </>
      )}
      {outcome === 'invalid' && (
        <>
          <h1 className="text-2xl font-semibold tracking-tight">Link invalid or expired</h1>
          <p className="text-sm text-slate-600 mt-2">
            Request a fresh verification link from{' '}
            <Link href="/verify-email" className="underline">/verify-email</Link>.
          </p>
        </>
      )}
      {outcome === 'missing' && (
        <>
          <h1 className="text-2xl font-semibold tracking-tight">No token provided</h1>
          <p className="text-sm text-slate-600 mt-2">
            Open the link from the email exactly as sent.
          </p>
        </>
      )}
      <Link
        href="/login"
        className="mt-6 inline-block bg-slate-900 text-white font-medium rounded-lg px-4 py-2.5 hover:bg-slate-800"
      >
        Continue to log in
      </Link>
    </div>
  );
}
