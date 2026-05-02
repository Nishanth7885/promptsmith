import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { LoginForm } from './LoginForm';

export const metadata = { title: 'Log in' };
export const dynamic = 'force-dynamic';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { callbackUrl?: string; error?: string };
}) {
  // Already signed in? Don't show the form — bounce to the destination.
  const session = await auth();
  if (session?.user) {
    redirect(searchParams.callbackUrl || '/preview');
  }
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
      <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
      <p className="text-sm text-slate-600 mt-1">Log in to access your prompts.</p>
      <LoginForm
        callbackUrl={searchParams.callbackUrl}
        initialError={searchParams.error}
        googleEnabled={!!process.env.AUTH_GOOGLE_ID && !!process.env.AUTH_GOOGLE_SECRET}
      />
      <p className="text-sm text-slate-600 mt-6 text-center">
        New here?{' '}
        <Link href="/signup" className="font-medium text-slate-900 underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}
