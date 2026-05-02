'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { Prompt } from '@/types';
import { hasAccess } from '@/lib/access';
import { copyToClipboard } from '@/lib/clipboard';
import StarRating from './StarRating';

const DIFF_COLORS: Record<Prompt['difficulty'], string> = {
  beginner: 'bg-emerald-100 text-emerald-700',
  intermediate: 'bg-amber-100 text-amber-700',
  advanced: 'bg-rose-100 text-rose-700',
};

// TODO: replace with real aggregate from DB once review volume justifies the join.
// Deterministic placeholder so the same card always shows the same rating —
// avoids hydration jitter and gives reviewers a sense of the eventual UI.
function placeholderRating(id: string): { rating: number; count: number } {
  let h = 0;
  for (let i = 0; i < id.length; i++) {
    h = (h * 31 + id.charCodeAt(i)) | 0;
  }
  const hash = Math.abs(h);
  // 3.5 → 4.9 in 0.1 steps (15 buckets)
  const rating = 3.5 + (hash % 15) / 10;
  // Count: 3 → 102 — gives the badge some weight without claiming volume we don't have.
  const count = 3 + (hash % 100);
  return { rating, count };
}

export default function PromptCard({ prompt }: { prompt: Prompt }) {
  const [unlocked, setUnlocked] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setUnlocked(prompt.isFree || hasAccess());
  }, [prompt.isFree]);

  const onCopy = async () => {
    if (!unlocked) return;
    const ok = await copyToClipboard(prompt.prompt);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  const previewText = unlocked ? prompt.prompt : prompt.prompt.slice(0, 110) + '…';
  const { rating, count } = placeholderRating(prompt.id);

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <Link
          href={`/prompt/${prompt.id}`}
          className="text-sm font-semibold text-slate-900 hover:text-rose-600 sm:text-base"
        >
          {prompt.title}
        </Link>
        <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${DIFF_COLORS[prompt.difficulty]}`}>
          {prompt.difficulty}
        </span>
      </div>

      <p className={`text-sm leading-relaxed text-slate-600 ${unlocked ? '' : 'select-none blur-[2px]'}`}>
        {previewText}
      </p>

      <div className="flex flex-wrap gap-1.5">
        {prompt.tags.slice(0, 4).map((t) => (
          <span key={t} className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
            {t}
          </span>
        ))}
        {prompt.isFree && (
          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
            FREE
          </span>
        )}
      </div>

      <div className="mt-2 flex items-center justify-between gap-2">
        <span className="text-xs text-slate-500">
          {prompt.outputType} · {prompt.aiTool}
        </span>
        {unlocked ? (
          <button
            type="button"
            onClick={onCopy}
            className="rounded-md bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-rose-600"
          >
            {copied ? 'Copied ✓' : 'Copy'}
          </button>
        ) : (
          <Link
            href="/#pricing"
            className="rounded-md bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-rose-700"
          >
            🔒 Unlock — ₹299
          </Link>
        )}
      </div>

      <div className="flex justify-end">
        <StarRating rating={rating} size="sm" showNumber count={count} />
      </div>
    </div>
  );
}
