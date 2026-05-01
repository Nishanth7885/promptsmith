'use client';

import { useMemo, useState } from 'react';
import type { Category, Prompt } from '@/types';
import PromptCard from '@/components/PromptCard';
import SubcategoryTabs from '@/components/SubcategoryTabs';

const DIFFICULTIES = ['all', 'beginner', 'intermediate', 'advanced'] as const;
type Difficulty = (typeof DIFFICULTIES)[number];

interface Props {
  category: Category;
  prompts: Prompt[];
  counts: Record<string, number>;
}

export default function CategoryView({ category, prompts, counts }: Props) {
  const [activeSub, setActiveSub] = useState<string>('all');
  const [difficulty, setDifficulty] = useState<Difficulty>('all');
  const [freeOnly, setFreeOnly] = useState(false);

  const visible = useMemo(() => {
    return prompts.filter((p) => {
      if (activeSub !== 'all' && p.subcategory !== activeSub) return false;
      if (difficulty !== 'all' && p.difficulty !== difficulty) return false;
      if (freeOnly && !p.isFree) return false;
      return true;
    });
  }, [prompts, activeSub, difficulty, freeOnly]);

  return (
    <div className="mt-8">
      <SubcategoryTabs
        subcategories={category.subcategories}
        activeSlug={activeSub}
        onSelect={setActiveSub}
        counts={counts}
      />

      <div className="mt-5 flex flex-wrap items-center gap-3 border-y border-slate-200 py-4">
        <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
          Filter:
        </span>
        <div className="flex flex-wrap gap-2">
          {DIFFICULTIES.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDifficulty(d)}
              className={`rounded-full px-3 py-1 text-xs font-medium capitalize transition ${
                difficulty === d
                  ? 'bg-rose-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-2 text-xs text-slate-600">
          <input
            type="checkbox"
            checked={freeOnly}
            onChange={(e) => setFreeOnly(e.target.checked)}
            className="h-3.5 w-3.5 rounded border-slate-300 text-rose-600 focus:ring-rose-500"
          />
          Free preview only
        </label>
        <span className="ml-auto text-xs text-slate-500">
          Showing <span className="font-semibold text-slate-700">{visible.length}</span> prompts
        </span>
      </div>

      {visible.length === 0 ? (
        <p className="mt-10 rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">
          No prompts match the current filter. Try clearing it or switching subcategory.
        </p>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map((p) => (
            <PromptCard key={p.id} prompt={p} />
          ))}
        </div>
      )}
    </div>
  );
}
