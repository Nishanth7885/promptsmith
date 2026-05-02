import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BuyButton from '@/components/BuyButton';
import { allPrompts } from '@/data/prompts';
import type { Prompt } from '@/types';
import PreviewClient from './PreviewClient';
import ClaudeDesignGrid from './ClaudeDesignGrid';

export const metadata = {
  title: 'Claude Design — 500 prompts to build any landing page · Prompt Smith',
  description:
    'Claude Design is a 500-prompt landing page builder pack: 50 niches × 10 section types (hero, features, pricing, FAQ, testimonials, CTA, brand voice, SEO, how-it-works, footer). Bundled in your all-access Prompt Smith purchase.',
};

interface SectionType {
  slug: SectionSlug;
  name: string;
  emoji: string;
  description: string;
}

export type SectionSlug =
  | 'hero'
  | 'features'
  | 'pricing'
  | 'faq'
  | 'testimonials'
  | 'cta'
  | 'brand-voice'
  | 'seo'
  | 'how-it-works'
  | 'footer';

const SECTION_TYPES: SectionType[] = [
  {
    slug: 'hero',
    name: 'Hero',
    emoji: '🎯',
    description: 'Eyebrow, H1, subhead, two CTAs, trust line — the make-or-break first 5 seconds.',
  },
  {
    slug: 'features',
    name: 'Features',
    emoji: '✨',
    description: '3 to 6 benefit-led feature cards that translate code into customer outcomes.',
  },
  {
    slug: 'pricing',
    name: 'Pricing',
    emoji: '💰',
    description: 'Tier names, anchored prices, feature checklists, and the "most popular" nudge.',
  },
  {
    slug: 'faq',
    name: 'FAQ',
    emoji: '❓',
    description: 'Objection-killing Q&As that pre-empt the 8 questions that block every signup.',
  },
  {
    slug: 'testimonials',
    name: 'Testimonials',
    emoji: '💬',
    description: 'Specific, quotable proof from real personas — never the generic "Great product!"',
  },
  {
    slug: 'cta',
    name: 'Call to action',
    emoji: '🚀',
    description: 'Mid-page and end-page conversion banners that match your offer\'s emotional hook.',
  },
  {
    slug: 'brand-voice',
    name: 'Brand voice',
    emoji: '🎙️',
    description: 'Tone, vocabulary, banned-words, and example rewrites — a voice guide your team can follow.',
  },
  {
    slug: 'seo',
    name: 'SEO meta',
    emoji: '🔍',
    description: 'Title tags, meta descriptions, Open Graph, and JSON-LD that earn the click.',
  },
  {
    slug: 'how-it-works',
    name: 'How it works',
    emoji: '🛠️',
    description: '3-step or 5-step process explainer with verbs, outcomes, and a clear "what next".',
  },
  {
    slug: 'footer',
    name: 'Footer',
    emoji: '🦶',
    description: 'Sitemap-style footer with newsletter capture, legal, social, and trust badges.',
  },
];

const FALLBACK_NICHES = [
  'SaaS B2B',
  'EdTech',
  'Restaurant',
  'D2C Brand',
  'Yoga Studio',
];

export default function ClaudeDesignPage() {
  const cdPrompts: Prompt[] = allPrompts.filter((p) => p.category === 'claude-design');
  const derivedNiches = Array.from(
    new Set(cdPrompts.map((p) => p.subcategory).filter(Boolean)),
  );
  const niches: string[] = derivedNiches.length > 0 ? derivedNiches : FALLBACK_NICHES;
  const isFallback = derivedNiches.length === 0;

  return (
    <>
      <Header />
      <main className="bg-gradient-to-b from-white via-rose-50/30 to-white">
        {/* HERO */}
        <section className="relative overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 -top-24 h-[420px] bg-[radial-gradient(60%_60%_at_50%_0%,rgba(244,114,182,0.20),rgba(167,139,250,0.18)_45%,rgba(255,255,255,0)_75%)]"
          />
          <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
            <div className="mx-auto max-w-3xl text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white/80 px-3 py-1 text-xs font-semibold tracking-wide text-rose-700 shadow-sm backdrop-blur">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-rose-500" />
                NEW · PACK
              </span>
              <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
                Claude Design — 500 prompts to build{' '}
                <span className="bg-gradient-to-r from-rose-600 via-fuchsia-600 to-violet-600 bg-clip-text italic text-transparent">
                  any landing page
                </span>
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
                50 niches × 10 section types. Hero copy to footer. Bundled in your all-access purchase.
              </p>

              <div className="mx-auto mt-7 inline-flex flex-wrap items-center justify-center gap-x-3 gap-y-1 rounded-full border border-slate-200 bg-white/70 px-5 py-2 text-xs font-medium text-slate-600 shadow-sm backdrop-blur sm:text-sm">
                <span><strong className="text-slate-900">500</strong> prompts</span>
                <span className="text-slate-300">·</span>
                <span><strong className="text-slate-900">50</strong> niches</span>
                <span className="text-slate-300">·</span>
                <span><strong className="text-slate-900">10</strong> sections</span>
                <span className="text-slate-300">·</span>
                <span><strong className="text-slate-900">1</strong> price</span>
              </div>

              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <BuyButton />
                <Link
                  href="#demo"
                  className="text-sm font-semibold text-slate-700 transition hover:text-rose-600"
                >
                  Skip to live demo ↓
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* LIVE PARALLAX PREVIEW (client) */}
        <PreviewClient />

        {/* SECTION TYPES GRID */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700">
              The 10 section types
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Every block of a landing page, covered.
            </h2>
            <p className="mt-3 text-sm text-slate-600">
              Each section ships with 50 niche-specific variants. Pick a niche, copy the prompt, paste into Claude.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
            {SECTION_TYPES.map((s) => (
              <a
                key={s.slug}
                href={`#prompts?section=${s.slug}`}
                data-section-link={s.slug}
                className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-rose-200 hover:shadow-md"
              >
                <div className="text-2xl">{s.emoji}</div>
                <div className="mt-3 text-sm font-bold text-slate-900">{s.name}</div>
                <p className="mt-1 line-clamp-3 text-xs leading-relaxed text-slate-600">
                  {s.description}
                </p>
                <div className="mt-3 text-xs font-semibold text-rose-600 opacity-0 transition group-hover:opacity-100">
                  View prompt →
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* NICHES + PROMPT GRID (client) */}
        <ClaudeDesignGrid
          prompts={cdPrompts}
          niches={niches}
          isFallback={isFallback}
          sectionTypes={SECTION_TYPES}
        />

        {/* FINAL CTA */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="relative overflow-hidden rounded-3xl p-[1.5px]">
            <div
              aria-hidden
              className="absolute inset-0 rounded-3xl bg-[conic-gradient(from_120deg,rgba(244,114,182,0.7),rgba(167,139,250,0.7),rgba(56,189,248,0.7),rgba(244,114,182,0.7))] opacity-80"
            />
            <div className="relative rounded-[calc(1.5rem-1.5px)] bg-white p-10 text-center sm:p-14">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Get Claude Design + 4,000+ other prompts.
                <span className="block text-slate-500">One purchase, lifetime access.</span>
              </h2>
              <p className="mx-auto mt-3 max-w-md text-sm text-slate-600">
                Already a member?{' '}
                <Link href="/login" className="font-semibold text-rose-600 hover:text-rose-700">
                  Sign in to access.
                </Link>
              </p>
              <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <BuyButton />
                <Link
                  href="/browse"
                  className="text-sm font-semibold text-slate-700 transition hover:text-rose-600"
                >
                  Browse the full vault →
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
