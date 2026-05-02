import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartView from './CartView';

export const metadata: Metadata = { title: 'Your cart · Prompt Smith' };

export default function CartPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
        <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: 'var(--text)' }}>
          Your cart
        </h1>
        <p className="mt-2 text-sm" style={{ color: 'var(--text-dim)' }}>
          Each category is ₹99 lifetime. Pick three or more and the all-access bundle becomes the better deal.
        </p>
        <CartView />
      </main>
      <Footer />
    </>
  );
}
