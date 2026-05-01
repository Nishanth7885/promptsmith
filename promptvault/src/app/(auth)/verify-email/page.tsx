import Link from 'next/link';
import { ResendVerifyForm } from './ResendVerifyForm';

export const metadata = { title: 'Verify your email' };

export default function VerifyEmailPage() {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
      <h1 className="text-2xl font-semibold tracking-tight">Check your inbox</h1>
      <p className="text-sm text-slate-600 mt-2">
        We sent a verification link. Open it on the same device to activate your account.
      </p>

      <div className="border-t border-slate-200 my-6" />

      <p className="text-sm text-slate-600 mb-3">
        Didn't get the email? Check spam, or request a new link below.
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
