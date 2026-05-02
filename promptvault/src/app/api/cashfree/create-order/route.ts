import { NextResponse } from 'next/server';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { auth } from '@/auth';
import { db, schema } from '@/db';
import {
  createOrder,
  getMode,
  hashEmail,
  type CreateOrderInput,
} from '@/lib/cashfree-server';
import { appendOrderEvent } from '@/lib/order-log';
import { getCategoryPrice, resolvePrice } from '@/lib/pricing';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const PHONE_RE = /^\+?\d{10,15}$/;
const SLUG_RE = /^[a-z0-9-]{1,80}$/;

const bodySchema = z
  .object({
    phone: z.string().regex(PHONE_RE, 'Enter a valid mobile number with country code.'),
    name: z.string().trim().max(80).optional(),
    currency: z.enum(['INR', 'USD']),
    couponCode: z.string().trim().max(40).optional(),
    orderType: z.enum(['ALL', 'CATEGORY']).optional().default('ALL'),
    // Single-category SKU: legacy single-slug field. Either this OR categorySlugs.
    categorySlug: z.string().trim().regex(SLUG_RE).optional(),
    // Cart SKU: 1+ slugs charged at N × ₹99. Capped at 36 to stay under the
    // ₹299 all-access SKU's economic break-even.
    categorySlugs: z.array(z.string().trim().regex(SLUG_RE)).min(1).max(36).optional(),
  })
  .superRefine((d, ctx) => {
    if (d.orderType === 'CATEGORY' && !d.categorySlug && !d.categorySlugs) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'categorySlug or categorySlugs is required when orderType is CATEGORY.',
        path: ['categorySlug'],
      });
    }
    if (d.orderType === 'CATEGORY' && d.currency !== 'INR') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Per-category checkout is INR-only at this stage.',
        path: ['currency'],
      });
    }
  });

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id || !session.user.email) {
    return NextResponse.json({ error: 'Please log in first.', authRequired: true }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'Invalid input' },
      { status: 400 },
    );
  }
  const { phone, name, currency, couponCode, orderType } = parsed.data;

  // Normalize the slug list: prefer categorySlugs, fall back to single
  // categorySlug. Dedupe + cap at 36 (max categories).
  const slugList: string[] = (() => {
    if (orderType !== 'CATEGORY') return [];
    const fromArr = parsed.data.categorySlugs ?? [];
    const fromOne = parsed.data.categorySlug ? [parsed.data.categorySlug] : [];
    return [...new Set([...fromArr, ...fromOne])].slice(0, 36);
  })();
  const primarySlug = slugList[0] ?? null; // legacy column
  const slugsJson = slugList.length > 0 ? JSON.stringify(slugList) : null;

  // Resolve final price + coupon validity from DB.
  // For per-category orders we override the subtotal with N × category price
  // (₹99 default × number of categories) but still let the coupon flow through.
  const priced = await resolvePrice({ currency, couponCode });
  if (orderType === 'CATEGORY') {
    const catPrice = await getCategoryPrice('INR');
    const subtotal = catPrice * Math.max(1, slugList.length);
    priced.subtotal = subtotal;
    if (priced.couponCode) {
      const ratio = priced.discount > 0 && priced.subtotal > 0 ? priced.discount / priced.subtotal : 0;
      priced.discount = Math.min(subtotal, Math.round(subtotal * ratio));
    }
    priced.total = Math.max(0, priced.subtotal - priced.discount);
    priced.productName =
      slugList.length > 1
        ? `Prompt Smith — ${slugList.length} categories`
        : `Prompt Smith — ${slugList[0] ?? 'category'}`;
  }
  if (priced.error) {
    return NextResponse.json({ error: priced.error }, { status: 400 });
  }

  // Cross-border gate: when not yet enabled, USD is waitlist-only.
  if (currency === 'USD' && !priced.crossBorderEnabled) {
    return NextResponse.json(
      {
        waitlist: true,
        message:
          'International payments aren\'t live yet — join the waitlist and we\'ll email you when USD checkout opens.',
      },
      { status: 402 },
    );
  }

  // Free order shortcut (e.g. 100% coupon): mark PAID immediately, no PSP call.
  if (priced.total <= 0) {
    const orderId = `ps_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    await db.insert(schema.orders).values({
      id: orderId,
      userId: session.user.id,
      customerEmail: session.user.email,
      customerPhone: phone,
      customerName: name ?? session.user.name ?? null,
      currency,
      amountSubtotal: priced.subtotal,
      amountDiscount: priced.discount,
      amountTotal: 0,
      couponCode: priced.couponCode ?? null,
      couponId: priced.couponId ?? null,
      status: 'PAID',
      paidAt: new Date(),
      orderType,
      categorySlug: orderType === 'CATEGORY' ? primarySlug : null,
      categorySlugs: orderType === 'CATEGORY' ? slugsJson : null,
    });
    if (priced.couponId) {
      await db.insert(schema.couponRedemptions).values({
        couponId: priced.couponId,
        orderId,
        userId: session.user.id,
      });
      await db
        .update(schema.coupons)
        .set({ usedCount: ((await getCount(priced.couponId)) ?? 0) + 1 })
        .where(eq(schema.coupons.id, priced.couponId));
    }
    await appendOrderEvent({ orderId, status: 'PAID', source: 'create', note: 'free with coupon' });
    return NextResponse.json({
      orderId,
      free: true,
      status: 'PAID',
      currency,
      amount: 0,
    });
  }

  // Normal Cashfree path.
  const orderId = `ps_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
  try {
    const cfInput: CreateOrderInput = {
      orderId,
      amount: priced.total,
      currency,
      customerId: `cust_${hashEmail(session.user.email)}`,
      customerEmail: session.user.email,
      customerPhone: phone,
      customerName: name ?? session.user.name ?? undefined,
      productName: priced.productName,
    };
    const cf = await createOrder(cfInput);

    await db.insert(schema.orders).values({
      id: orderId,
      userId: session.user.id,
      cashfreeOrderId: cf.orderId,
      customerEmail: session.user.email,
      customerPhone: phone,
      customerName: name ?? session.user.name ?? null,
      currency,
      amountSubtotal: priced.subtotal,
      amountDiscount: priced.discount,
      amountTotal: priced.total,
      couponCode: priced.couponCode ?? null,
      couponId: priced.couponId ?? null,
      status: cf.status === 'PAID' ? 'PAID' : 'ACTIVE',
      paymentSessionId: cf.paymentSessionId,
      orderType,
      categorySlug: orderType === 'CATEGORY' ? primarySlug : null,
      categorySlugs: orderType === 'CATEGORY' ? slugsJson : null,
    });

    await appendOrderEvent({
      orderId,
      status: cf.status,
      source: 'create',
    });

    return NextResponse.json({
      orderId,
      paymentSessionId: cf.paymentSessionId,
      paymentLink: cf.paymentLink,
      amount: cf.amount,
      currency: cf.currency,
      mode: getMode(),
      productName: priced.productName,
    });
  } catch (err) {
    console.error('[cashfree/create-order]', err);
    const msg = err instanceof Error ? err.message : 'Order creation failed';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

async function getCount(couponId: string): Promise<number | undefined> {
  const rows = await db
    .select({ usedCount: schema.coupons.usedCount })
    .from(schema.coupons)
    .where(eq(schema.coupons.id, couponId))
    .limit(1);
  return rows[0]?.usedCount;
}
