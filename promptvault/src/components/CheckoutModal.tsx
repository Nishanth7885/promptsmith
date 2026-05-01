'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { getCashfree } from '@/lib/cashfree-client';
import { useCurrency } from './CurrencyContext';

interface Props {
  open: boolean;
  onClose: () => void;
}

interface PriceCheck {
  subtotal: number;
  discount: number;
  total: number;
  couponCode?: string;
  error?: string;
}

export default function CheckoutModal({ open, onClose }: Props) {
  const { data: session } = useSession();
  const currency = useCurrency();
  const email = session?.user?.email ?? '';

  const [phone, setPhone] = useState('');
  const [name, setName] = useState(session?.user?.name ?? '');
  const [coupon, setCoupon] = useState('');
  const [agree, setAgree] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [priceCheck, setPriceCheck] = useState<PriceCheck | null>(null);
  const [waitlistMode, setWaitlistMode] = useState(false);
  const [waitlistDone, setWaitlistDone] = useState(false);

  // Reset state when modal closes.
  useEffect(() => {
    if (!open) {
      setError(null);
      setPriceCheck(null);
      setBusy(false);
      setWaitlistMode(false);
      setWaitlistDone(false);
    }
  }, [open]);

  // International gate: USD when cross-border off → waitlist UI.
  useEffect(() => {
    if (open && currency.currency === 'USD' && !currency.crossBorderEnabled) {
      setWaitlistMode(true);
    } else {
      setWaitlistMode(false);
    }
  }, [open, currency.currency, currency.crossBorderEnabled]);

  if (!open) return null;

  const applyCoupon = async () => {
    if (!coupon.trim()) {
      setPriceCheck(null);
      return;
    }
    setError(null);
    try {
      const res = await fetch('/api/coupon/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currency: currency.currency,
          couponCode: coupon.trim().toUpperCase(),
        }),
      });
      const data = await res.json();
      if (data.valid) {
        setPriceCheck({
          subtotal: data.subtotal,
          discount: data.discount,
          total: data.total,
          couponCode: data.couponCode,
        });
      } else {
        setPriceCheck(null);
        setError(data.error ?? 'Coupon could not be applied.');
      }
    } catch {
      setError('Could not validate coupon — try again.');
    }
  };

  const joinWaitlist = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          currency: currency.currency,
          source: 'checkout',
        }),
      });
      if (!res.ok) throw new Error('Could not join the waitlist.');
      setWaitlistDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setBusy(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const cleanedPhone = phone.replace(/\s+/g, '');
    if (!/^\+?\d{10,15}$/.test(cleanedPhone)) {
      setError('Enter a valid mobile number with country code (10–15 digits).');
      return;
    }
    if (!agree) {
      setError('Please accept the terms before continuing.');
      return;
    }

    setBusy(true);
    try {
      const res = await fetch('/api/cashfree/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: cleanedPhone,
          name: name.trim() || undefined,
          currency: currency.currency,
          couponCode: priceCheck?.couponCode || undefined,
        }),
      });
      const order = await res.json();

      if (res.status === 401 && order.authRequired) {
        window.location.href = '/login?callbackUrl=' + encodeURIComponent(window.location.pathname);
        return;
      }
      if (res.status === 402 && order.waitlist) {
        setWaitlistMode(true);
        setBusy(false);
        return;
      }
      if (!res.ok) throw new Error(order.error ?? 'Could not start checkout.');

      // 100%-off coupon → already paid.
      if (order.free) {
        window.location.href = `/payment/return?order_id=${encodeURIComponent(order.orderId)}`;
        return;
      }

      const cashfree = await getCashfree(order.mode);
      cashfree.checkout({
        paymentSessionId: order.paymentSessionId,
        redirectTarget: '_self',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
      setBusy(false);
    }
  };

  // ---- Render ----

  const total = priceCheck?.total ?? currency.defaultPrice();
  const formatTotal = currency.currency === 'INR' ? `₹${total}` : `$${total.toFixed(2)}`;
  const formatSub =
    currency.currency === 'INR'
      ? `₹${priceCheck?.subtotal ?? currency.defaultPrice()}`
      : `$${(priceCheck?.subtotal ?? currency.defaultPrice()).toFixed(2)}`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-title"
      className="fixed inset-0 z-[100] grid place-items-center bg-black/70 p-4 backdrop-blur"
      onClick={(e) => {
        if (e.target === e.currentTarget && !busy) onClose();
      }}
    >
      <div className="w-full max-w-md rounded-2xl bg-white p-6 text-slate-900 shadow-2xl sm:p-8">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 id="checkout-title" className="text-xl font-extrabold">
              {waitlistMode ? 'Coming soon for you' : 'Get all 4,000+ prompts'}
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              {waitlistMode
                ? 'International checkout opens once Cashfree cross-border is approved.'
                : `${formatTotal} · One-time · Lifetime access`}
            </p>
          </div>
          {!busy && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="text-slate-400 hover:text-slate-700"
            >
              ✕
            </button>
          )}
        </div>

        {waitlistMode ? (
          waitlistDone ? (
            <div className="mt-5">
              <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                You're on the list. We'll email <strong>{email}</strong> when international payments open.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-4 w-full rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white"
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={joinWaitlist} className="mt-5 space-y-4">
              <p className="text-sm text-slate-600">
                We'll notify <strong>{email}</strong> the moment international checkout opens.
              </p>
              {error && (
                <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
                  {error}
                </p>
              )}
              <button
                type="submit"
                disabled={busy}
                className="w-full rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
              >
                {busy ? 'Joining…' : 'Join the waitlist'}
              </button>
              <p className="text-center text-xs text-slate-500">
                Or switch the currency to INR if you have an Indian payment method.
              </p>
            </form>
          )
        ) : (
          <form onSubmit={handleSubmit} className="mt-5 space-y-3">
            <Field label="Email">
              <input
                type="email"
                value={email}
                disabled
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-600"
              />
            </Field>
            <Field label="Mobile (with country code)">
              <input
                type="tel"
                value={phone}
                required
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none ring-rose-500/30 focus:border-rose-500 focus:ring-2"
              />
            </Field>
            <Field label="Name (optional)">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="As you'd like it on the receipt"
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none ring-rose-500/30 focus:border-rose-500 focus:ring-2"
              />
            </Field>

            <Field label="Coupon code (optional)">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                  placeholder="LAUNCH20"
                  className="flex-1 rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-rose-500"
                />
                <button
                  type="button"
                  onClick={applyCoupon}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm hover:bg-slate-50"
                >
                  Apply
                </button>
              </div>
            </Field>

            {priceCheck && (
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-800">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatSub}</span>
                </div>
                <div className="flex justify-between">
                  <span>Discount ({priceCheck.couponCode})</span>
                  <span>
                    −
                    {currency.currency === 'INR'
                      ? `₹${priceCheck.discount}`
                      : `$${priceCheck.discount.toFixed(2)}`}
                  </span>
                </div>
                <div className="mt-1 flex justify-between border-t border-emerald-200 pt-1 font-semibold">
                  <span>Total</span>
                  <span>{formatTotal}</span>
                </div>
              </div>
            )}

            <label className="flex items-start gap-2 pt-1 text-xs text-slate-600">
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="mt-0.5 h-3.5 w-3.5 rounded border-slate-300 text-rose-600 focus:ring-rose-500"
              />
              <span>
                I agree to the <a href="/terms" className="underline">terms</a> and the{' '}
                <a href="/refund" className="underline">7-day refund policy</a>.
              </span>
            </label>

            {error && (
              <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={busy}
              className="mt-2 w-full rounded-full bg-rose-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-700 disabled:opacity-60"
            >
              {busy ? 'Starting secure checkout…' : `Pay ${formatTotal} with Cashfree`}
            </button>

            <p className="pt-2 text-center text-[11px] text-slate-500">
              Secure checkout by Cashfree (RBI-licensed PA) · UPI, Card, Net Banking, Wallets · PCI-DSS
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-medium text-slate-700">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}
