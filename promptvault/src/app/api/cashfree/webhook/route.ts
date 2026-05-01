import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db, schema } from '@/db';
import { verifyWebhookSignature } from '@/lib/cashfree-server';
import { appendOrderEvent } from '@/lib/order-log';
import { markOrderPaid } from '@/lib/order-fulfillment';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const rawBody = await req.text();
  const signature = req.headers.get('x-webhook-signature') ?? '';
  const timestamp = req.headers.get('x-webhook-timestamp') ?? '';

  if (!verifyWebhookSignature(rawBody, timestamp, signature)) {
    console.warn('[cashfree/webhook] signature verification FAILED');
    return new NextResponse('invalid signature', { status: 401 });
  }

  let payload: any;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return new NextResponse('invalid json', { status: 400 });
  }

  const eventType = payload?.type ?? 'UNKNOWN';
  const order = payload?.data?.order ?? payload?.data ?? {};
  const payment = payload?.data?.payment ?? {};

  const orderId = order?.order_id ?? payload?.order_id;
  if (!orderId) {
    return new NextResponse('missing order_id', { status: 400 });
  }

  const isPaid =
    eventType === 'PAYMENT_SUCCESS_WEBHOOK' ||
    eventType === 'ORDER_PAID' ||
    payment?.payment_status === 'SUCCESS' ||
    order?.order_status === 'PAID';

  await appendOrderEvent({
    orderId,
    status: isPaid ? 'PAID' : (order?.order_status ?? payment?.payment_status ?? eventType),
    source: 'webhook',
    rawJson: rawBody.slice(0, 4000),
  });

  if (isPaid) {
    await markOrderPaid({
      orderId,
      paidAt: payment?.payment_time ? new Date(payment.payment_time) : new Date(),
      paymentMode: payment?.payment_method,
    });
  } else if (eventType === 'PAYMENT_FAILED_WEBHOOK' || payment?.payment_status === 'FAILED') {
    await db
      .update(schema.orders)
      .set({ status: 'FAILED' })
      .where(eq(schema.orders.id, orderId));
  }

  return NextResponse.json({ ok: true });
}
