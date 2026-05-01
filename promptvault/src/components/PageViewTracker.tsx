'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';

const SESSION_KEY = 'ps_sid';

function getOrCreateSessionId(): string {
  try {
    const existing = window.sessionStorage.getItem(SESSION_KEY);
    if (existing) return existing;
    const sid = Math.random().toString(36).slice(2) + Date.now().toString(36);
    window.sessionStorage.setItem(SESSION_KEY, sid);
    return sid;
  } catch {
    return '';
  }
}

export function PageViewTracker() {
  const pathname = usePathname();
  const search = useSearchParams();
  const lastSent = useRef<string>('');

  useEffect(() => {
    if (!pathname) return;
    if (pathname.startsWith('/admin')) return;
    const key = pathname + '?' + (search?.toString() ?? '');
    if (lastSent.current === key) return;
    lastSent.current = key;
    const payload = JSON.stringify({ path: pathname, sessionId: getOrCreateSessionId() });
    try {
      // sendBeacon doesn't return a status, but it survives navigation.
      const blob = new Blob([payload], { type: 'application/json' });
      if (navigator.sendBeacon && navigator.sendBeacon('/api/track', blob)) return;
      void fetch('/api/track', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: payload,
        keepalive: true,
      });
    } catch {
      /* ignore */
    }
  }, [pathname, search]);

  return null;
}
