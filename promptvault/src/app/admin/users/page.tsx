import { desc, eq, like, or, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { db, schema } from '@/db';
import { issueToken } from '@/lib/auth-tokens';
import { buildAppUrl, passwordResetTemplate, sendEmail } from '@/lib/email';

export const metadata = { title: 'Admin · Users' };
export const dynamic = 'force-dynamic';

async function setRole(formData: FormData) {
  'use server';
  const session = await auth();
  if (session?.user?.role !== 'admin') return;
  const id = String(formData.get('id') ?? '');
  const role = String(formData.get('role') ?? 'user') as 'user' | 'admin';
  if (id === session.user.id && role !== 'admin') return; // can't demote self
  await db.update(schema.users).set({ role }).where(eq(schema.users.id, id));
  revalidatePath('/admin/users');
}

async function setDisabled(formData: FormData) {
  'use server';
  const session = await auth();
  if (session?.user?.role !== 'admin') return;
  const id = String(formData.get('id') ?? '');
  const disabled = formData.get('disabled') === 'true';
  if (id === session.user.id) return;
  await db.update(schema.users).set({ disabled: !disabled }).where(eq(schema.users.id, id));
  revalidatePath('/admin/users');
}

async function sendPasswordReset(formData: FormData) {
  'use server';
  const session = await auth();
  if (session?.user?.role !== 'admin') return;
  const id = String(formData.get('id') ?? '');
  const rows = await db.select().from(schema.users).where(eq(schema.users.id, id)).limit(1);
  const user = rows[0];
  if (!user || !user.email) return;
  const token = await issueToken({ userId: user.id, purpose: 'password_reset' });
  const link = buildAppUrl(`/reset-password/confirm?token=${encodeURIComponent(token)}`);
  const tpl = passwordResetTemplate({ name: user.name, link });
  await sendEmail({ to: user.email, ...tpl });
}

export default async function UsersPage({ searchParams }: { searchParams: { q?: string } }) {
  const q = searchParams.q?.trim() ?? '';
  const where = q
    ? or(like(schema.users.email, `%${q}%`), like(schema.users.name, `%${q}%`))
    : undefined;

  const rows = await db
    .select({
      id: schema.users.id,
      email: schema.users.email,
      name: schema.users.name,
      role: schema.users.role,
      disabled: schema.users.disabled,
      emailVerified: schema.users.emailVerified,
      createdAt: schema.users.createdAt,
      orders: sql<number>`(select count(*) from orders where orders.user_id = users.id and orders.status = 'PAID')`,
    })
    .from(schema.users)
    .where(where as any)
    .orderBy(desc(schema.users.createdAt))
    .limit(200);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Users</h1>
        <form className="flex gap-2">
          <input
            name="q"
            defaultValue={q}
            placeholder="Search email or name…"
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm w-72"
          />
          <button className="rounded-lg border border-slate-300 px-3 text-sm hover:bg-slate-50">
            Search
          </button>
        </form>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600 text-left">
            <tr>
              <th className="px-4 py-2 font-medium">User</th>
              <th className="px-4 py-2 font-medium">Role</th>
              <th className="px-4 py-2 font-medium">Verified</th>
              <th className="px-4 py-2 font-medium">Paid orders</th>
              <th className="px-4 py-2 font-medium">Joined</th>
              <th className="px-4 py-2 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((u) => (
              <tr key={u.id} className="border-t border-slate-200">
                <td className="px-4 py-2">
                  <div className="font-medium">{u.email}</div>
                  {u.name && <div className="text-xs text-slate-500">{u.name}</div>}
                </td>
                <td className="px-4 py-2">
                  <form action={setRole} className="inline-flex gap-1">
                    <input type="hidden" name="id" value={u.id} />
                    <select
                      name="role"
                      defaultValue={u.role}
                      className="rounded-md border border-slate-300 text-xs px-2 py-1"
                    >
                      <option value="user">user</option>
                      <option value="admin">admin</option>
                    </select>
                    <button className="text-xs underline">save</button>
                  </form>
                </td>
                <td className="px-4 py-2">
                  {u.emailVerified ? (
                    <span className="text-emerald-700 text-xs">Yes</span>
                  ) : (
                    <span className="text-amber-700 text-xs">No</span>
                  )}
                </td>
                <td className="px-4 py-2">{u.orders}</td>
                <td className="px-4 py-2 text-slate-500">
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-2 space-x-3">
                  <form action={setDisabled} className="inline">
                    <input type="hidden" name="id" value={u.id} />
                    <input type="hidden" name="disabled" value={String(u.disabled)} />
                    <button
                      className={`text-xs underline ${u.disabled ? 'text-emerald-700' : 'text-rose-700'}`}
                    >
                      {u.disabled ? 'Enable' : 'Disable'}
                    </button>
                  </form>
                  <form action={sendPasswordReset} className="inline">
                    <input type="hidden" name="id" value={u.id} />
                    <button className="text-xs underline">Send reset</button>
                  </form>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td className="px-4 py-6 text-slate-500 text-center" colSpan={6}>
                  No users match.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
