'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useCart } from '@/lib/cart';
import CheckoutModal from '@/components/CheckoutModal';

const ALL_ACCESS_PRICE_INR = 299;
const NUDGE_AT = 3;

export default function CartView() {
  const { items, count, totalInr, remove, clear, ready } = useCart();
  const { data: session, status } = useSession();
  const router = useRouter();
  const [openCart, setOpenCart] = useState(false);
  const [openAll, setOpenAll] = useState(false);

  // Avoid hydration mismatch — wait until cart loaded from localStorage.
  if (!ready) {
    return (
      <div className="mt-8 rounded-2xl border border-slate-700/40 bg-slate-900/40 p-8 text-sm text-slate-400">
        Loading cart…
      </div>
    );
  }

  if (count === 0) {
    return (
      <div
        className="mt-8 rounded-2xl border p-10 text-center"
        style={{ borderColor: 'var(--border)', background: 'var(--surface, rgba(255,255,255,0.03))' }}
      >
        <p style={{ color: 'var(--text)' }} className="text-lg font-semibold">
          Your cart is empty.
        </p>
        <p className="mt-1 text-sm" style={{ color: 'var(--text-dim)' }}>
          Browse the vault and add categories you want lifetime access to.
        </p>
        <Link
          href="/browse"
          className="mt-5 inline-flex rounded-full px-5 py-2.5 text-sm font-semibold text-white"
          style={{ background: 'var(--grad-iri, linear-gradient(90deg,#7c5cff,#ff5cb4))' }}
        >
          Browse categories
        </Link>
      </div>
    );
  }

  const savings = totalInr - ALL_ACCESS_PRICE_INR;
  const showAllAccessNudge = count >= NUDGE_AT && totalInr > ALL_ACCESS_PRICE_INR;

  const startCheckout = () => {
    if (status === 'loading') return;
    if (!session?.user) {
      router.push('/signup?callbackUrl=' + encodeURIComponent('/cart'));
      return;
    }
    setOpenCart(true);
  };

  const startAllAccess = () => {
    if (status === 'loading') return;
    if (!session?.user) {
      router.push('/signup?callbackUrl=' + encodeURIComponent('/cart'));
      return;
    }
    setOpenAll(true);
  };

  return (
    <>
      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* Items */}
        <div
          className="rounded-2xl border"
          style={{ borderColor: 'var(--border)', background: 'var(--surface, rgba(255,255,255,0.03))' }}
        >
          <ul className="divide-y" style={{ borderColor: 'var(--border)' }}>
            {items.map((item) => (
              <li key={item.slug} className="flex items-center justify-between gap-4 p-5">
                <div className="min-w-0">
                  <Link
                    href={`/category/${item.slug}`}
                    className="font-semibold hover:underline"
                    style={{ color: 'var(--text)' }}
                  >
                    {item.name}
                  </Link>
                  <p className="mt-0.5 text-xs" style={{ color: 'var(--text-mute, #94a3b8)' }}>
                    Lifetime access · single category
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-semibold tabular-nums" style={{ color: 'var(--text)' }}>
                    ₹{item.priceInr}
                  </span>
                  <button
                    type="button"
                    onClick={() => remove(item.slug)}
                    className="rounded-full px-3 py-1 text-xs font-medium hover:bg-rose-500/10 hover:text-rose-300"
                    style={{ color: 'var(--text-dim)' }}
                    aria-label={`Remove ${item.name}`}
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="flex items-center justify-between p-5" style={{ borderTop: '1px solid var(--border)' }}>
            <button
              type="button"
              onClick={clear}
              className="text-xs font-medium underline-offset-2 hover:underline"
              style={{ color: 'var(--text-mute, #94a3b8)' }}
            >
              Clear cart
            </button>
            <Link
              href="/browse"
              className="text-xs font-medium underline-offset-2 hover:underline"
              style={{ color: 'var(--text-dim)' }}
            >
              ← Add more categories
            </Link>
          </div>
        </div>

        {/* Summary */}
        <aside className="space-y-4">
          {showAllAccessNudge && (
            <div
              className="rounded-2xl border p-5"
              style={{
                borderColor: 'rgba(124, 92, 255, 0.4)',
                background:
                  'linear-gradient(135deg, rgba(124, 92, 255, 0.12), rgba(255, 92, 180, 0.08))',
              }}
            >
              <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
                Unlock everything for ₹{ALL_ACCESS_PRICE_INR}
              </p>
              <p className="mt-1 text-xs" style={{ color: 'var(--text-dim)' }}>
                You'd save ₹{savings} versus buying these {count} categories one by one — and you'd
                get all 4,900+ prompts across every category, forever.
              </p>
              <button
                type="button"
                onClick={startAllAccess}
                className="mt-3 w-full rounded-full px-4 py-2.5 text-sm font-semibold text-white"
                style={{
                  background: 'var(--grad-iri, linear-gradient(90deg,#7c5cff,#ff5cb4))',
                  boxShadow: '0 6px 20px -8px rgba(124, 92, 255, 0.6)',
                }}
              >
                Switch to all-access · ₹{ALL_ACCESS_PRICE_INR}
              </button>
            </div>
          )}

          <div
            className="rounded-2xl border p-5"
            style={{ borderColor: 'var(--border)', background: 'var(--surface, rgba(255,255,255,0.03))' }}
          >
            <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--text-mute, #94a3b8)' }}>
              Order summary
            </h2>
            <div className="mt-3 space-y-1.5 text-sm" style={{ color: 'var(--text-dim)' }}>
              <div className="flex justify-between">
                <span>{count} {count === 1 ? 'category' : 'categories'}</span>
                <span className="tabular-nums">₹{totalInr}</span>
              </div>
              <div className="flex justify-between">
                <span>Lifetime access</span>
                <span className="text-emerald-400">Included</span>
              </div>
            </div>
            <div
              className="mt-3 flex justify-between border-t pt-3 text-base font-semibold"
              style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
            >
              <span>Total</span>
              <span className="tabular-nums">₹{totalInr}</span>
            </div>
            <button
              type="button"
              onClick={startCheckout}
              className="mt-4 w-full rounded-full bg-rose-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-700"
            >
              Checkout · ₹{totalInr}
            </button>
            <p className="mt-3 text-center text-[11px]" style={{ color: 'var(--text-mute, #94a3b8)' }}>
              Secure UPI/Card/Net Banking via Cashfree.
            </p>
          </div>
        </aside>
      </div>

      <CheckoutModal
        open={openCart}
        onClose={() => setOpenCart(false)}
        orderType="CATEGORY"
        categorySlugs={items.map((i) => i.slug)}
        cartTotalInr={totalInr}
      />
      <CheckoutModal
        open={openAll}
        onClose={() => setOpenAll(false)}
        orderType="ALL"
      />
    </>
  );
}
