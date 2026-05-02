import 'server-only';
import { and, eq, or } from 'drizzle-orm';
import { db, schema } from '@/db';

/**
 * Server-side access check that knows about both purchase types:
 *  - All-access (orderType='ALL') unlocks every category.
 *  - Per-category (orderType='CATEGORY') unlocks ONLY the matching slug.
 *
 * Returns true if the user has any PAID order satisfying either rule.
 */
export async function hasCategoryAccess(
  userId: string,
  categorySlug: string,
): Promise<boolean> {
  const rows = await db
    .select({ id: schema.orders.id })
    .from(schema.orders)
    .where(
      and(
        eq(schema.orders.userId, userId),
        eq(schema.orders.status, 'PAID'),
        or(
          eq(schema.orders.orderType, 'ALL'),
          and(
            eq(schema.orders.orderType, 'CATEGORY'),
            eq(schema.orders.categorySlug, categorySlug),
          ),
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
