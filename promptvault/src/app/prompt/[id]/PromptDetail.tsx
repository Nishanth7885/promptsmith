'use client';

import { useEffect, useState, type ReactNode } from 'react';
import Link from 'next/link';
import type { Prompt } from '@/types';
import { hasAccess } from '@/lib/access';
import { copyToClipboard } from '@/lib/clipboard';
import ReviewForm from '@/components/ReviewForm';

interface PromptDetailProps {
  prompt: Prompt;
  // Server-rendered <ReviewsList /> passed in from the parent server page
  // (we can't import a server component directly inside this client file).
  reviewsList?: ReactNode;
}

export default function PromptDetail({ prompt, reviewsList }: PromptDetailProps) {
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
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section className="mt-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-500">
          The prompt
        </h2>
        {unlocked ? (
          <button
            type="button"
            onClick={onCopy}
            className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-rose-600"
          >
            {copied ? 'Copied to clipboard ✓' : 'Copy prompt'}
          </button>
        ) : (
          <Link
            href="/#pricing"
            className="rounded-full bg-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-rose-700"
          >
            🔒 Unlock — ₹299
          </Link>
        )}
      </div>

      <div className="relative mt-3">
        <pre
          className={`whitespace-pre-wrap rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm leading-relaxed text-slate-800 ${
            unlocked ? '' : 'select-none'
          }`}
        >
          {unlocked ? prompt.prompt : prompt.prompt.slice(0, 220) + '…'}
        </pre>
        {!unlocked && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 rounded-b-2xl bg-gradient-to-t from-slate-50 via-slate-50/80 to-transparent" />
        )}
        {!unlocked && (
          <div className="absolute inset-0 grid place-items-center">
            <div className="rounded-xl bg-white/95 px-5 py-3 text-center shadow-lg ring-1 ring-slate-200">
              <p className="text-sm font-semibold text-slate-900">
                Unlock to copy + use this prompt
              </p>
              <p className="mt-1 text-xs text-slate-600">
                ₹299 one-time · Lifetime access · 4,929+ prompts
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Reviews — rendered above any related-prompts block in the page. */}
      {reviewsList}
      <ReviewForm promptId={prompt.id} />
    </section>
  );
}
