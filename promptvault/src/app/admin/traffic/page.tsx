import {
  getDailySeries,
  getTopPaths,
  getTopCountries,
  getTopCities,
  getUnknownGeoCount,
} from '@/lib/admin-stats';
import { Sparkline } from '../_components/Sparkline';

export const metadata = { title: 'Admin · Traffic' };
export const dynamic = 'force-dynamic';

// Country-code → flag emoji. ISO 3166-1 alpha-2 maps to two regional indicators.
function flagEmoji(country: string): string {
  if (!country || country.length !== 2) return '🌐';
  const A = 0x1f1e6;
  const code = country.toUpperCase();
  return String.fromCodePoint(A + code.charCodeAt(0) - 65, A + code.charCodeAt(1) - 65);
}

export default async function TrafficPage() {
  const [series, topPaths, topCountries, topCities, unknownGeo] = await Promise.all([
    getDailySeries(30),
    getTopPaths(30, 30),
    getTopCountries(30, 20),
    getTopCities(30, 30),
    getUnknownGeoCount(30),
  ]);
  const totalViews = series.reduce((a, b) => a + b.views, 0);
  const knownGeoViews = topCountries.reduce((a, b) => a + b.views, 0);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Traffic</h1>

      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <div className="text-xs uppercase text-slate-500">Page views, last 30 days</div>
        <div className="text-3xl font-semibold mt-1">{totalViews.toLocaleString()}</div>
        <div className="mt-4">
          <Sparkline data={series.map((d) => d.views)} labels={series.map((d) => d.date)} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="font-medium mb-3">Top countries, last 30 days</h2>
          <table className="w-full text-sm">
            <thead className="text-slate-500 text-left text-xs uppercase">
              <tr>
                <th className="py-1.5">Country</th>
                <th className="py-1.5 text-right">Visitors</th>
                <th className="py-1.5 text-right">Views</th>
              </tr>
            </thead>
            <tbody>
              {topCountries.map((c) => (
                <tr key={c.country} className="border-t border-slate-100">
                  <td className="py-1.5">
                    <span className="mr-2">{flagEmoji(c.country)}</span>
                    <span className="font-mono text-xs">{c.country}</span>
                  </td>
                  <td className="py-1.5 text-right tabular-nums">{c.uniques}</td>
                  <td className="py-1.5 text-right tabular-nums">{c.views}</td>
                </tr>
              ))}
              {topCountries.length === 0 && (
                <tr>
                  <td className="py-3 text-slate-500" colSpan={3}>
                    No geo data yet — check that page-view tracking is hitting /api/track.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {unknownGeo > 0 && totalViews > 0 && (
            <p className="mt-3 text-xs text-slate-500">
              {unknownGeo.toLocaleString()} views ({Math.round((unknownGeo / totalViews) * 100)}%)
              came from IPs the geo DB couldn't resolve (private nets, datacenter ranges, or new
              ranges since the bundled geoip-lite snapshot).
            </p>
          )}
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="font-medium mb-3">Top cities, last 30 days</h2>
          <table className="w-full text-sm">
            <thead className="text-slate-500 text-left text-xs uppercase">
              <tr>
                <th className="py-1.5">City</th>
                <th className="py-1.5">Country</th>
                <th className="py-1.5 text-right">Views</th>
              </tr>
            </thead>
            <tbody>
              {topCities.map((c) => (
                <tr key={`${c.country}-${c.city}`} className="border-t border-slate-100">
                  <td className="py-1.5">{c.city}</td>
                  <td className="py-1.5 text-xs">
                    <span className="mr-1">{flagEmoji(c.country)}</span>
                    <span className="font-mono text-slate-500">{c.country}</span>
                  </td>
                  <td className="py-1.5 text-right tabular-nums">{c.views}</td>
                </tr>
              ))}
              {topCities.length === 0 && (
                <tr>
                  <td className="py-3 text-slate-500" colSpan={3}>
                    No city data yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="font-medium mb-3">Top pages, last 30 days</h2>
        <table className="w-full text-sm">
          <thead className="text-slate-500 text-left text-xs uppercase">
            <tr>
              <th className="py-1.5">Path</th>
              <th className="py-1.5 text-right">Views</th>
            </tr>
          </thead>
          <tbody>
            {topPaths.map((p) => (
              <tr key={p.path} className="border-t border-slate-100">
                <td className="py-1.5 font-mono text-xs">{p.path}</td>
                <td className="py-1.5 text-right">{p.views}</td>
              </tr>
            ))}
            {topPaths.length === 0 && (
              <tr>
                <td className="py-3 text-slate-500" colSpan={2}>
                  No traffic yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
