import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SearchBar from '@/components/SearchBar';
import { categories, allPrompts } from '@/data/prompts';
import BrowseGrid from './BrowseGrid';

export const metadata = {
  title: 'Browse all categories — Prompt Smith',
  description:
    'Browse 4,000+ AI prompts across 35 professional categories. Filter by industry and difficulty.',
};

export default function BrowsePage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Browse {allPrompts.length.toLocaleString('en-IN')}+ prompts
          </h1>
          <p className="mt-3 text-sm text-slate-600">
            {categories.length} categories · 174 subcategories · Indian context throughout
          </p>
          <div className="mx-auto mt-6 max-w-2xl">
            <SearchBar />
          </div>
        </div>

        <BrowseGrid />
      </main>
      <Footer />
    </>
  );
}
