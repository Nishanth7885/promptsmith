'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { hasAccess, clearAccess } from '@/lib/access';
import { useCurrency } from './CurrencyContext';
import CheckoutModal from './CheckoutModal';

interface Props {
  variant?: 'primary' | 'secondary';
  className?: string;
  children?: React.ReactNode;
}

export default function BuyButton({ variant = 'primary', className = '', children }: Props) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const currency = useCurrency();
  const [legacyUnlocked, setLegacyUnlocked] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setLegacyUnlocked(hasAccess());
  }, []);

  const onClick = () => {
    if (legacyUnlocked) {
      const ok = window.confirm(
        'You already have lifetime access on this device. Reset and buy again?',
      );
      if (ok) {
        clearAccess();
        setLegacyUnlocked(false);
      }
      return;
    }
    if (status === 'loading') return;
    if (!session?.user) {
      router.push('/signup?callbackUrl=' + encodeURIComponent(window.location.pathname + '?buy=1'));
      return;
    }
    setOpen(true);
  };

  const base =
    variant === 'primary'
      ? 'bg-rose-600 text-white hover:bg-rose-700'
      : 'bg-white text-rose-600 ring-2 ring-rose-600 hover:bg-rose-50';

  const priceLabel = currency.format();
  const label =
    children ??
    (legacyUnlocked
      ? '✓ Unlocked on this device — manage'
      : `Get instant access — ${priceLabel}`);

  return (
    <>
      <button
        type="button"
        onClick={onClick}
        className={`inline-flex items-center justify-center rounded-full px-7 py-3.5 text-sm font-semibold shadow-sm transition ${base} ${className}`}
      >
        {label}
      </button>
      <CheckoutModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
