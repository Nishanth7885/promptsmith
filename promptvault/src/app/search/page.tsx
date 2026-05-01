import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SearchClient from './SearchClient';
import { Suspense } from 'react';

export const metadata = {
  title: 'Search prompts — Prompt Smith',
  description:
    'Search 4,000+ expert AI prompts by keyword, tag, profession, or industry.',
};

export default function SearchPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <Suspense fallback={<div className="text-center text-sm text-slate-500">Loading search…</div>}>
          <SearchClient />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
