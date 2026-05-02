'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { setGrant } from '@/lib/access';
import DownloadButton from '@/components/DownloadButton';

type State =
  | { phase: 'loading' }
  | { phase: 'paid'; orderId: string; email?: string; amount: number; currency?: 'INR' | 'USD' }
  | { phase: 'pending'; orderId: string; status: string }
  | { phase: 'failed'; orderId: string; status: string }
  | { phase: 'error'; message: string };

export default function PaymentReturnClient() {
  const params = useSearchParams();
  const orderId = params?.get('order_id') ?? '';
  const [state, setState] = useState<State>({ phase: 'loading' });
  const [polls, setPolls] = useState(0);

  useEffect(() => {
    if (!orderId) {
      setState({ phase: 'error', message: 'No order id on the return URL.' });
      return;
    }
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | null = null;

    const run = async () => {
      try {
        const res = await fetch(`/api/cashfree/verify?order_id=${encodeURIComponent(orderId)}`);
        const data = await res.json();
        if (cancelled) return;

        if (!res.ok) {
          setState({ phase: 'error', message: data?.error ?? `HTTP ${res.status}` });
          return;
        }

        if (data.status === 'PAID' && data.grant) {
          setGrant(data.grant, data.email);
          setState({
            phase: 'paid',
            orderId: data.orderId,
            email: data.email,
            amount: data.amount,
            currency: data.currency,
          });
          return;
        }

        // ACTIVE / pending — Cashfree may still be confirming with the bank.
        if (data.status === 'ACTIVE' || data.status === 'PENDING') {
          setState({ phase: 'pending', orderId: data.orderId, status: data.status });
          if (polls < 6) {
            timer = setTimeout(() => setPolls((p) => p + 1), 2500);
          }
          return;
        }

        setState({ phase: 'failed', orderId: data.orderId, status: data.status });
      } catch (err) {
        if (cancelled) return;
        setState({
          phase: 'error',
          message: err instanceof Error ? err.message : 'Verification request failed',
        });
      }
    };

    run();
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [orderId, polls]);

  if (state.phase === 'loading' || state.phase === 'pending') {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-rose-200 border-t-rose-600" />
        <h1 className="mt-5 text-lg font-semibold text-slate-900">
          {state.phase === 'loading' ? 'Verifying your payment…' : 'Confirming with your bank…'}
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          {state.phase === 'pending'
            ? 'Cashfree is still confirming your payment. This usually takes a few seconds.'
            : 'One moment.'}
        </p>
        {state.phase === 'pending' && (
          <p className="mt-1 text-xs text-slate-500">Order: {state.orderId}</p>
        )}
      </div>
    );
  }

  if (state.phase === 'paid') {
    return (
      <div className="rounded-3xl border border-emerald-200 bg-white p-8 text-center shadow-sm sm:p-10">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-100 text-2xl">
          🎉
        </div>
        <h1 className="mt-5 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
          Payment received. Welcome aboard!
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          You now have lifetime access to all 4,929 prompts on this device.
        </p>
        <dl className="mx-auto mt-6 grid max-w-sm gap-2 text-left text-xs text-slate-600">
          <Row label="Order ID" value={state.orderId} />
          {state.email && <Row label="Email" value={state.email} />}
          <Row
            label="Amount"
            value={state.currency === 'USD' ? `$${state.amount}` : `₹${state.amount}`}
          />
        </dl>

        <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <DownloadButton />
          <Link
            href="/browse"
            className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Start browsing →
          </Link>
        </div>
        <p className="mt-6 text-xs text-slate-500">
          A receipt is on the way to your email. Need help?{' '}
          <a href="mailto:digitalhub.admin@gmail.com" className="text-rose-600 underline">
            digitalhub.admin@gmail.com
          </a>
        </p>
      </div>
    );
  }

  if (state.phase === 'failed') {
    return (
      <div className="rounded-3xl border border-rose-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-rose-100 text-2xl">
          ✕
        </div>
        <h1 className="mt-5 text-2xl font-bold text-slate-900">Payment didn’t go through</h1>
        <p className="mt-2 text-sm text-slate-600">
          Status reported by Cashfree: <span className="font-semibold">{state.status}</span>.
          No money was deducted, or it will be auto-refunded by your bank within 5–7 working days
          if it was.
        </p>
        <p className="mt-1 text-xs text-slate-500">Order: {state.orderId}</p>
        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/#pricing"
            className="rounded-full bg-rose-600 px-5 py-3 text-sm font-semibold text-white hover:bg-rose-700"
          >
            Try again
          </Link>
          <a
            href="mailto:digitalhub.admin@gmail.com"
            className="rounded-full px-5 py-3 text-sm font-semibold text-slate-700 ring-2 ring-slate-300 hover:bg-slate-100"
          >
            Email support
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-amber-200 bg-amber-50 p-8 text-center">
      <h1 className="text-xl font-bold text-amber-900">Couldn’t verify the payment</h1>
      <p className="mt-2 text-sm text-amber-800">{state.message}</p>
      <p className="mt-4 text-xs text-amber-700">
        If your bank confirmed the debit, email{' '}
        <a href="mailto:digitalhub.admin@gmail.com" className="underline">
          digitalhub.admin@gmail.com
        </a>{' '}
        with your order id and we’ll unlock manually within 24 hours.
      </p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
      <dt className="text-slate-500">{label}</dt>
      <dd className="font-mono font-medium text-slate-800">{value}</dd>
    </div>
  );
}
