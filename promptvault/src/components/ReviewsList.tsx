'use client';

// Reviews list — runs client-side after the prompt page is static-rendered.
// Avoids DB access during `next build` prerender (which would either fail
// because the local sqlite file does not exist yet, or contend with the
// running production service for a SQLite write lock).
//
// The /api/reviews GET handler is the public read endpoint and is also what
// ReviewForm refreshes against after a POST.
import { useEffect, useState } from 'react';
import StarRating from './StarRating';

interface Props {
  promptId: string;
}

interface ApiReview {
  id: string;
  rating: number;
  comment: string | null;
  verifiedPurchaser: boolean;
  createdAt: string;
  authorName?: string | null;
  authorEmail?: string | null;
}

interface ApiResponse {
  reviews: ApiReview[];
  avgRating: number;
  count: number;
}

export default function ReviewsList({ promptId }: Props) {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/reviews?promptId=${encodeURIComponent(promptId)}`, {
      cache: 'no-store',
    })
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return (await res.json()) as ApiResponse;
      })
      .then((d) => {
        if (!cancelled) setData(d);
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load reviews');
      });
    return () => {
      cancelled = true;
    };
  }, [promptId]);

  return (
    <section className="mt-10">
      <header className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-300">
          Reviews
        </h2>
        {data && data.count > 0 && (
          <StarRating rating={data.avgRating} size="lg" showNumber count={data.count} />
        )}
      </header>

      {!data && !error && (
        <div className="glass-card mt-3 px-5 py-8 text-center">
          <p className="text-sm text-slate-400">Loading reviews…</p>
        </div>
      )}

      {error && (
        <div className="glass-card mt-3 px-5 py-8 text-center">
          <p className="text-sm text-slate-400">
            Couldn&apos;t load reviews right now.
          </p>
        </div>
      )}

      {data && data.count === 0 && (
        <div className="glass-card mt-3 px-5 py-8 text-center">
          <p className="text-sm text-slate-400">Be the first to review this prompt.</p>
        </div>
      )}

      {data && data.count > 0 && (
        <ul className="mt-4 flex flex-col gap-3">
          {data.reviews.map((r) => (
            <li key={r.id} className="glass-card p-4 sm:p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Avatar name={r.authorName ?? null} email={r.authorEmail ?? null} />
                  <div>
                    <p className="text-sm font-semibold text-slate-200">
                      {displayName(r.authorName ?? null, r.authorEmail ?? null)}
                    </p>
                    <div className="mt-0.5 flex items-center gap-2">
                      <StarRating rating={r.rating} size="sm" />
                      {r.verifiedPurchaser && (
                        <span
                          className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
                          style={{
                            background: 'rgba(94, 234, 212, 0.16)',
                            color: '#5eead4',
                          }}
                        >
                          Verified purchaser
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <time
                  dateTime={r.createdAt}
                  className="shrink-0 text-xs text-slate-500"
                >
                  {formatDate(new Date(r.createdAt))}
                </time>
              </div>

              {r.comment && (
                <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-slate-300">
                  {r.comment}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function displayName(name: string | null, email: string | null): string {
  if (name && name.trim()) return name.trim();
  if (email) return initialsFromEmail(email);
  return 'Anonymous';
}

function initialsFromEmail(email: string): string {
  const local = email.split('@')[0] ?? email;
  const parts = local.split(/[._-]/).filter(Boolean);
  if (parts.length === 0) return local.slice(0, 2).toUpperCase();
  return parts.slice(0, 2).map((p) => p[0]?.toUpperCase() ?? '').join('');
}

function Avatar({ name, email }: { name: string | null; email: string | null }) {
  const label = displayName(name, email);
  const initials =
    label
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase() ?? '')
      .join('') || '?';
  return (
    <span
      className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-xs font-bold text-white"
      style={{ background: 'var(--grad-iri)' }}
      aria-hidden="true"
    >
      {initials}
    </span>
  );
}

function formatDate(d: Date): string {
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
