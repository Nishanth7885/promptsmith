import Link from 'next/link';
import { CurrencyToggle } from './CurrencyToggle';
import { HeaderPriceBadge } from './HeaderPriceBadge';
import { CartLink } from './CartLink';
import { HeaderAuthNav } from './HeaderAuthNav';

// Server-component shell only — every auth-aware piece (Account/Admin/Login
// links, sign-out button) lives in <HeaderAuthNav> as a client island that
// reads useSession() so static-rendered pages don't ship stale logged-out
// markup.
export default function Header() {
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
          <HeaderAuthNav variant="desktop" />
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <CurrencyToggle />
          <CartLink />
          <HeaderAuthNav variant="mobile" />
        </div>
      </div>
    </header>
  );
}
