'use client';

import { useMemo, useState } from 'react';
import { categories } from '@/data/prompts';
import CategoryCard from '@/components/CategoryCard';

export default function BrowseGrid() {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return categories;
    return categories.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.subcategories.some(
          (s) =>
            s.name.toLowerCase().includes(q) ||
            s.description.toLowerCase().includes(q),
        ),
    );
  }, [query]);

  return (
    <div className="mt-10">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter categories (e.g. medical, design, fintech)…"
          className="w-full rounded-full border border-slate-300 bg-white px-4 py-2.5 text-sm shadow-sm outline-none ring-rose-500/30 focus:border-rose-500 focus:ring-2 sm:max-w-md"
        />
        <p className="text-xs text-slate-500">
          Showing <span className="font-semibold text-slate-700">{filtered.length}</span> of {categories.length} categories
        </p>
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">
          No category matches “{query}”. Try a broader term or use the prompt search instead.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((c) => (
            <CategoryCard key={c.slug} category={c} />
          ))}
        </div>
      )}
    </div>
  );
}
