import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'node:crypto';
import { db, schema } from '@/db';
import { auth } from '@/auth';
import { lookupGeo } from '@/lib/geo';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Simple bot filter — no need to be exhaustive, just catch obvious crawlers
// so the dashboard doesn't get drowned.
const BOT_RE = /bot|crawler|spider|slurp|baiduspider|bingpreview|facebookexternalhit|twitterbot|linkedinbot|whatsapp/i;

export async function POST(req: NextRequest) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const path = String(body?.path ?? '').slice(0, 200);
  if (!path || !path.startsWith('/')) return NextResponse.json({ ok: false }, { status: 400 });
  // Skip admin / api hits
  if (path.startsWith('/admin') || path.startsWith('/api')) {
    return NextResponse.json({ ok: true });
  }

  const ua = req.headers.get('user-agent') ?? '';
  if (BOT_RE.test(ua)) return NextResponse.json({ ok: true });

  const referer = req.headers.get('referer') ?? '';
  // Best-effort IP from common proxy headers.
  const fwd = req.headers.get('x-forwarded-for') ?? '';
  const ip = fwd.split(',')[0]?.trim() || req.headers.get('x-real-ip') || '';
  const ipHash = ip ? createHash('sha256').update(ip).digest('hex').slice(0, 16) : null;
  const geo = lookupGeo(req.headers);
  const country = geo.country ?? req.headers.get('x-country-code') ?? null;
  const city = geo.city;

  let userId: string | null = null;
  try {
    const session = await auth();
    userId = session?.user?.id ?? null;
  } catch {
    /* ignore */
  }

  try {
    await db.insert(schema.pageViews).values({
      path,
      userId,
      sessionId: String(body?.sessionId ?? '').slice(0, 64) || null,
      ipHash,
      country,
      city,
      referer: referer.slice(0, 200) || null,
      userAgent: ua.slice(0, 200) || null,
    });
  } catch (err) {
    console.warn('[track] insert failed', err);
  }

  return NextResponse.json({ ok: true });
}
