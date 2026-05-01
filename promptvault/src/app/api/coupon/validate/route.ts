import { NextResponse } from 'next/server';
import { z } from 'zod';
import { resolvePrice } from '@/lib/pricing';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const schema = z.object({
  currency: z.enum(['INR', 'USD']),
  couponCode: z.string().trim().min(1).max(40),
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'Invalid input' },
      { status: 400 },
    );
  }
  const priced = await resolvePrice(parsed.data);
  if (priced.error) {
    return NextResponse.json({ valid: false, error: priced.error });
  }
  return NextResponse.json({
    valid: true,
    subtotal: priced.subtotal,
    discount: priced.discount,
    total: priced.total,
    currency: priced.currency,
    couponCode: priced.couponCode,
  });
}
