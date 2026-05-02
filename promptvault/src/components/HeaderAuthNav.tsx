'use client';

import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';

interface Props {
  /** Visual variant — desktop is the full nav, mobile is a single CTA. */
  variant?: 'desktop' | 'mobile';
}

/**
 * Client-side auth island for the Header. Uses useSession() so the rendered
 * UI always reflects the current cookie-based session, even on pages that
 * were statically prerendered. Without this, every SSG page would ship the
 * logged-out header baked at build time and only correct itself on hard
 * reload.
 */
export function HeaderAuthNav({ variant = 'desktop' }: Props) {
  const { data: session, status } = useSession();

  // Reserve layout space while session resolves so the header doesn't snap
  // around. `status === 'loading'` is the first paint window.
  if (status === 'loading') {
    return (
      <span
        className={
          variant === 'desktop'
            ? 'inline-block h-7 w-32 animate-pulse rounded-full bg-white/5'
            : 'inline-block h-7 w-16 animate-pulse rounded-full bg-white/5'
        }
        aria-hidden
      />
    );
  }

  if (variant === 'mobile') {
    return session?.user ? (
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
    );
  }

  // Desktop variant.
  return session?.user ? (
    <div className="flex items-center gap-3">
      <Link href="/account" className="transition hover:text-[var(--text)]">
        Account
      </Link>
      {session.user.role === 'admin' && (
        <Link href="/admin" className="transition hover:text-[var(--text)]">
          Admin
        </Link>
      )}
      <button
        type="button"
        onClick={() => signOut({ callbackUrl: '/' })}
        className="transition hover:text-[var(--text)]"
        style={{ color: 'var(--text-mute)' }}
      >
        Log out
      </button>
    </div>
  ) : (
    <div className="flex items-center gap-3">
      <Link href="/login" className="transition hover:text-[var(--text)]">
        Log in
      </Link>
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
  );
}
