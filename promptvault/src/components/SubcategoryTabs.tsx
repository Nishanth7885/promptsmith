'use client';

import type { Subcategory } from '@/types';

interface Props {
  subcategories: Subcategory[];
  activeSlug: string;
  onSelect: (slug: string) => void;
  counts: Record<string, number>;
}

export default function SubcategoryTabs({ subcategories, activeSlug, onSelect, counts }: Props) {
  return (
    <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
      <div className="flex gap-2 pb-2">
        <button
          type="button"
          onClick={() => onSelect('all')}
          className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition ${
            activeSlug === 'all'
              ? 'bg-slate-900 text-white'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          All ({Object.values(counts).reduce((a, b) => a + b, 0)})
        </button>
        {subcategories.map((s) => (
          <button
            key={s.slug}
            type="button"
            onClick={() => onSelect(s.slug)}
            className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition ${
              activeSlug === s.slug
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
            title={s.description}
          >
            <span className="mr-1.5">{s.icon}</span>
            {s.name}
            <span className="ml-1.5 text-xs opacity-70">({counts[s.slug] || 0})</span>
          </button>
        ))}
      </div>
    </div>
  );
}
