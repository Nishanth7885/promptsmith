import Link from 'next/link';
import { auth, signOut } from '@/auth';
import { CurrencyToggle } from './CurrencyToggle';
import { HeaderPriceBadge } from './HeaderPriceBadge';
import { CartLink } from './CartLink';

export default async function Header() {
  const session = await auth();
  return (
    <header
      className="sticky top-0 z-30 border-b backdrop-blur"
      style={{
        background: 'rgba(12, 12, 24, 0.65)',
        borderColor: 'var(--border)',
        backdropFilter: 'blur(18px) saturate(180%)',
        WebkitBackdropFilter: 'blur(18px) saturate(180%)',
      }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-extrabold tracking-tight"
          style={{ color: 'var(--text)' }}
        >
          <span
            className="grid h-8 w-8 place-items-center rounded-lg text-xs font-bold text-white"
            style={{
              background: 'var(--grad-iri)',
              boxShadow: '0 4px 16px -2px rgba(124, 92, 255, 0.6)',
            }}
          >
            PS
          </span>
          <span>Prompt Smith</span>
        </Link>

        <nav
          className="hidden items-center gap-5 text-sm font-medium md:flex"
          style={{ color: 'var(--text-dim)' }}
        >
          <Link href="/browse" className="transition hover:text-[var(--text)]">Browse</Link>
          <Link href="/claude-design" className="transition hover:text-[var(--text)]">Claude Design</Link>
          <Link href="/search" className="transition hover:text-[var(--text)]">Search</Link>
          <Link href="/preview" className="transition hover:text-[var(--text)]">Free Preview</Link>
          <CurrencyToggle />
          <HeaderPriceBadge />
          <CartLink />
          {session?.user ? (
            <div className="flex items-center gap-3">
              <Link href="/account" className="transition hover:text-[var(--text)]">Account</Link>
              {session.user.role === 'admin' && (
                <Link href="/admin" className="transition hover:text-[var(--text)]">Admin</Link>
              )}
              <form
                action={async () => {
                  'use server';
                  await signOut({ redirectTo: '/' });
                }}
              >
                <button
                  className="transition hover:text-[var(--text)]"
                  style={{ color: 'var(--text-mute)' }}
                >
                  Log out
                </button>
              </form>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login" className="transition hover:text-[var(--text)]">Log in</Link>
              <Link
                href="/signup"
                className="rounded-full px-4 py-1.5 text-sm font-semibold transition"
                style={{
                  background: 'var(--grad-iri)',
                  color: 'white',
                  boxShadow: '0 6px 20px -8px rgba(124, 92, 255, 0.6)',
                }}
              >
                Sign up
              </Link>
            </div>
          )}
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <CurrencyToggle />
          <CartLink />
          {session?.user ? (
            <Link
              href="/account"
              className="rounded-full px-3 py-1.5 text-xs font-semibold"
              style={{ border: '1px solid var(--border)', color: 'var(--text)' }}
            >
              Account
            </Link>
          ) : (
            <Link
              href="/login"
              className="rounded-full px-3 py-1.5 text-xs font-semibold"
              style={{ border: '1px solid var(--border)', color: 'var(--text)' }}
            >
              Log in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
