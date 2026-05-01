'use client';

import { useState } from 'react';
import { allPrompts, categories } from '@/data/prompts';
import { buildPromptZip, triggerBrowserDownload } from '@/lib/download';
import { getBuyerEmail, hasAccess } from '@/lib/access';

export default function DownloadButton({ className = '' }: { className?: string }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const onClick = async () => {
    setErr(null);
    if (!hasAccess()) {
      setErr('Buy lifetime access first.');
      return;
    }
    setBusy(true);
    try {
      const blob = await buildPromptZip({
        prompts: allPrompts,
        categories,
        buyerEmail: getBuyerEmail(),
      });
      triggerBrowserDownload(blob, `Prompt-Smith-${new Date().toISOString().slice(0, 10)}.zip`);
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Could not build download');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="inline-flex flex-col items-center gap-1">
      <button
        type="button"
        onClick={onClick}
        disabled={busy}
        className={`inline-flex items-center justify-center gap-2 rounded-full bg-rose-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      >
        {busy ? 'Packaging your ZIP…' : '⬇ Download offline ZIP'}
      </button>
      {err && <span className="text-xs text-rose-600">{err}</span>}
    </div>
  );
}
