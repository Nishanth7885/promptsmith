'use client';

import { SessionProvider } from 'next-auth/react';
import { Suspense, type ReactNode } from 'react';
import { CurrencyProvider } from './CurrencyContext';
import { PageViewTracker } from './PageViewTracker';
import { CartProvider } from '@/lib/cart';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <CurrencyProvider>
        <CartProvider>
          <Suspense fallback={null}>
            <PageViewTracker />
          </Suspense>
          {children}
        </CartProvider>
      </CurrencyProvider>
    </SessionProvider>
  );
}
