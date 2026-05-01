import { desc, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { db, schema } from '@/db';
import { markOrderPaid } from '@/lib/order-fulfillment';
import { appendOrderEvent } from '@/lib/order-log';

export const metadata = { title: 'Admin · Orders' };
export const dynamic = 'force-dynamic';

async function manualMarkPaid(formData: FormData) {
  'use server';
  const session = await auth();
  if (session?.user?.role !== 'admin') return;
  const orderId = String(formData.get('id') ?? '');
  const note = String(formData.get('note') ?? '').trim() || 'manual mark paid';
  await appendOrderEvent({ orderId, status: 'PAID', source: 'admin', note });
  await markOrderPaid({ orderId, paidAt: new Date(), paymentMode: 'manual' });
  revalidatePath('/admin/orders');
}

export default async function OrdersPage({ searchParams }: { searchParams: { status?: string } }) {
  const status = searchParams.status?.toUpperCase();
  const where = status ? eq(schema.orders.status, status as any) : undefined;
  const rows = await db
    .select()
    .from(schema.orders)
    .where(where as any)
    .orderBy(desc(schema.orders.createdAt))
    .limit(200);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Orders</h1>
        <div className="flex gap-2 text-sm">
          {['ALL', 'PAID', 'ACTIVE', 'FAILED', 'EXPIRED', 'REFUNDED'].map((s) => (
            <a
              key={s}
              href={s === 'ALL' ? '/admin/orders' : `/admin/orders?status=${s}`}
              className={`px-3 py-1.5 rounded-full ${
                (s === 'ALL' && !status) || s === status
                  ? 'bg-slate-900 text-white'
                  : 'bg-white border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {s}
            </a>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600 text-left">
            <tr>
              <th className="px-4 py-2 font-medium">Order</th>
              <th className="px-4 py-2 font-medium">Customer</th>
              <th className="px-4 py-2 font-medium">Amount</th>
              <th className="px-4 py-2 font-medium">Coupon</th>
              <th className="px-4 py-2 font-medium">Status</th>
              <th className="px-4 py-2 font-medium">Created</th>
              <th className="px-4 py-2 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((o) => (
              <tr key={o.id} className="border-t border-slate-200">
                <td className="px-4 py-2 font-mono text-xs">{o.id}</td>
                <td className="px-4 py-2">{o.customerEmail}</td>
                <td className="px-4 py-2">
                  {o.currency === 'INR' ? '₹' : '$'}
                  {o.amountTotal}
                </td>
                <td className="px-4 py-2 font-mono text-xs text-slate-500">{o.couponCode ?? '—'}</td>
                <td className="px-4 py-2">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      o.status === 'PAID'
                        ? 'bg-emerald-50 text-emerald-700'
                        : o.status === 'FAILED' || o.status === 'EXPIRED'
                          ? 'bg-rose-50 text-rose-700'
                          : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {o.status}
                  </span>
                </td>
                <td className="px-4 py-2 text-slate-500">
                  {new Date(o.createdAt).toLocaleString()}
                </td>
                <td className="px-4 py-2">
                  {o.status !== 'PAID' && (
                    <form action={manualMarkPaid}>
                      <input type="hidden" name="id" value={o.id} />
                      <input
                        type="text"
                        name="note"
                        placeholder="reason"
                        className="text-xs rounded-md border border-slate-300 px-2 py-1 w-32"
                      />
                      <button className="ml-2 text-xs underline">Mark paid</button>
                    </form>
                  )}
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td className="px-4 py-6 text-slate-500 text-center" colSpan={7}>
                  No orders.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
