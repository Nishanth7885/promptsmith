'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { resendVerificationAction } from '../actions';

export function ResendVerifyForm() {
  const [state, action] = useFormState(resendVerificationAction, null as any);
  return (
    <form action={action} className="flex gap-2">
      <input
        name="email"
        type="email"
        required
        placeholder="you@example.com"
        className="flex-1 rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-900"
      />
      <Submit />
      {state?.message && <p className="text-sm text-emerald-700 mt-2 w-full">{state.message}</p>}
    </form>
  );
}

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-slate-900 text-white font-medium rounded-lg px-4 py-2 hover:bg-slate-800 disabled:opacity-60"
    >
      {pending ? '…' : 'Resend'}
    </button>
  );
}
