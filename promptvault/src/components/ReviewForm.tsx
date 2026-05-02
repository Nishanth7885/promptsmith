'use client';

// Review submission form. Renders a 1-5 star picker, optional comment box
// (with character counter), and a glassy iridescent submit button. Handles
// its own auth + access gating: shows a "log in" link on 401 and a "buy
// this category / all-access" message on 403.

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Props {
  promptId: string;
}

const MAX_COMMENT = 500;

export default function ReviewForm({ promptId }: Props) {
  const router = useRouter();
  const [rating, setRating] = useState<number>(0);
  const [hover, setHover] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [error, setError] = useState<
    | null
    | { kind: 'auth' }
    | { kind: 'access' }
    | { kind: 'generic'; message: string }
  >(null);
  const [success, setSuccess] = useState(false);
  const [pending, startTransition] = useTransition();

  const display = hover || rating;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (rating < 1 || rating > 5) {
      setError({ kind: 'generic', message: 'Please pick a 1-5 star rating.' });
      return;
    }
    if (comment.length > MAX_COMMENT) {
      setError({
        kind: 'generic',
        message: `Comment must be ${MAX_COMMENT} characters or fewer.`,
      });
      return;
    }

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          promptId,
          rating,
          comment: comment.trim() || undefined,
        }),
      });

      if (res.status === 401) {
        setError({ kind: 'auth' });
        return;
      }
      if (res.status === 403) {
        setError({ kind: 'access' });
        return;
      }
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        setError({
          kind: 'generic',
          message: body.error ?? 'Something went wrong. Try again.',
        });
        return;
      }

      setSuccess(true);
      setRating(0);
      setHover(0);
      setComment('');
      // Refresh the page so the server-rendered ReviewsList re-fetches.
      startTransition(() => router.refresh());
    } catch {
      setError({
        kind: 'generic',
        message: 'Network error. Check your connection and try again.',
      });
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="glass-card mt-6 p-5 sm:p-6"
      aria-label="Leave a review"
    >
      <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-300">
        Leave a review
      </h3>

      {/* Star picker */}
      <div className="mt-3 flex items-center gap-2">
        <div
          className="inline-flex"
          role="radiogroup"
          aria-label="Star rating"
          onMouseLeave={() => setHover(0)}
        >
          {[1, 2, 3, 4, 5].map((n) => {
            const filled = n <= display;
            return (
              <button
                key={n}
                type="button"
                role="radio"
                aria-checked={rating === n}
                aria-label={`${n} star${n === 1 ? '' : 's'}`}
                onMouseEnter={() => setHover(n)}
                onFocus={() => setHover(n)}
                onClick={() => setRating(n)}
                className="px-0.5 text-2xl leading-none transition-transform hover:scale-110 focus:outline-none focus-visible:scale-110"
                style={{
                  background: filled ? 'var(--grad-iri)' : 'transparent',
                  WebkitBackgroundClip: filled ? 'text' : undefined,
                  backgroundClip: filled ? 'text' : undefined,
                  WebkitTextFillColor: filled ? 'transparent' : undefined,
                  color: filled ? 'var(--violet)' : 'var(--border-strong)',
                }}
              >
                ★
              </button>
            );
          })}
        </div>
        <span className="text-xs text-slate-400">
          {rating > 0 ? `${rating} / 5` : 'Tap a star'}
        </span>
      </div>

      {/* Comment box */}
      <div className="mt-4">
        <label
          htmlFor="review-comment"
          className="block text-xs font-medium text-slate-400"
        >
          Comment <span className="text-slate-500">(optional)</span>
        </label>
        <textarea
          id="review-comment"
          value={comment}
          onChange={(e) => setComment(e.target.value.slice(0, MAX_COMMENT))}
          rows={3}
          maxLength={MAX_COMMENT}
          placeholder="What did you think? Did this prompt deliver?"
          className="mt-1 w-full resize-y rounded-xl border px-3 py-2 text-sm"
          style={{
            background: 'var(--surface)',
            borderColor: 'var(--border)',
            color: 'var(--text)',
          }}
        />
        <div className="mt-1 flex justify-end">
          <span
            className={`text-xs ${
              comment.length >= MAX_COMMENT ? 'text-rose-400' : 'text-slate-500'
            }`}
          >
            {comment.length} / {MAX_COMMENT}
          </span>
        </div>
      </div>

      {/* Error / success messages */}
      {error?.kind === 'auth' && (
        <p className="mt-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-200">
          <Link href="/login" className="font-semibold underline">
            Log in
          </Link>{' '}
          to leave a review.
        </p>
      )}
      {error?.kind === 'access' && (
        <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
          Buy this category or all-access to leave a verified review.
        </p>
      )}
      {error?.kind === 'generic' && (
        <p className="mt-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-200">
          {error.message}
        </p>
      )}
      {success && (
        <p className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          Thanks — your review is live.
        </p>
      )}

      {/* Submit */}
      <div className="mt-4 flex justify-end">
        <button
          type="submit"
          disabled={pending || rating < 1}
          className="rounded-full px-5 py-2 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50"
          style={{
            background: 'var(--grad-iri)',
            boxShadow: '0 8px 24px -10px rgba(124, 92, 255, 0.6)',
          }}
        >
          {pending ? 'Submitting…' : 'Submit review'}
        </button>
      </div>
    </form>
  );
}
