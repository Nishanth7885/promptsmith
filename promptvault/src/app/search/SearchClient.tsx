'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { searchPrompts, type SearchEntry } from '@/lib/search';
import { categories } from '@/data/prompts';

const POPULAR_QUERIES = [
  'UPSC essay',
  'GST return',
  'biryani',
  'startup pitch',
  'Diwali campaign',
  'patient consent',
  'system design',
  'wedding',
  'cybersecurity',
];

export default function SearchClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQ = searchParams?.get('q') ?? '';
  const [q, setQ] = useState(initialQ);
  const [debounced, setDebounced] = useState(initialQ);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  useEffect(() => {
    const t = setTimeout(() => setDebounced(q), 220);
    return () => clearTimeout(t);
  }, [q]);

  // Sync URL when debounced query changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    if (debounced) url.searchParams.set('q', debounced);
    else url.searchParams.delete('q');
    window.history.replaceState({}, '', url.toString());
  }, [debounced]);

  const results = useMemo<SearchEntry[]>(() => {
    if (!debounced.trim()) return [];
    const found = searchPrompts(debounced, 200);
    if (categoryFilter === 'all') return found;
    return found.filter((r) => r.category === categoryFilter);
  }, [debounced, categoryFilter]);

  const categoryCounts = useMemo(() => {
    if (!debounced.trim()) return {} as Record<string, number>;
    const all = searchPrompts(debounced, 500);
    const counts: Record<string, number> = {};
    for (const r of all) counts[r.category] = (counts[r.category] || 0) + 1;
    return counts;
  }, [debounced]);

  return (
    <>
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Search prompts</h1>
        <p className="mt-2 text-sm text-slate-600">
          Fuzzy search across all 4,029 prompts — title, tags, content, and category.
        </p>
      </div>

      <div className="relative mb-6">
        <input
          type="search"
          value={q}
          autoFocus
          onChange={(e) => setQ(e.target.value)}
          placeholder="Try: NEET PG, board resolution, founder offsite, Konkani recipe…"
          className="h-14 w-full rounded-full border border-slate-300 bg-white px-5 pr-12 text-base shadow-sm outline-none ring-rose-500/30 focus:border-rose-500 focus:ring-2"
        />
        {q && (
          <button
            type="button"
            onClick={() => {
              setQ('');
              router.replace('/search');
            }}
            aria-label="Clear search"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
          >
            ✕
          </button>
        )}
      </div>

      {!debounced.trim() && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <p className="text-sm font-semibold text-slate-700">Popular searches</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {POPULAR_QUERIES.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setQ(p)}
                className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-700 transition hover:border-rose-500 hover:text-rose-600"
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      )}

      {debounced.trim() && (
        <>
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <p className="text-sm text-slate-600">
              <span className="font-semibold text-slate-900">{results.length}</span> results for{' '}
              <span className="font-semibold text-slate-900">“{debounced}”</span>
            </p>
            {Object.keys(categoryCounts).length > 1 && (
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="ml-auto rounded-full border border-slate-300 bg-white px-3 py-1.5 text-sm shadow-sm outline-none focus:border-rose-500"
              >
                <option value="all">
                  All categories ({Object.values(categoryCounts).reduce((a, b) => a + b, 0)})
                </option>
                {categories
                  .filter((c) => categoryCounts[c.slug])
                  .map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.name} ({categoryCounts[c.slug]})
                    </option>
                  ))}
              </select>
            )}
          </div>

          {results.length === 0 ? (
            <p className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">
              No prompts match “{debounced}”. Try a broader keyword or check the{' '}
              <Link href="/browse" className="text-rose-600 underline">
                browse page
              </Link>
              .
            </p>
          ) : (
            <ul className="space-y-3">
              {results.map((r) => (
                <ResultRow key={r.id} entry={r} highlight={debounced} />
              ))}
            </ul>
          )}
        </>
      )}
    </>
  );
}

const DIFF_COLORS: Record<SearchEntry['difficulty'], string> = {
  beginner: 'bg-emerald-100 text-emerald-700',
  intermediate: 'bg-amber-100 text-amber-700',
  advanced: 'bg-rose-100 text-rose-700',
};

function ResultRow({ entry, highlight }: { entry: SearchEntry; highlight: string }) {
  const cat = categories.find((c) => c.slug === entry.category);
  return (
    <li>
      <Link
        href={`/prompt/${entry.id}`}
        className="group block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-rose-300 hover:shadow-md"
      >
        <div className="flex items-start justify-between gap-3">
          <h3
            className="text-base font-semibold text-slate-900 group-hover:text-rose-600"
            dangerouslySetInnerHTML={{ __html: highlightText(entry.title, highlight) }}
          />
          <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${DIFF_COLORS[entry.difficulty]}`}>
            {entry.difficulty}
          </span>
        </div>
        <p
          className="mt-2 line-clamp-2 text-sm text-slate-600"
          dangerouslySetInnerHTML={{ __html: highlightText(entry.snippet + '…', highlight) }}
        />
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
          {cat && (
            <span
              className="rounded-full px-2 py-0.5 font-medium text-white"
              style={{ backgroundColor: cat.color }}
            >
              {cat.icon} {cat.name}
            </span>
          )}
          <span className="text-slate-400">›</span>
          <span className="font-medium text-slate-700">{entry.subcategory}</span>
          <span className="text-slate-400">·</span>
          {entry.tags.slice(0, 3).map((t) => (
            <span key={t} className="rounded-full bg-slate-100 px-2 py-0.5 text-slate-600">
              {t}
            </span>
          ))}
          {entry.isFree && (
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 font-semibold text-emerald-700">
              FREE
            </span>
          )}
        </div>
      </Link>
    </li>
  );
}

function highlightText(text: string, query: string): string {
  if (!query.trim()) return escapeHtml(text);
  const safeText = escapeHtml(text);
  const tokens = query
    .trim()
    .split(/\s+/)
    .filter((t) => t.length >= 2)
    .map(escapeRegex);
  if (tokens.length === 0) return safeText;
  const re = new RegExp(`(${tokens.join('|')})`, 'gi');
  return safeText.replace(re, '<mark class="rounded bg-amber-200/70 px-0.5">$1</mark>');
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
