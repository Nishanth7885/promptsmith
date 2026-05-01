import { getDailySeries, getDashboardStats, getTopPaths } from '@/lib/admin-stats';
import { Sparkline } from './_components/Sparkline';

export const metadata = { title: 'Admin · Dashboard' };

export default async function AdminDashboard() {
  const [stats, series, topPaths] = await Promise.all([
    getDashboardStats(),
    getDailySeries(14),
    getTopPaths(7, 10),
  ]);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat label="Paid orders today" value={stats.ordersToday} />
        <Stat label="Paid orders (7d)" value={stats.ordersThisWeek} />
        <Stat label="Revenue (30d, INR)" value={`₹${stats.revenueINRThisMonth.toLocaleString('en-IN')}`} />
        <Stat label="Revenue (30d, USD)" value={`$${stats.revenueUSDThisMonth.toFixed(2)}`} />
        <Stat label="Signups today" value={stats.signupsToday} />
        <Stat label="Signups (7d)" value={stats.signupsThisWeek} />
        <Stat label="Page views today" value={stats.pageViewsToday} />
        <Stat label="Waitlist" value={stats.waitlistCount} />
      </section>

      <section className="grid lg:grid-cols-2 gap-6">
        <Card title="Page views, last 14 days">
          <Sparkline data={series.map((d) => d.views)} labels={series.map((d) => d.date)} />
        </Card>
        <Card title="Paid orders, last 14 days">
          <Sparkline
            color="#10b981"
            data={series.map((d) => d.paidOrders)}
            labels={series.map((d) => d.date)}
          />
        </Card>
        <Card title="Signups, last 14 days">
          <Sparkline
            color="#0f172a"
            data={series.map((d) => d.signups)}
            labels={series.map((d) => d.date)}
          />
        </Card>
        <Card title="Top pages, last 7 days">
          {topPaths.length === 0 ? (
            <p className="text-sm text-slate-500">No traffic yet.</p>
          ) : (
            <table className="w-full text-sm">
              <tbody>
                {topPaths.map((p) => (
                  <tr key={p.path} className="border-b border-slate-100 last:border-0">
                    <td className="py-1.5 font-mono text-xs">{p.path}</td>
                    <td className="py-1.5 text-right font-medium">{p.views}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="text-xs uppercase tracking-wide text-slate-500">{label}</div>
      <div className="mt-1 text-2xl font-semibold">{value}</div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <h2 className="text-sm font-medium text-slate-700 mb-3">{title}</h2>
      {children}
    </div>
  );
}
