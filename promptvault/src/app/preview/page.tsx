import Link from 'next/link';
import { allPrompts, categories, getFreePrompts } from '@/data/prompts';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PromptCard from '@/components/PromptCard';
import BuyButton from '@/components/BuyButton';

export const metadata = {
  title: 'Free 251-prompt preview — Prompt Smith',
  description:
    'Try before you buy: 251 free expert AI prompts across 36 categories. No login required.',
};

export default function PreviewPage({ searchParams }: { searchParams: { welcome?: string } }) {
  const free = getFreePrompts();
  const justSignedUp = searchParams?.welcome === '1';
  const grouped: Record<string, typeof free> = {};
  for (const p of free) {
    grouped[p.category] = grouped[p.category] || [];
    grouped[p.category].push(p);
  }

  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
        {justSignedUp && (
          <div className="mx-auto mb-8 max-w-2xl rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
            <strong>Welcome to Prompt Smith!</strong> Your account is ready — explore the free
            prompts below. Check your inbox for a verification email so you don't miss receipts
            and updates.
          </div>
        )}
        <div className="text-center">
          <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
            🎁 Free tier · 251 prompts
          </span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            {free.length} free preview prompts
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-600">
            Two prompts from every subcategory are free to try. Copy, test with your favourite
            AI tool, and see the quality before unlocking all {allPrompts.length.toLocaleString('en-IN')}+ prompts.
          </p>
          <div className="mt-6 flex justify-center">
            <BuyButton>Get full access</BuyButton>
          </div>
        </div>

        <div className="mt-12 space-y-12">
          {categories
            .filter((c) => grouped[c.slug])
            .map((c) => (
              <section key={c.slug} id={c.slug}>
                <div className="mb-4 flex items-center justify-between">
                  <Link href={`/category/${c.slug}`}>
                    <h2 className="text-xl font-bold text-slate-900 hover:text-rose-600 sm:text-2xl">
                      <span className="mr-2">{c.icon}</span>
                      {c.name}
                      <span className="ml-2 text-sm font-medium text-slate-500">
                        ({grouped[c.slug].length} free)
                      </span>
                    </h2>
                  </Link>
                  <Link
                    href={`/category/${c.slug}`}
                    className="text-sm font-semibold text-rose-600 hover:text-rose-700"
                  >
                    See all in {c.name} →
                  </Link>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {grouped[c.slug].slice(0, 6).map((p) => (
                    <PromptCard key={p.id} prompt={p} />
                  ))}
                </div>
                {grouped[c.slug].length > 6 && (
                  <p className="mt-3 text-center text-xs text-slate-500">
                    +{grouped[c.slug].length - 6} more free prompts in {c.name}.{' '}
                    <Link
                      href={`/category/${c.slug}`}
                      className="font-medium text-rose-600 hover:text-rose-700"
                    >
                      View all
                    </Link>
                  </p>
                )}
              </section>
            ))}
        </div>

        <section className="mt-16 rounded-3xl bg-gradient-to-br from-slate-900 to-rose-900 p-10 text-center text-white">
          <h2 className="text-2xl font-bold sm:text-3xl">
            Loved the preview? Unlock all {allPrompts.length.toLocaleString('en-IN')}+ prompts.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-slate-200">
            Lifetime access · Free updates · Offline ZIP · Pay once
          </p>
          <div className="mt-6 flex justify-center">
            <BuyButton />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
