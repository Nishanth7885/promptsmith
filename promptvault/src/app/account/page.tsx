import Link from 'next/link';
import { redirect } from 'next/navigation';
import { desc, eq } from 'drizzle-orm';
import { auth, signOut } from '@/auth';
import { db, schema } from '@/db';

export const metadata = { title: 'Your account' };
export const dynamic = 'force-dynamic';

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/login?callbackUrl=/account');

  const userRows = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.id, session.user.id))
    .limit(1);
  const user = userRows[0];

  const orders = await db
    .select()
    .from(schema.orders)
    .where(eq(schema.orders.userId, session.user.id))
    .orderBy(desc(schema.orders.createdAt))
    .limit(20);

  const paidOrder = orders.find((o) => o.status === 'PAID');

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="font-semibold tracking-tight">
            Prompt Smith
          </Link>
          <nav className="text-sm flex items-center gap-4">
            <Link href="/browse" className="text-slate-600 hover:text-slate-900">
              Browse
            </Link>
            {user?.role === 'admin' && (
              <Link href="/admin" className="text-slate-600 hover:text-slate-900">
                Admin
              </Link>
            )}
            <form
              action={async () => {
                'use server';
                await signOut({ redirectTo: '/' });
              }}
            >
              <button className="text-slate-600 hover:text-slate-900">Log out</button>
            </form>
          </nav>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-10 space-y-8">
        <section>
          <h1 className="text-2xl font-semibold tracking-tight">Your account</h1>
          <div className="mt-3 text-sm text-slate-700 space-y-1">
            <p>
              <span className="text-slate-500">Email:</span> {user?.email}
              {!user?.emailVerified && (
                <span className="ml-2 text-amber-700 text-xs bg-amber-50 px-2 py-0.5 rounded-full">
                  Unverified
                </span>
              )}
            </p>
            {user?.name && (
              <p>
                <span className="text-slate-500">Name:</span> {user.name}
              </p>
            )}
          </div>
          {!user?.emailVerified && (
            <p className="mt-3 text-sm">
              <Link href="/verify-email" className="underline text-slate-900">
                Resend verification email
              </Link>
            </p>
          )}
        </section>

        <section>
          <h2 className="text-lg font-semibold">Access</h2>
          {paidOrder ? (
            <div className="mt-3 border border-emerald-200 bg-emerald-50 text-emerald-900 rounded-xl p-4">
              <p className="font-medium">You have lifetime access</p>
              <Link
                href="/preview"
                className="mt-3 inline-block bg-slate-900 text-white font-medium rounded-lg px-4 py-2 hover:bg-slate-800"
              >
                Open prompts
              </Link>
            </div>
          ) : (
            <div className="mt-3 border border-slate-200 bg-white rounded-xl p-4">
              <p className="text-sm text-slate-700">
                You don't have access yet. Get the full pack of 4,000+ prompts.
              </p>
              <Link
                href="/#pricing"
                className="mt-3 inline-block bg-slate-900 text-white font-medium rounded-lg px-4 py-2 hover:bg-slate-800"
              >
                See pricing
              </Link>
            </div>
          )}
        </section>

        <section>
          <h2 className="text-lg font-semibold">Orders</h2>
          {orders.length === 0 ? (
            <p className="mt-2 text-sm text-slate-600">No orders yet.</p>
          ) : (
            <div className="mt-3 border border-slate-200 rounded-xl bg-white overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-slate-600 text-left">
                  <tr>
                    <th className="px-4 py-2 font-medium">Order</th>
                    <th className="px-4 py-2 font-medium">Amount</th>
                    <th className="px-4 py-2 font-medium">Status</th>
                    <th className="px-4 py-2 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.id} className="border-t border-slate-200">
                      <td className="px-4 py-2 font-mono text-xs">{o.id}</td>
                      <td className="px-4 py-2">
                        {o.currency === 'INR' ? '₹' : '$'}
                        {o.amountTotal}
                      </td>
                      <td className="px-4 py-2">
                        <StatusBadge status={o.status} />
                      </td>
                      <td className="px-4 py-2 text-slate-600">
                        {new Date(o.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function StatusBadge({ status }: { status: string }) {
  const tone =
    status === 'PAID'
      ? 'bg-emerald-50 text-emerald-700'
      : status === 'FAILED' || status === 'EXPIRED' || status === 'TERMINATED'
        ? 'bg-red-50 text-red-700'
        : 'bg-slate-100 text-slate-700';
  return <span className={`px-2 py-0.5 rounded-full text-xs ${tone}`}>{status}</span>;
}
