import 'server-only';
import { and, eq, gt, isNull, or, sql } from 'drizzle-orm';
import { db, schema } from '@/db';
import { getPricing } from './settings';

export type Currency = 'INR' | 'USD';

export interface ResolvedPrice {
  currency: Currency;
  subtotal: number;
  discount: number;
  total: number;
  couponCode?: string;
  couponId?: string;
  productName: string;
  crossBorderEnabled: boolean;
}

export async function resolvePrice(args: {
  currency: Currency;
  couponCode?: string;
}): Promise<ResolvedPrice & { error?: string }> {
  const pricing = await getPricing();
  const subtotal = args.currency === 'INR' ? pricing.inr : pricing.usd;
  const base: ResolvedPrice = {
    currency: args.currency,
    subtotal,
    discount: 0,
    total: subtotal,
    productName: pricing.productName,
    crossBorderEnabled: pricing.crossBorderEnabled,
  };
  if (!args.couponCode) return base;

  const coupon = await findActiveCoupon(args.couponCode);
  if (!coupon) return { ...base, error: 'Coupon code not found or inactive.' };
  if (coupon.expiresAt && coupon.expiresAt.getTime() < Date.now()) {
    return { ...base, error: 'Coupon has expired.' };
  }
  if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
    return { ...base, error: 'Coupon has reached its usage limit.' };
  }
  // Flat coupons must match the order currency.
  if (coupon.type === 'flat' && coupon.currency && coupon.currency !== args.currency) {
    return { ...base, error: `This coupon only applies to ${coupon.currency} orders.` };
  }

  const discount =
    coupon.type === 'percent'
      ? round2((subtotal * coupon.value) / 100)
      : Math.min(coupon.value, subtotal);
  const total = Math.max(0, round2(subtotal - discount));

  return {
    ...base,
    discount,
    total,
    couponCode: coupon.code,
    couponId: coupon.id,
  };
}

export async function findActiveCoupon(code: string) {
  const rows = await db
    .select()
    .from(schema.coupons)
    .where(and(eq(schema.coupons.code, code.toUpperCase()), eq(schema.coupons.active, true)))
    .limit(1);
  return rows[0];
}

export async function incrementCouponUsage(couponId: string): Promise<void> {
  await db
    .update(schema.coupons)
    .set({ usedCount: sql`${schema.coupons.usedCount} + 1` })
    .where(eq(schema.coupons.id, couponId));
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
