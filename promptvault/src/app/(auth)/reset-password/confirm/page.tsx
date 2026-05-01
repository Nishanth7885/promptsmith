import Link from 'next/link';
import { ResetConfirmForm } from './ResetConfirmForm';

export const metadata = { title: 'Set a new password' };
export const dynamic = 'force-dynamic';

export default function ResetConfirmPage({
  searchParams,
}: {
  searchParams: { token?: string };
}) {
  const token = searchParams.token ?? '';
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
      <h1 className="text-2xl font-semibold tracking-tight">Set a new password</h1>
      {!token ? (
        <>
          <p className="text-sm text-red-600 mt-2">No token provided. Open the link from your email.</p>
          <Link href="/reset-password" className="text-sm underline mt-3 inline-block">
            Request a new link
          </Link>
        </>
      ) : (
        <ResetConfirmForm token={token} />
      )}
    </div>
  );
}
