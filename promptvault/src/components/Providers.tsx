'use client';

import { SessionProvider } from 'next-auth/react';
import { Suspense, type ReactNode } from 'react';
import { CurrencyProvider } from './CurrencyContext';
import { PageViewTracker } from './PageViewTracker';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <CurrencyProvider>
        <Suspense fallback={null}>
          <PageViewTracker />
        </Suspense>
        {children}
      </CurrencyProvider>
    </SessionProvider>
  );
}
