// Server component — renders the aggregate stars + a list of reviews for
// one prompt.
//
// Spec called for fetching GET /api/reviews?promptId=... over HTTP, but the
// containing prompt page uses generateStaticParams (5,529 prompts), so a
// runtime fetch to a relative URL during static generation would fail. We
// hit the DB directly via the same query the API route uses; the API route
// remains the public-HTTP entry point for clients (e.g. ReviewForm refresh).
import 'server-only';
import { desc, eq } from 'drizzle-orm';
import { db, schema } from '@/db';
import StarRating from './StarRating';
import type { Review } from '@/db/schema';

interface Props {
  promptId: string;
}

type ReviewWithAuthor = Review & {
  authorName: string | null;
  authorEmail: string | null;
};

export default async function ReviewsList({ promptId }: Props) {
  // Join reviews -> users for display name. Drizzle's leftJoin returns
  // { reviews, users } shaped rows.
  const rows = await db
    .select({
      review: schema.reviews,
      userName: schema.users.name,
      userEmail: schema.users.email,
    })
    .from(schema.reviews)
    .leftJoin(schema.users, eq(schema.users.id, schema.reviews.userId))
    .where(eq(schema.reviews.promptId, promptId))
    .orderBy(desc(schema.reviews.createdAt));

  const reviews: ReviewWithAuthor[] = rows.map((r) => ({
    ...r.review,
    authorName: r.userName ?? null,
    authorEmail: r.userEmail ?? null,
  }));
  const count = reviews.length;
  const avgRating =
    count === 0
      ? 0
      : Math.round((reviews.reduce((s, r) => s + r.rating, 0) / count) * 10) / 10;

  return (
    <section className="mt-10">
      <header className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-300">
          Reviews
        </h2>
        {count > 0 && (
          <StarRating rating={avgRating} size="lg" showNumber count={count} />
        )}
      </header>

      {count === 0 ? (
        <div className="glass-card mt-3 px-5 py-8 text-center">
          <p className="text-sm text-slate-400">
            Be the first to review this prompt.
          </p>
        </div>
      ) : (
        <ul className="mt-4 flex flex-col gap-3">
          {reviews.map((r) => (
            <li key={r.id} className="glass-card p-4 sm:p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Avatar
                    name={r.authorName}
                    email={r.authorEmail}
                  />
                  <div>
                    <p className="text-sm font-semibold text-slate-200">
                      {displayName(r.authorName, r.authorEmail)}
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
                  dateTime={r.createdAt.toISOString()}
                  className="shrink-0 text-xs text-slate-500"
                >
                  {formatDate(r.createdAt)}
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
  // For privacy, show only initials when no display name is set.
  const local = email.split('@')[0] ?? email;
  const parts = local.split(/[._-]/).filter(Boolean);
  if (parts.length === 0) return local.slice(0, 2).toUpperCase();
  return parts.slice(0, 2).map((p) => p[0]?.toUpperCase() ?? '').join('');
}

function Avatar({
  name,
  email,
}: {
  name: string | null;
  email: string | null;
}) {
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
