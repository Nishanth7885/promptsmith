'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { signupAction } from '../actions';

export function SignupForm({
  callbackUrl,
  googleEnabled,
}: {
  callbackUrl?: string;
  googleEnabled?: boolean;
}) {
  const [state, action] = useFormState(signupAction, null as any);

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
            <span className="bg-white px-2 relative z-10">or sign up with email</span>
            <div className="absolute inset-0 top-1/2 border-t border-slate-200" />
          </div>
        </>
      )}

      <label className="block">
        <span className="text-sm font-medium">Name (optional)</span>
        <input
          name="name"
          type="text"
          autoComplete="name"
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-900"
        />
      </label>

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
        <span className="text-sm font-medium">Password</span>
        <input
          name="password"
          type="password"
          minLength={8}
          required
          autoComplete="new-password"
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-900"
        />
        <span className="text-xs text-slate-500 mt-1 block">Minimum 8 characters.</span>
      </label>

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state?.ok && state?.message && <p className="text-sm text-emerald-700">{state.message}</p>}

      <SubmitButton>Create account</SubmitButton>

      <p className="text-xs text-slate-500 text-center">
        By creating an account you agree to our terms.
      </p>
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
