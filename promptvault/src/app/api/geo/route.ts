import { NextRequest, NextResponse } from 'next/server';
import { getPricing } from '@/lib/settings';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Best-effort country detection. On the GCP VM behind Nginx, configure
// Nginx to set X-Country-Code from a GeoIP module if you want better
// accuracy. Fallbacks: Cloudflare's CF-IPCountry (if you put CF in front),
// then Accept-Language. Default IN if unknown.
export async function GET(req: NextRequest) {
  const country =
    req.headers.get('cf-ipcountry') ??
    req.headers.get('x-country-code') ??
    inferFromAcceptLanguage(req.headers.get('accept-language')) ??
    'IN';
  const currency = country === 'IN' ? 'INR' : 'USD';
  const pricing = await getPricing();
  return NextResponse.json({
    country,
    currency,
    inr: pricing.inr,
    usd: pricing.usd,
    productName: pricing.productName,
    crossBorderEnabled: pricing.crossBorderEnabled,
  });
}

function inferFromAcceptLanguage(al: string | null): string | null {
  if (!al) return null;
  if (/-IN\b/i.test(al)) return 'IN';
  if (/-(US|GB|CA|AU|NZ|SG|AE|DE|FR|ES|IT|NL|JP|KR|CN)\b/i.test(al)) return 'OTHER';
  return null;
}
