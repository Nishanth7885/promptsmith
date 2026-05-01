import { desc } from 'drizzle-orm';
import { db, schema } from '@/db';

export const metadata = { title: 'Admin · Waitlist' };
export const dynamic = 'force-dynamic';

export default async function WaitlistPage() {
  const rows = await db
    .select()
    .from(schema.waitlist)
    .orderBy(desc(schema.waitlist.createdAt))
    .limit(500);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Waitlist</h1>
        <span className="text-sm text-slate-500">{rows.length} signups</span>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600 text-left">
            <tr>
              <th className="px-4 py-2 font-medium">Email</th>
              <th className="px-4 py-2 font-medium">Currency</th>
              <th className="px-4 py-2 font-medium">Country</th>
              <th className="px-4 py-2 font-medium">Source</th>
              <th className="px-4 py-2 font-medium">Joined</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-slate-200">
                <td className="px-4 py-2">{r.email}</td>
                <td className="px-4 py-2">{r.currency ?? '—'}</td>
                <td className="px-4 py-2">{r.country ?? '—'}</td>
                <td className="px-4 py-2">{r.source ?? '—'}</td>
                <td className="px-4 py-2 text-slate-500">
                  {new Date(r.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td className="px-4 py-6 text-slate-500 text-center" colSpan={5}>
                  No waitlist entries yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
