'use client';

import Link from 'next/link';
import { useFormState, useFormStatus } from 'react-dom';
import { resetPasswordAction } from '../../actions';

export function ResetConfirmForm({ token }: { token: string }) {
  const [state, action] = useFormState(resetPasswordAction, null as any);
  if (state?.ok && state?.message) {
    return (
      <div className="mt-4">
        <p className="text-sm text-emerald-700">{state.message}</p>
        <Link
          href="/login"
          className="mt-4 inline-block bg-slate-900 text-white font-medium rounded-lg px-4 py-2.5 hover:bg-slate-800"
        >
          Log in
        </Link>
      </div>
    );
  }
  return (
    <form action={action} className="mt-6 space-y-4">
      <input type="hidden" name="token" value={token} />
      <label className="block">
        <span className="text-sm font-medium">New password</span>
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
      <Submit />
    </form>
  );
}

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-slate-900 text-white font-medium rounded-lg px-4 py-2.5 hover:bg-slate-800 disabled:opacity-60"
    >
      {pending ? '…' : 'Update password'}
    </button>
  );
}
