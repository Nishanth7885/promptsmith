'use client';

import Link from 'next/link';
import { useCurrency } from './CurrencyContext';

export function HeaderPriceBadge() {
  const { format } = useCurrency();
  return (
    <Link
      href="/#pricing"
      className="rounded-full bg-rose-600 px-4 py-2 text-white shadow-sm transition hover:bg-rose-700"
    >
      Get all 4,000+ prompts — {format()}
    </Link>
  );
}
