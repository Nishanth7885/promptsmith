import { desc, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { db, schema } from '@/db';

export const metadata = { title: 'Admin · Coupons' };
export const dynamic = 'force-dynamic';

async function createCoupon(formData: FormData) {
  'use server';
  const session = await auth();
  if (session?.user?.role !== 'admin') return;

  const code = String(formData.get('code') ?? '').trim().toUpperCase();
  const type = String(formData.get('type') ?? 'percent') as 'percent' | 'flat';
  const value = Number(formData.get('value') ?? 0);
  const currencyRaw = String(formData.get('currency') ?? '');
  const currency = currencyRaw === 'INR' || currencyRaw === 'USD' ? currencyRaw : null;
  const maxUsesRaw = String(formData.get('max_uses') ?? '').trim();
  const maxUses = maxUsesRaw ? Number(maxUsesRaw) : null;
  const expiresAtRaw = String(formData.get('expires_at') ?? '').trim();
  const expiresAt = expiresAtRaw ? new Date(expiresAtRaw) : null;
  const note = String(formData.get('note') ?? '').trim() || null;

  if (!code || code.length < 3 || code.length > 40) return;
  if (!Number.isFinite(value) || value <= 0) return;
  if (type === 'percent' && value > 100) return;
  if (type === 'flat' && !currency) return;

  await db.insert(schema.coupons).values({
    code,
    type,
    value,
    currency: currency ?? null,
    maxUses,
    expiresAt: expiresAt ?? null,
    note,
    createdBy: session.user.id,
  });
  revalidatePath('/admin/coupons');
}

async function toggleActive(formData: FormData) {
  'use server';
  const session = await auth();
  if (session?.user?.role !== 'admin') return;
  const id = String(formData.get('id') ?? '');
  const active = formData.get('active') === 'true';
  await db.update(schema.coupons).set({ active: !active }).where(eq(schema.coupons.id, id));
  revalidatePath('/admin/coupons');
}

export default async function CouponsPage() {
  const list = await db
    .select()
    .from(schema.coupons)
    .orderBy(desc(schema.coupons.createdAt))
    .limit(200);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold tracking-tight">Coupons</h1>

      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="font-medium">Create coupon</h2>
        <form action={createCoupon} className="mt-4 grid md:grid-cols-3 gap-4">
          <Field label="Code">
            <input
              name="code"
              required
              placeholder="LAUNCH20"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 uppercase"
            />
          </Field>
          <Field label="Type">
            <select name="type" className="w-full rounded-lg border border-slate-300 px-3 py-2">
              <option value="percent">% off</option>
              <option value="flat">Flat amount off</option>
            </select>
          </Field>
          <Field label="Value">
            <input
              name="value"
              type="number"
              step="0.01"
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </Field>
          <Field label="Currency (required for flat)">
            <select name="currency" className="w-full rounded-lg border border-slate-300 px-3 py-2">
              <option value="">Any (percent only)</option>
              <option value="INR">INR</option>
              <option value="USD">USD</option>
            </select>
          </Field>
          <Field label="Max uses (blank = unlimited)">
            <input
              name="max_uses"
              type="number"
              step="1"
              min="1"
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </Field>
          <Field label="Expires at (optional)">
            <input
              name="expires_at"
              type="datetime-local"
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </Field>
          <Field label="Note (internal)">
            <input
              name="note"
              type="text"
              maxLength={120}
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </Field>
          <div className="md:col-span-3">
            <button
              type="submit"
              className="bg-slate-900 text-white font-medium rounded-lg px-4 py-2.5 hover:bg-slate-800"
            >
              Create coupon
            </button>
          </div>
        </form>
      </section>

      <section>
        <h2 className="font-medium mb-3">All coupons ({list.length})</h2>
        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-600 text-left">
              <tr>
                <th className="px-4 py-2 font-medium">Code</th>
                <th className="px-4 py-2 font-medium">Type</th>
                <th className="px-4 py-2 font-medium">Value</th>
                <th className="px-4 py-2 font-medium">Currency</th>
                <th className="px-4 py-2 font-medium">Used / Max</th>
                <th className="px-4 py-2 font-medium">Expires</th>
                <th className="px-4 py-2 font-medium">Active</th>
              </tr>
            </thead>
            <tbody>
              {list.map((c) => (
                <tr key={c.id} className="border-t border-slate-200">
                  <td className="px-4 py-2 font-mono">{c.code}</td>
                  <td className="px-4 py-2">{c.type}</td>
                  <td className="px-4 py-2">
                    {c.type === 'percent' ? `${c.value}%` : c.currency === 'INR' ? `₹${c.value}` : `$${c.value}`}
                  </td>
                  <td className="px-4 py-2">{c.currency ?? '—'}</td>
                  <td className="px-4 py-2">
                    {c.usedCount}
                    {c.maxUses ? ` / ${c.maxUses}` : ''}
                  </td>
                  <td className="px-4 py-2">
                    {c.expiresAt ? new Date(c.expiresAt).toLocaleDateString() : '—'}
                  </td>
                  <td className="px-4 py-2">
                    <form action={toggleActive}>
                      <input type="hidden" name="id" value={c.id} />
                      <input type="hidden" name="active" value={String(c.active)} />
                      <button
                        type="submit"
                        className={`text-xs px-2 py-1 rounded-full ${
                          c.active
                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {c.active ? 'Active' : 'Inactive'}
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
              {list.length === 0 && (
                <tr>
                  <td className="px-4 py-6 text-slate-500 text-center" colSpan={7}>
                    No coupons yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-sm font-medium">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}
