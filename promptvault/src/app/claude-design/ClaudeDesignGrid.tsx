'use client';

import { useEffect, useMemo, useState } from 'react';
import PromptCard from '@/components/PromptCard';
import type { Prompt } from '@/types';
import type { SectionSlug } from './page';

interface SectionType {
  slug: SectionSlug;
  name: string;
  emoji: string;
  description: string;
}

interface Props {
  prompts: Prompt[];
  niches: string[];
  isFallback: boolean;
  sectionTypes: SectionType[];
}

const TOTAL_TARGET = 500;

export default function ClaudeDesignGrid({
  prompts,
  niches,
  isFallback,
  sectionTypes,
}: Props) {
  const [activeNiche, setActiveNiche] = useState<string>('all');
  const [activeSection, setActiveSection] = useState<SectionSlug | 'all'>('all');

  // On mount, read URL hash for ?section=hero etc. (set by section-grid links)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hash = window.location.hash; // e.g. "#prompts?section=hero"
    const idx = hash.indexOf('?');
    if (idx === -1) return;
    const search = new URLSearchParams(hash.slice(idx + 1));
    const sec = search.get('section');
    if (sec && sectionTypes.some((s) => s.slug === sec)) {
      setActiveSection(sec as SectionSlug);
    }
  }, [sectionTypes]);

  const niceNiche = (slug: string): string =>
    slug
      .split('-')
      .map((w) => (w.length > 0 ? w[0].toUpperCase() + w.slice(1) : w))
      .join(' ');

  const filtered = useMemo<Prompt[]>(() => {
    return prompts.filter((p) => {
      if (activeNiche !== 'all' && p.subcategory !== activeNiche) return false;
      if (activeSection !== 'all') {
        const inTags = p.tags.some(
          (t) => t.toLowerCase() === (activeSection as string).toLowerCase(),
        );
        const inId = p.id.toLowerCase().includes(activeSection as string);
        if (!inTags && !inId) return false;
      }
      return true;
    });
  }, [prompts, activeNiche, activeSection]);

  const activeNicheLabel =
    activeNiche === 'all' ? 'All niches' : niceNiche(activeNiche);
  const activeSectionLabel =
    activeSection === 'all'
      ? 'All sections'
      : (sectionTypes.find((s) => s.slug === activeSection)?.name ?? activeSection);

  return (
    <section
      id="prompts"
      className="mx-auto max-w-7xl scroll-mt-20 px-4 pb-12 sm:px-6"
    >
      {/* Niche header */}
      <div className="mx-auto max-w-2xl text-center">
        <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
          The 50 niches
        </span>
        <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          From accounting firms to zoos.
        </h2>
        <p className="mt-3 text-sm text-slate-600">
          Pick your niche. Pick your section. Copy the prompt. Ship the page.
        </p>
        {isFallback && (
          <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700 ring-1 ring-amber-200">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500" />
            More coming soon — first 5 niches in production
          </span>
        )}
      </div>

      {/* Niche chips */}
      <div className="mt-8 -mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <div className="flex min-w-max gap-2 sm:flex-wrap sm:justify-center">
          <NicheChip
            label="All"
            active={activeNiche === 'all'}
            onClick={() => setActiveNiche('all')}
          />
          {niches.map((n) => (
            <NicheChip
              key={n}
              label={niceNiche(n)}
              active={activeNiche === n}
              onClick={() => setActiveNiche(n)}
            />
          ))}
          {isFallback && (
            <span className="inline-flex items-center rounded-full border border-dashed border-slate-300 bg-white px-3.5 py-1.5 text-xs font-medium text-slate-400">
              + 45 more soon
            </span>
          )}
        </div>
      </div>

      {/* Section sub-filter */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5">
        <span className="mr-1 text-[11px] uppercase tracking-wider text-slate-500">
          Section:
        </span>
        <SectionChip
          label="All"
          active={activeSection === 'all'}
          onClick={() => setActiveSection('all')}
        />
        {sectionTypes.map((s) => (
          <SectionChip
            key={s.slug}
            label={`${s.emoji} ${s.name}`}
            active={activeSection === s.slug}
            onClick={() => setActiveSection(s.slug)}
          />
        ))}
      </div>

      {/* Count line */}
      <p className="mt-6 text-center text-xs text-slate-500">
        Showing <strong className="text-slate-800">{filtered.length}</strong> of{' '}
        {prompts.length || TOTAL_TARGET} · {activeNicheLabel} ·{' '}
        {activeSectionLabel}
      </p>

      {/* Grid */}
      <div className="mt-6">
        {prompts.length === 0 ? (
          <PlaceholderGrid />
        ) : filtered.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">
            No prompts match{' '}
            <strong className="text-slate-700">
              {activeNicheLabel} · {activeSectionLabel}
            </strong>{' '}
            yet. Try a different combination.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p) => (
              <PromptCard key={p.id} prompt={p} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

function NicheChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-semibold transition sm:text-sm ${
        active
          ? 'bg-slate-900 text-white shadow-sm'
          : 'border border-slate-200 bg-white text-slate-700 hover:border-rose-200 hover:text-rose-600'
      }`}
    >
      {label}
    </button>
  );
}

function SectionChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition ${
        active
          ? 'bg-rose-600 text-white'
          : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50 hover:text-slate-900'
      }`}
    >
      {label}
    </button>
  );
}

/* Placeholder grid shown when no claude-design prompts exist yet ------------ */

function PlaceholderGrid() {
  return (
    <>
      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: -400px 0;
          }
          100% {
            background-position: 400px 0;
          }
        }
        .shimmer {
          background: linear-gradient(
            90deg,
            rgba(241, 245, 249, 0.6) 0%,
            rgba(226, 232, 240, 1) 50%,
            rgba(241, 245, 249, 0.6) 100%
          );
          background-size: 800px 100%;
          animation: shimmer 1.8s linear infinite;
        }
      `}</style>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="h-4 w-2/3 rounded shimmer" />
              <div className="h-5 w-16 rounded-full shimmer" />
            </div>
            <div className="space-y-1.5">
              <div className="h-3 w-full rounded shimmer" />
              <div className="h-3 w-11/12 rounded shimmer" />
              <div className="h-3 w-9/12 rounded shimmer" />
            </div>
            <div className="flex flex-wrap gap-1.5">
              <div className="h-4 w-12 rounded-full shimmer" />
              <div className="h-4 w-16 rounded-full shimmer" />
              <div className="h-4 w-10 rounded-full shimmer" />
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-xs italic text-slate-400">
                Building this prompt…
              </span>
              <div className="h-7 w-16 rounded-md shimmer" />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
