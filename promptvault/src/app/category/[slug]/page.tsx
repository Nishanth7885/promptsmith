import { notFound } from 'next/navigation';
import Link from 'next/link';
import { categories, getPromptsByCategory } from '@/data/prompts';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BuyCategoryButton from '@/components/BuyCategoryButton';
import AddToCartButton from '@/components/AddToCartButton';
import { getCategoryPrice } from '@/lib/pricing';
import { getPricing } from '@/lib/settings';
import CategoryView from './CategoryView';

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

// ISR: rebuild at most once a minute so admin pricing updates propagate without
// a full deploy. The actual price charged at checkout is always the live DB
// value — this snapshot only feeds the on-page display + cart line.
export const revalidate = 60;

export function generateMetadata({ params }: { params: { slug: string } }) {
  const category = categories.find((c) => c.slug === params.slug);
  if (!category) return { title: 'Category not found' };
  return {
    title: `${category.name} AI Prompts — Prompt Smith`,
    description: `${category.totalPrompts}+ ready-to-use AI prompts for ${category.name}: ${category.description}`,
  };
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const category = categories.find((c) => c.slug === params.slug);
  if (!category) notFound();

  const prompts = getPromptsByCategory(category.slug);
  const counts: Record<string, number> = {};
  for (const sc of category.subcategories) {
    counts[sc.slug] = prompts.filter((p) => p.subcategory === sc.slug).length;
  }
  const freeInCategory = prompts.filter((p) => p.isFree).length;
  const [categoryPrice, pricing] = await Promise.all([
    getCategoryPrice('INR'),
    getPricing(),
  ]);

  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Breadcrumb */}
        <nav className="text-xs text-slate-500">
          <Link href="/" className="hover:text-rose-600">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/browse" className="hover:text-rose-600">Browse</Link>
          <span className="mx-2">/</span>
          <span className="text-slate-700">{category.name}</span>
        </nav>

        {/* Header */}
        <div
          className="mt-5 overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10"
          style={{ borderLeftColor: category.color, borderLeftWidth: '6px' }}
        >
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <span className="text-5xl" aria-hidden>{category.icon}</span>
                <div>
                  <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                    {category.name}
                  </h1>
                  <p className="mt-1 text-sm text-slate-600">
                    {category.subcategories.length} subcategories ·{' '}
                    <span className="font-semibold" style={{ color: category.color }}>
                      {prompts.length} prompts available
                    </span>
                    {freeInCategory > 0 && (
                      <>
                        {' '}·{' '}
                        <span className="font-semibold text-emerald-700">
                          {freeInCategory} free
                        </span>
                      </>
                    )}
                  </p>
                </div>
              </div>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-600">
                {category.description}
              </p>
            </div>
            <div className="flex shrink-0 flex-col items-stretch gap-2 sm:items-end">
              <BuyCategoryButton categorySlug={category.slug} categoryName={category.name} />
              <AddToCartButton
                slug={category.slug}
                name={category.name}
                priceInr={categoryPrice}
              />
              <p className="text-center text-[11px] text-slate-500 sm:text-right">
                Or get all {categories.length} categories for ₹{pricing.inr} —{' '}
                <Link href="/#pricing" className="underline hover:text-rose-600">
                  see all-access
                </Link>
              </p>
            </div>
          </div>
        </div>

        <CategoryView
          category={category}
          prompts={prompts}
          counts={counts}
        />
      </main>
      <Footer />
    </>
  );
}
