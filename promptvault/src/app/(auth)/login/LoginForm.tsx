'use client';

import Link from 'next/link';
import { useFormState, useFormStatus } from 'react-dom';
import { loginAction } from '../actions';

export function LoginForm({
  callbackUrl,
  initialError,
  googleEnabled,
}: {
  callbackUrl?: string;
  initialError?: string;
  googleEnabled?: boolean;
}) {
  const [state, action] = useFormState(loginAction, null as any);
  const showError = state?.error || (initialError === 'CredentialsSignin' && 'Wrong email or password.');

  return (
    <form action={action} className="mt-6 space-y-4">
      <input type="hidden" name="callbackUrl" value={callbackUrl ?? '/account'} />

      {googleEnabled && (
        <>
          <a
            href={`/api/auth/signin/google?callbackUrl=${encodeURIComponent(callbackUrl ?? '/account')}`}
            className="block w-full text-center border border-slate-300 rounded-lg px-4 py-2.5 hover:bg-slate-50 font-medium"
          >
            Continue with Google
          </a>
          <div className="relative my-2 text-center text-xs text-slate-500">
            <span className="bg-white px-2 relative z-10">or</span>
            <div className="absolute inset-0 top-1/2 border-t border-slate-200" />
          </div>
        </>
      )}

      <label className="block">
        <span className="text-sm font-medium">Email</span>
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-900"
        />
      </label>

      <label className="block">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Password</span>
          <Link href="/reset-password" className="text-xs text-slate-600 hover:text-slate-900 underline">
            Forgot?
          </Link>
        </div>
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-900"
        />
      </label>

      {showError && <p className="text-sm text-red-600">{showError}</p>}

      <SubmitButton>Log in</SubmitButton>
    </form>
  );
}

function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-slate-900 text-white font-medium rounded-lg px-4 py-2.5 hover:bg-slate-800 disabled:opacity-60"
    >
      {pending ? '…' : children}
    </button>
  );
}
