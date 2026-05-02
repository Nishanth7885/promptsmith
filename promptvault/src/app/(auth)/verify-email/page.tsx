import Link from 'next/link';
import { ResendVerifyForm } from './ResendVerifyForm';

export const metadata = { title: 'Verify your email' };

export default function VerifyEmailPage({
  searchParams,
}: {
  searchParams?: { email?: string; sent?: string };
}) {
  const justSignedUp = searchParams?.sent === '1';
  const email = searchParams?.email ?? '';

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
      {justSignedUp && (
        <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
          <strong>Account created.</strong> We sent a verification link
          {email ? ' to ' : ' to your inbox'}
          {email && <strong> {email}</strong>}. Click it to activate your account, then log in.
        </div>
      )}

      <h1 className="text-2xl font-semibold tracking-tight">Check your inbox</h1>
      <p className="text-sm text-slate-600 mt-2">
        We sent a verification link. Open it on the same device to activate your account.
        The link expires in <strong>24 hours</strong>.
      </p>
      <p className="text-xs text-slate-500 mt-2">
        Tip: if you don&apos;t see the email in 1–2 minutes, check your spam folder.
      </p>

      <div className="border-t border-slate-200 my-6" />

      <p className="text-sm text-slate-600 mb-3">
        Didn&apos;t get the email? Request a new link below.
      </p>
      <ResendVerifyForm />

      <p className="text-sm text-slate-600 mt-6 text-center">
        <Link href="/login" className="font-medium text-slate-900 underline">
          Back to log in
        </Link>
      </p>
    </div>
  );
}
