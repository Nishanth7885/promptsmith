'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/cart';

interface Props {
  slug: string;
  name: string;
  /** Per-category INR price snapshot. Falls back to 99 if unset. */
  priceInr?: number;
  className?: string;
}

export default function AddToCartButton({
  slug,
  name,
  priceInr = 99,
  className = '',
}: Props) {
  const { add, has, ready } = useCart();
  const router = useRouter();
  const [justAdded, setJustAdded] = useState(false);

  const inCart = ready && has(slug);

  const onClick = () => {
    if (inCart) {
      router.push('/cart');
      return;
    }
    add({ slug, name, priceInr });
    setJustAdded(true);
    // Brief feedback, then route to cart so user can see what they have.
    setTimeout(() => router.push('/cart'), 350);
  };

  const label = inCart ? 'View cart →' : justAdded ? 'Added ✓' : `Add to cart · ₹${priceInr}`;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:opacity-60 ${className}`}
    >
      {label}
    </button>
  );
}
