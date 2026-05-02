import 'server-only';
import { and, eq, like, or, sql } from 'drizzle-orm';
import { db, schema } from '@/db';

/**
 * Server-side access check that knows about all three purchase shapes:
 *  - All-access (orderType='ALL') unlocks every category.
 *  - Single-category (orderType='CATEGORY' + categorySlug) unlocks just that one.
 *  - Cart purchase (orderType='CATEGORY' + categorySlugs JSON) unlocks each
 *    slug in the JSON array. Single-category orders also write a one-element
 *    JSON array, so the JSON path covers both — but we keep the legacy
 *    categorySlug check for back-compat with rows written before the cart
 *    migration.
 */
export async function hasCategoryAccess(
  userId: string,
  categorySlug: string,
): Promise<boolean> {
  // Slug substring match against the JSON-stringified array. Slugs are
  // lowercase-kebab so no quoting/escaping risk; the surrounding `"…"` in
  // the LIKE pattern prevents prefix collisions ("design" matching "designer").
  const slugMatch = `%"${categorySlug}"%`;
  const rows = await db
    .select({ id: schema.orders.id })
    .from(schema.orders)
    .where(
      and(
        eq(schema.orders.userId, userId),
        eq(schema.orders.status, 'PAID'),
        or(
          eq(schema.orders.orderType, 'ALL'),
          eq(schema.orders.categorySlug, categorySlug),
          like(schema.orders.categorySlugs, slugMatch),
        ),
      ),
    )
    .limit(1);
  return rows.length > 0;
}

/**
 * True if the user has the all-access lifetime bundle. Useful where you need
 * to differentiate "owns everything" from "owns one category".
 */
export async function hasAllAccess(userId: string): Promise<boolean> {
  const rows = await db
    .select({ id: schema.orders.id })
    .from(schema.orders)
    .where(
      and(
        eq(schema.orders.userId, userId),
        eq(schema.orders.status, 'PAID'),
        eq(schema.orders.orderType, 'ALL'),
      ),
    )
    .limit(1);
  return rows.length > 0;
}

/**
 * Returns the set of category slugs this user has purchased outright (via
 * single-category or cart orders). Does NOT include "all" — call hasAllAccess
 * separately for that. Used to render the cart and the account page.
 */
export async function getOwnedCategorySlugs(userId: string): Promise<string[]> {
  const rows = await db
    .select({
      categorySlug: schema.orders.categorySlug,
      categorySlugs: schema.orders.categorySlugs,
    })
    .from(schema.orders)
    .where(
      and(
        eq(schema.orders.userId, userId),
        eq(schema.orders.status, 'PAID'),
        eq(schema.orders.orderType, 'CATEGORY'),
      ),
    );
  const out = new Set<string>();
  for (const r of rows) {
    if (r.categorySlug) out.add(r.categorySlug);
    if (r.categorySlugs) {
      try {
        const arr = JSON.parse(r.categorySlugs) as unknown;
        if (Array.isArray(arr)) for (const s of arr) if (typeof s === 'string') out.add(s);
      } catch {
        /* ignore malformed JSON */
      }
    }
  }
  return [...out];
}
