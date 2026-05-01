import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db, schema } from '@/db';
import { fetchOrderStatus } from '@/lib/cashfree-server';
import { appendOrderEvent } from '@/lib/order-log';
import { signGrantToken } from '@/lib/grant-token';
import { markOrderPaid } from '@/lib/order-fulfillment';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const orderId = (searchParams.get('order_id') ?? '').trim();
  if (!orderId) {
    return NextResponse.json({ error: 'order_id required' }, { status: 400 });
  }

  // Look up our DB row first.
  const orderRows = await db
    .select()
    .from(schema.orders)
    .where(eq(schema.orders.id, orderId))
    .limit(1);
  const local = orderRows[0];
  if (!local) {
    return NextResponse.json({ error: 'Unknown order' }, { status: 404 });
  }

  // If we already marked it paid (webhook may have arrived first), return now.
  if (local.status === 'PAID') {
    const grant = signGrantToken({
      orderId: local.id,
      email: local.customerEmail,
      issuedAt: Date.now(),
    });
    return NextResponse.json({
      orderId: local.id,
      status: 'PAID',
      amount: local.amountTotal,
      currency: local.currency,
      email: local.customerEmail,
      paidAt: local.paidAt?.toISOString(),
      grant,
      cached: true,
    });
  }

  // Otherwise ask Cashfree.
  try {
    const remote = await fetchOrderStatus(orderId);

    await appendOrderEvent({
      orderId,
      status: remote.status,
      source: 'verify',
    });

    if (remote.status === 'PAID') {
      await markOrderPaid({
        orderId,
        paidAt: remote.paymentTime ? new Date(remote.paymentTime) : new Date(),
        paymentMode: remote.paymentMode,
      });
      const grant = signGrantToken({
        orderId,
        email: local.customerEmail,
        issuedAt: Date.now(),
      });
      return NextResponse.json({
        orderId,
        status: 'PAID',
        amount: local.amountTotal,
        currency: local.currency,
        email: local.customerEmail,
        paidAt: remote.paymentTime,
        grant,
      });
    }

    // Mirror non-PAID state in DB.
    await db
      .update(schema.orders)
      .set({ status: remote.status as any })
      .where(eq(schema.orders.id, orderId));

    return NextResponse.json({
      orderId,
      status: remote.status,
      amount: local.amountTotal,
      currency: local.currency,
    });
  } catch (err) {
    console.error('[cashfree/verify]', err);
    const msg = err instanceof Error ? err.message : 'Verification failed';
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}

