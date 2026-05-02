'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { hasAccess, clearAccess } from '@/lib/access';
import CheckoutModal from './CheckoutModal';

interface Props {
  categorySlug: string;
  categoryName: string;
  className?: string;
  children?: React.ReactNode;
}

/**
 * Per-category purchase button (₹99 lifetime for ONE category).
 * Mirrors BuyButton.tsx but passes orderType='CATEGORY' through to checkout.
 */
export default function BuyCategoryButton({
  categorySlug,
  categoryName,
  className = '',
  children,
}: Props) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [legacyUnlocked, setLegacyUnlocked] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setLegacyUnlocked(hasAccess());
  }, []);

  const onClick = () => {
    if (legacyUnlocked) {
      const ok = window.confirm(
        'You already have lifetime access on this device. Reset and buy this category instead?',
      );
      if (ok) {
        clearAccess();
        setLegacyUnlocked(false);
      }
      return;
    }
    if (status === 'loading') return;
    if (!session?.user) {
      router.push(
        '/signup?callbackUrl=' +
          encodeURIComponent(window.location.pathname + '?buy=cat'),
      );
      return;
    }
    setOpen(true);
  };

  const label =
    children ??
    (legacyUnlocked
      ? '✓ Already unlocked — manage'
      : `Unlock ${categoryName} only — ₹99`);

  return (
    <>
      <button
        type="button"
        onClick={onClick}
        className={`inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-rose-600 ring-2 ring-rose-300 transition hover:bg-rose-50 ${className}`}
      >
        {label}
      </button>
      <CheckoutModal
        open={open}
        onClose={() => setOpen(false)}
        orderType="CATEGORY"
        categorySlug={categorySlug}
        categoryName={categoryName}
      />
    </>
  );
}
