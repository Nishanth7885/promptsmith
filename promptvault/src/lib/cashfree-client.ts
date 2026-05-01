'use client';

// Client-only helper around the official Cashfree drop-in SDK.
// PCI requirement: cashfree.js MUST be loaded from the official CDN, never
// bundled or self-hosted. The npm package @cashfreepayments/cashfree-js
// performs that load for us at runtime.
import { load } from '@cashfreepayments/cashfree-js';

let cachedPromise: ReturnType<typeof load> | null = null;

export async function getCashfree(mode: 'sandbox' | 'production' = 'sandbox') {
  if (!cachedPromise) {
    cachedPromise = load({ mode });
  }
  return cachedPromise;
}
