// Client-side access gate. Phase 5: stores the server-issued grant token from
// /api/cashfree/verify after a confirmed PAID order.
//
// Note: the unlock state lives in localStorage, so it's per-device. A buyer on
// a new device is expected to use the link in the post-purchase email (which
// points to /payment/return?order_id=…&email=… and re-issues the token from
// the server-side order log). Phase 5 sets up the token; the email-resend flow
// is a small follow-up.
'use client';

const FLAG_KEY = 'pv_unlocked';
const TOKEN_KEY = 'pv_grant';
const EMAIL_KEY = 'pv_email';

export function hasAccess(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return window.localStorage.getItem(FLAG_KEY) === 'true';
  } catch {
    return false;
  }
}

export function getGrantToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function getBuyerEmail(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage.getItem(EMAIL_KEY);
  } catch {
    return null;
  }
}

export function setGrant(grant: string, email?: string): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(FLAG_KEY, 'true');
    window.localStorage.setItem(TOKEN_KEY, grant);
    if (email) window.localStorage.setItem(EMAIL_KEY, email);
  } catch {
    /* noop */
  }
}

export function clearAccess(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(FLAG_KEY);
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.removeItem(EMAIL_KEY);
  } catch {
    /* noop */
  }
}
