import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db, schema } from '@/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const schema_ = z.object({
  email: z.string().email().toLowerCase(),
  country: z.string().max(80).optional(),
  currency: z.enum(['INR', 'USD']).optional(),
  source: z.string().max(40).optional(),
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }
  const parsed = schema_.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Enter a valid email.' }, { status: 400 });
  }
  await db
    .insert(schema.waitlist)
    .values({
      email: parsed.data.email,
      country: parsed.data.country ?? null,
      currency: parsed.data.currency ?? null,
      source: parsed.data.source ?? null,
    })
    .onConflictDoNothing();
  return NextResponse.json({ ok: true });
}
