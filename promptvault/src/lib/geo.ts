import 'server-only';
import geoip from 'geoip-lite';

export interface GeoLookup {
  country: string | null;
  city: string | null;
  region: string | null;
}

const PRIVATE_RE =
  /^(10\.|127\.|169\.254\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|::1|fc|fd)/i;

/**
 * Resolve country + city from a request's headers, in priority order:
 *   1. Cloudflare headers (cf-ipcountry, cf-ipcity) if the site is fronted by CF
 *   2. Local geoip-lite DB lookup against the leftmost X-Forwarded-For IP
 *   3. null fallback
 *
 * Returns ISO country codes (e.g. "IN", "US") and English city names.
 */
export function lookupGeo(headers: Headers): GeoLookup {
  const cfCountry = headers.get('cf-ipcountry');
  const cfCity = headers.get('cf-ipcity');
  if (cfCountry || cfCity) {
    return {
      country: normalize(cfCountry),
      city: normalize(cfCity),
      region: null,
    };
  }

  const ip = extractIp(headers);
  if (!ip || PRIVATE_RE.test(ip)) {
    return { country: null, city: null, region: null };
  }

  try {
    const lookup = geoip.lookup(ip);
    if (!lookup) return { country: null, city: null, region: null };
    return {
      country: lookup.country || null,
      city: lookup.city || null,
      region: lookup.region || null,
    };
  } catch {
    return { country: null, city: null, region: null };
  }
}

function extractIp(headers: Headers): string | null {
  const fwd = headers.get('x-forwarded-for') ?? '';
  const first = fwd.split(',')[0]?.trim();
  if (first) return first;
  const real = headers.get('x-real-ip');
  return real?.trim() || null;
}

function normalize(v: string | null): string | null {
  if (!v) return null;
  const t = v.trim();
  return t.length > 0 ? t : null;
}
