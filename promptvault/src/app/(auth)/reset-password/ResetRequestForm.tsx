'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { requestPasswordReset } from '../actions';

export function ResetRequestForm() {
  const [state, action] = useFormState(requestPasswordReset, null as any);
  return (
    <form action={action} className="mt-6 space-y-4">
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
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state?.message && <p className="text-sm text-emerald-700">{state.message}</p>}
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
      {pending ? '…' : 'Send reset link'}
    </button>
  );
}
