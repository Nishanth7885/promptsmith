// Append-only order audit. Backed by the SQLite `order_events` table.
// (The legacy orders.jsonl path lived here in Phase 5 — we keep this module
// shape so callers don't change.)
import 'server-only';
import { desc, eq } from 'drizzle-orm';
import { db, schema } from '@/db';

export interface OrderEvent {
  orderId: string;
  status: string;
  amount?: number;
  customerEmail?: string;
  customerPhone?: string;
  paidAt?: string;
  source: 'create' | 'verify' | 'webhook' | 'admin';
  rawJson?: string;
  note?: string;
}

export async function appendOrderEvent(event: OrderEvent): Promise<void> {
  // The orders row may not exist yet for webhook-only events on unknown
  // orders — skip those silently. (Cashfree shouldn't notify us about an
  // order we didn't create, but be defensive.)
  const order = await db
    .select({ id: schema.orders.id })
    .from(schema.orders)
    .where(eq(schema.orders.id, event.orderId))
    .limit(1);
  if (!order[0]) return;

  await db.insert(schema.orderEvents).values({
    orderId: event.orderId,
    source: event.source,
    status: event.status,
    rawJson: event.rawJson ?? null,
    note: event.note ?? null,
  });
}

export async function findLatestForOrder(orderId: string): Promise<OrderEvent | null> {
  const rows = await db
    .select()
    .from(schema.orderEvents)
    .where(eq(schema.orderEvents.orderId, orderId))
    .orderBy(desc(schema.orderEvents.recordedAt))
    .limit(1);
  if (!rows[0]) return null;
  return {
    orderId: rows[0].orderId,
    status: rows[0].status,
    source: rows[0].source as any,
    rawJson: rows[0].rawJson ?? undefined,
    note: rows[0].note ?? undefined,
  };
}

export async function isPaid(orderId: string): Promise<boolean> {
  const rows = await db
    .select({ status: schema.orders.status })
    .from(schema.orders)
    .where(eq(schema.orders.id, orderId))
    .limit(1);
  return rows[0]?.status === 'PAID';
}
