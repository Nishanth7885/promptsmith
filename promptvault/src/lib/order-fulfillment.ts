import 'server-only';
import { eq } from 'drizzle-orm';
import { db, schema } from '@/db';
import { incrementCouponUsage } from './pricing';
import { buildAppUrl, receiptTemplate, sendEmail } from './email';

// Idempotent: only fires receipt + coupon redemption the first time.
export async function markOrderPaid(args: {
  orderId: string;
  paidAt: Date;
  paymentMode?: string;
}): Promise<void> {
  const rows = await db
    .select()
    .from(schema.orders)
    .where(eq(schema.orders.id, args.orderId))
    .limit(1);
  const order = rows[0];
  if (!order || order.status === 'PAID') return;

  await db
    .update(schema.orders)
    .set({
      status: 'PAID',
      paidAt: args.paidAt,
      paymentMode: args.paymentMode ?? order.paymentMode,
    })
    .where(eq(schema.orders.id, args.orderId));

  if (order.couponId) {
    await db.insert(schema.couponRedemptions).values({
      couponId: order.couponId,
      orderId: order.id,
      userId: order.userId ?? null,
    });
    await incrementCouponUsage(order.couponId);
  }

  try {
    const tpl = receiptTemplate({
      name: order.customerName,
      orderId: order.id,
      amount: String(order.amountTotal),
      currency: order.currency === 'INR' ? '₹' : '$',
      accessUrl: buildAppUrl('/account'),
    });
    await sendEmail({ to: order.customerEmail, ...tpl });
  } catch (err) {
    console.warn('[receipt-email]', err);
  }
}
