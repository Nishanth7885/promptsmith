import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Suspense } from 'react';
import PaymentReturnClient from './PaymentReturnClient';

export const metadata = {
  title: 'Payment status — Prompt Smith',
  robots: { index: false, follow: false },
};

export default function PaymentReturnPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-2xl px-4 py-12 sm:px-6 sm:py-16">
        <Suspense fallback={<p className="text-center text-sm text-slate-500">Verifying your payment…</p>}>
          <PaymentReturnClient />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
