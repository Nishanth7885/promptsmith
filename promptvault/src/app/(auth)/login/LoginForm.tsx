'use client';

import Link from 'next/link';
import { signIn } from 'next-auth/react';
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
  const cb = callbackUrl ?? '/account';

  return (
    <div className="mt-6 space-y-4">
      {googleEnabled && (
        <>
          <button
            type="button"
            onClick={() => signIn('google', { callbackUrl: cb })}
            className="flex w-full items-center justify-center gap-3 rounded-lg border border-slate-300 px-4 py-2.5 font-medium transition hover:bg-slate-50"
          >
            <GoogleIcon />
            Continue with Google
          </button>
          <div className="relative my-2 text-center text-xs text-slate-500">
            <span className="bg-white px-2 relative z-10">or</span>
            <div className="absolute inset-0 top-1/2 border-t border-slate-200" />
          </div>
        </>
      )}

      <form action={action} className="space-y-4">
        <input type="hidden" name="callbackUrl" value={cb} />

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
    </div>
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

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M21.6 12.227c0-.795-.071-1.56-.204-2.295H12v4.34h5.382a4.6 4.6 0 0 1-1.995 3.018v2.51h3.232c1.892-1.74 2.981-4.305 2.981-7.573z" />
      <path fill="#34A853" d="M12 22c2.7 0 4.964-.895 6.62-2.422l-3.233-2.51c-.895.6-2.04.955-3.387.955-2.604 0-4.81-1.76-5.595-4.122H3.064v2.59A9.996 9.996 0 0 0 12 22z" />
      <path fill="#FBBC04" d="M6.405 13.9a6.005 6.005 0 0 1 0-3.8V7.51H3.064a9.996 9.996 0 0 0 0 8.98l3.34-2.59z" />
      <path fill="#EA4335" d="M12 5.977c1.468 0 2.786.505 3.823 1.495l2.868-2.868C16.96 2.99 14.696 2 12 2A9.996 9.996 0 0 0 3.064 7.51l3.34 2.59C7.19 7.737 9.396 5.977 12 5.977z" />
    </svg>
  );
}
