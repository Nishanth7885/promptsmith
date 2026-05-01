import Link from 'next/link';
import { SignupForm } from './SignupForm';

export const metadata = { title: 'Create your account' };

export default function SignupPage({
  searchParams,
}: {
  searchParams: { callbackUrl?: string };
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
      <h1 className="text-2xl font-semibold tracking-tight">Create your account</h1>
      <p className="text-sm text-slate-600 mt-1">
        Lifetime access starts with a free account.
      </p>
      <SignupForm
        callbackUrl={searchParams.callbackUrl}
        googleEnabled={!!process.env.AUTH_GOOGLE_ID && !!process.env.AUTH_GOOGLE_SECRET}
      />
      <p className="text-sm text-slate-600 mt-6 text-center">
        Already have one?{' '}
        <Link href="/login" className="font-medium text-slate-900 underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
