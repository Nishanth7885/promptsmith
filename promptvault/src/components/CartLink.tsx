'use client';

import Link from 'next/link';
import { useCart } from '@/lib/cart';

export function CartLink() {
  const { count, ready } = useCart();
  // Don't render the badge until we've hydrated from localStorage — otherwise
  // the server-rendered "0" mismatches a populated client cart and React
  // hydration warns.
  return (
    <Link
      href="/cart"
      className="relative inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition hover:text-[var(--text)]"
      style={{ color: 'var(--text-dim)' }}
      aria-label={count > 0 ? `Cart (${count} items)` : 'Cart'}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
      <span className="hidden sm:inline">Cart</span>
      {ready && count > 0 && (
        <span
          className="absolute -right-1 -top-1 grid h-4 min-w-[16px] place-items-center rounded-full px-1 text-[10px] font-bold leading-none text-white"
          style={{
            background: 'var(--grad-iri, linear-gradient(90deg,#7c5cff,#ff5cb4))',
            boxShadow: '0 2px 8px -2px rgba(124, 92, 255, 0.6)',
          }}
        >
          {count}
        </span>
      )}
    </Link>
  );
}
