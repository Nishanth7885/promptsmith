'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

export type Currency = 'INR' | 'USD';

export interface PricingState {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  inr: number;
  usd: number;
  productName: string;
  crossBorderEnabled: boolean;
  ready: boolean;
  format(amount?: number): string;
  defaultPrice(): number;
}

const Ctx = createContext<PricingState | null>(null);

const LS_KEY = 'ps_currency';

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>('INR');
  const [inr, setInr] = useState(249);
  const [usd, setUsd] = useState(2.99);
  const [productName, setProductName] = useState('Prompt Smith — 4,000+ Expert AI Prompts');
  const [crossBorderEnabled, setCrossBorderEnabled] = useState(false);
  const [ready, setReady] = useState(false);

  const setCurrency = useCallback((c: Currency) => {
    setCurrencyState(c);
    try {
      window.localStorage.setItem(LS_KEY, c);
    } catch {}
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const stored = (typeof window !== 'undefined' && window.localStorage.getItem(LS_KEY)) as
          | Currency
          | null;
        const res = await fetch('/api/geo', { cache: 'no-store' });
        const data = await res.json();
        if (cancelled) return;
        setInr(Number(data.inr ?? 249));
        setUsd(Number(data.usd ?? 2.99));
        setProductName(String(data.productName ?? productName));
        setCrossBorderEnabled(!!data.crossBorderEnabled);
        // Stored toggle wins; otherwise use geo-derived default.
        const fromGeo = (data.currency as Currency) ?? 'INR';
        setCurrencyState(stored ?? fromGeo);
      } catch {
        // keep defaults
      } finally {
        if (!cancelled) setReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo<PricingState>(
    () => ({
      currency,
      setCurrency,
      inr,
      usd,
      productName,
      crossBorderEnabled,
      ready,
      format(amount?: number) {
        const v = amount ?? (currency === 'INR' ? inr : usd);
        return currency === 'INR' ? `₹${v}` : `$${v.toFixed(2)}`;
      },
      defaultPrice() {
        return currency === 'INR' ? inr : usd;
      },
    }),
    [currency, setCurrency, inr, usd, productName, crossBorderEnabled, ready],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCurrency(): PricingState {
  const v = useContext(Ctx);
  if (!v) throw new Error('useCurrency outside CurrencyProvider');
  return v;
}
