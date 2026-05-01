import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth, signOut } from '@/auth';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect('/login?callbackUrl=/admin');
  if (session.user.role !== 'admin') redirect('/');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="font-semibold tracking-tight">
              Prompt Smith <span className="text-rose-600 text-xs ml-1">admin</span>
            </Link>
            <nav className="flex items-center gap-4 text-sm text-slate-600">
              <NavLink href="/admin">Dashboard</NavLink>
              <NavLink href="/admin/orders">Orders</NavLink>
              <NavLink href="/admin/users">Users</NavLink>
              <NavLink href="/admin/coupons">Coupons</NavLink>
              <NavLink href="/admin/pricing">Pricing</NavLink>
              <NavLink href="/admin/traffic">Traffic</NavLink>
              <NavLink href="/admin/waitlist">Waitlist</NavLink>
            </nav>
          </div>
          <form
            action={async () => {
              'use server';
              await signOut({ redirectTo: '/' });
            }}
          >
            <button className="text-sm text-slate-600 hover:text-slate-900">Log out</button>
          </form>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="hover:text-slate-900">
      {children}
    </Link>
  );
}
