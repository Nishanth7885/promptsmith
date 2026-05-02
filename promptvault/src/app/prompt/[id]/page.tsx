import Link from 'next/link';
import { notFound } from 'next/navigation';
import { allPrompts, categories } from '@/data/prompts';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BuyButton from '@/components/BuyButton';
import PromptDetail from './PromptDetail';
import RelatedPrompts from './RelatedPrompts';
import ReviewsList from '@/components/ReviewsList';

export function generateStaticParams() {
  return allPrompts.map((p) => ({ id: p.id }));
}

export function generateMetadata({ params }: { params: { id: string } }) {
  const prompt = allPrompts.find((p) => p.id === params.id);
  if (!prompt) return { title: 'Prompt not found' };
  return {
    title: `${prompt.title} — Prompt Smith`,
    description: prompt.prompt.slice(0, 160),
  };
}

export default function PromptPage({ params }: { params: { id: string } }) {
  const prompt = allPrompts.find((p) => p.id === params.id);
  if (!prompt) notFound();

  const category = categories.find((c) => c.slug === prompt.category);
  const subcategory = category?.subcategories.find((s) => s.slug === prompt.subcategory);

  const related = allPrompts
    .filter(
      (p) =>
        p.id !== prompt.id &&
        (p.subcategory === prompt.subcategory ||
          p.tags.some((t) => prompt.tags.includes(t))),
    )
    .slice(0, 6);

  return (
    <>
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
        <nav className="text-xs text-slate-500">
          <Link href="/" className="hover:text-rose-600">Home</Link>
          <span className="mx-2">/</span>
          {category && (
            <>
              <Link href={`/category/${category.slug}`} className="hover:text-rose-600">
                {category.name}
              </Link>
              <span className="mx-2">/</span>
            </>
          )}
          {subcategory && <span className="text-slate-700">{subcategory.name}</span>}
        </nav>

        <article className="mt-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
          <header>
            <h1 className="text-2xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-3xl">
              {prompt.title}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
              {category && (
                <span
                  className="rounded-full px-2 py-0.5 font-medium text-white"
                  style={{ backgroundColor: category.color }}
                >
                  {category.icon} {category.name}
                </span>
              )}
              {subcategory && (
                <Link
                  href={`/category/${prompt.category}#${prompt.subcategory}`}
                  className="rounded-full bg-slate-100 px-2 py-0.5 text-slate-700 hover:bg-slate-200"
                >
                  {subcategory.icon} {subcategory.name}
                </Link>
              )}
              <DiffBadge difficulty={prompt.difficulty} />
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-slate-700">
                {prompt.outputType}
              </span>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-slate-700">
                Works with: {prompt.aiTool}
              </span>
              {prompt.isFree && (
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 font-semibold text-emerald-700">
                  FREE
                </span>
              )}
            </div>
          </header>

          <PromptDetail
            prompt={prompt}
            reviewsList={<ReviewsList promptId={prompt.id} />}
          />

          <section className="mt-8">
            <h3 className="text-sm font-semibold text-slate-700">Tags</h3>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {prompt.tags.map((t) => (
                <span key={t} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-700">
                  #{t}
                </span>
              ))}
            </div>
          </section>

          {!prompt.isFree && (
            <div className="mt-8 rounded-2xl border border-rose-100 bg-rose-50 p-5 text-center">
              <p className="text-sm font-semibold text-rose-900">
                Like this prompt? Unlock all {allPrompts.length.toLocaleString('en-IN')}+ prompts for ₹299.
              </p>
              <p className="mt-1 text-xs text-rose-700">
                Lifetime access · Free updates · Offline download
              </p>
              <div className="mt-4 flex justify-center">
                <BuyButton />
              </div>
            </div>
          )}
        </article>

        {related.length > 0 && <RelatedPrompts prompts={related} />}
      </main>
      <Footer />
    </>
  );
}

function DiffBadge({ difficulty }: { difficulty: 'beginner' | 'intermediate' | 'advanced' }) {
  const map = {
    beginner: 'bg-emerald-100 text-emerald-700',
    intermediate: 'bg-amber-100 text-amber-700',
    advanced: 'bg-rose-100 text-rose-700',
  };
  return (
    <span className={`rounded-full px-2 py-0.5 font-medium ${map[difficulty]}`}>
      {difficulty}
    </span>
  );
}
