import { getDailySeries, getTopPaths } from '@/lib/admin-stats';
import { Sparkline } from '../_components/Sparkline';

export const metadata = { title: 'Admin · Traffic' };
export const dynamic = 'force-dynamic';

export default async function TrafficPage() {
  const [series, topPaths] = await Promise.all([getDailySeries(30), getTopPaths(30, 30)]);
  const totalViews = series.reduce((a, b) => a + b.views, 0);

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
