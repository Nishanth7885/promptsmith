// Reviews API — public read, authenticated write.
//
// GET  /api/reviews?promptId=...  -> { reviews, avgRating, count }
// POST /api/reviews               -> upserts the caller's review for promptId
//
// Spec called for `hasCategoryAccess(user.id, prompt.category)` from
// `@/lib/access`, but that module is currently client-only and only exposes a
// localStorage flag. We approximate verified-purchaser server-side as "the
// user has at least one order with status = 'PAID'", which is what the rest
// of the app treats as a paying customer. Swap this for a real per-category
// access check once `lib/access` grows a server-side helper.
import 'server-only';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { and, desc, eq } from 'drizzle-orm';
import { db, schema } from '@/db';
import { auth } from '@/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// ---------- GET ----------

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const promptId = searchParams.get('promptId');
  if (!promptId) {
    return NextResponse.json({ error: 'promptId is required' }, { status: 400 });
  }

  const rows = await db
    .select({
      id: schema.reviews.id,
      rating: schema.reviews.rating,
      comment: schema.reviews.comment,
      verifiedPurchaser: schema.reviews.verifiedPurchaser,
      createdAt: schema.reviews.createdAt,
      authorName: schema.users.name,
      authorEmail: schema.users.email,
    })
    .from(schema.reviews)
    .leftJoin(schema.users, eq(schema.users.id, schema.reviews.userId))
    .where(eq(schema.reviews.promptId, promptId))
    .orderBy(desc(schema.reviews.createdAt));

  const count = rows.length;
  const avgRating =
    count === 0
      ? 0
      : Math.round((rows.reduce((sum, r) => sum + r.rating, 0) / count) * 10) / 10;

  return NextResponse.json({ reviews: rows, avgRating, count });
}

// ---------- POST ----------

const postSchema = z.object({
  promptId: z.string().min(1).max(200),
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(500).optional().nullable(),
});

export async function POST(req: Request) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = postSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Rating must be 1-5 and comment must be ≤500 chars.' },
      { status: 400 },
    );
  }
  const { promptId, rating } = parsed.data;
  const comment = parsed.data.comment?.trim() || null;

  // Verified-purchaser check: any PAID order by this user counts.
  // (See file header for why this stands in for hasCategoryAccess.)
  const paid = await db
    .select({ id: schema.orders.id })
    .from(schema.orders)
    .where(and(eq(schema.orders.userId, userId), eq(schema.orders.status, 'PAID')))
    .limit(1);
  const verifiedPurchaser = paid.length > 0;

  // Soft-unique upsert: read existing review for (userId, promptId), then
  // UPDATE if found, else INSERT.
  const existing = await db
    .select()
    .from(schema.reviews)
    .where(
      and(eq(schema.reviews.userId, userId), eq(schema.reviews.promptId, promptId)),
    )
    .limit(1);

  if (existing.length > 0) {
    await db
      .update(schema.reviews)
      .set({
        rating,
        comment,
        verifiedPurchaser,
        // intentionally don't bump createdAt — keep the original review date
      })
      .where(eq(schema.reviews.id, existing[0].id));
    return NextResponse.json({ ok: true, action: 'updated' });
  }

  await db.insert(schema.reviews).values({
    promptId,
    userId,
    rating,
    comment,
    verifiedPurchaser,
  });
  return NextResponse.json({ ok: true, action: 'created' });
}
