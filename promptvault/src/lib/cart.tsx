'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

const STORAGE_KEY = 'pv_cart_v1';

export interface CartItem {
  slug: string;
  name: string;
  /** Snapshot of the per-category INR price at the moment of adding. */
  priceInr: number;
}

interface CartContextValue {
  items: CartItem[];
  count: number;
  totalInr: number;
  add: (item: CartItem) => void;
  remove: (slug: string) => void;
  clear: () => void;
  has: (slug: string) => boolean;
  ready: boolean;
}

const CartContext = createContext<CartContextValue | null>(null);

function loadFromStorage(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (x): x is CartItem =>
        x && typeof x.slug === 'string' && typeof x.name === 'string' && typeof x.priceInr === 'number',
    );
  } catch {
    return [];
  }
}

function saveToStorage(items: CartItem[]) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    /* quota / private mode — ignore */
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setItems(loadFromStorage());
    setReady(true);
  }, []);

  // Cross-tab sync: when another tab writes the cart, mirror it here.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setItems(loadFromStorage());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const persist = useCallback((next: CartItem[]) => {
    setItems(next);
    saveToStorage(next);
  }, []);

  const add = useCallback(
    (item: CartItem) => {
      setItems((prev) => {
        if (prev.some((p) => p.slug === item.slug)) return prev;
        const next = [...prev, item];
        saveToStorage(next);
        return next;
      });
    },
    [],
  );

  const remove = useCallback((slug: string) => {
    setItems((prev) => {
      const next = prev.filter((p) => p.slug !== slug);
      saveToStorage(next);
      return next;
    });
  }, []);

  const clear = useCallback(() => persist([]), [persist]);

  const has = useCallback((slug: string) => items.some((i) => i.slug === slug), [items]);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      count: items.length,
      totalInr: items.reduce((sum, i) => sum + i.priceInr, 0),
      add,
      remove,
      clear,
      has,
      ready,
    }),
    [items, add, remove, clear, has, ready],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    // Allow components to render outside the provider (e.g. during SSR of
    // shells that nest the provider deeper). Returning a neutral default keeps
    // them from crashing; mutations are no-ops until the provider mounts.
    return {
      items: [],
      count: 0,
      totalInr: 0,
      add: () => {},
      remove: () => {},
      clear: () => {},
      has: () => false,
      ready: false,
    };
  }
  return ctx;
}
