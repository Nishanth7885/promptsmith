import Link from 'next/link';
import { auth, signOut } from '@/auth';
import { CurrencyToggle } from './CurrencyToggle';
import { HeaderPriceBadge } from './HeaderPriceBadge';

export default async function Header() {
  const session = await auth();
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2 text-lg font-extrabold tracking-tight">
          <span className="rounded-md bg-gradient-to-br from-orange-500 via-rose-500 to-emerald-600 px-2 py-1 text-white">
            PS
          </span>
          <span>Prompt Smith</span>
        </Link>

        <nav className="hidden items-center gap-5 text-sm font-medium text-slate-700 md:flex">
          <Link href="/browse" className="hover:text-rose-600">Browse</Link>
          <Link href="/search" className="hover:text-rose-600">Search</Link>
          <Link href="/preview" className="hover:text-rose-600">Free Preview</Link>
          <CurrencyToggle />
          <HeaderPriceBadge />
          {session?.user ? (
            <div className="flex items-center gap-3">
              <Link href="/account" className="hover:text-rose-600">Account</Link>
              {session.user.role === 'admin' && (
                <Link href="/admin" className="hover:text-rose-600">Admin</Link>
              )}
              <form
                action={async () => {
                  'use server';
                  await signOut({ redirectTo: '/' });
                }}
              >
                <button className="text-slate-600 hover:text-slate-900">Log out</button>
              </form>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login" className="hover:text-rose-600">Log in</Link>
              <Link
                href="/signup"
                className="rounded-full border border-slate-300 px-3 py-1.5 hover:bg-slate-50"
              >
                Sign up
              </Link>
            </div>
          )}
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <CurrencyToggle />
          {session?.user ? (
            <Link href="/account" className="rounded-full border border-slate-300 px-3 py-1.5 text-xs font-semibold">
              Account
            </Link>
          ) : (
            <Link href="/login" className="rounded-full border border-slate-300 px-3 py-1.5 text-xs font-semibold">
              Log in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
