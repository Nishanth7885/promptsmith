'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface Props {
  defaultValue?: string;
  size?: 'sm' | 'lg';
  autoFocus?: boolean;
}

export default function SearchBar({ defaultValue = '', size = 'lg', autoFocus = false }: Props) {
  const router = useRouter();
  const [q, setQ] = useState(defaultValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = q.trim();
    if (!trimmed) return;
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  const sizeClasses =
    size === 'lg' ? 'h-14 text-base px-5' : 'h-11 text-sm px-4';

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        autoFocus={autoFocus}
        placeholder="Search prompts (e.g. UPSC essay, Diwali campaign, biryani SOP)…"
        className={`w-full rounded-full border border-slate-300 bg-white pr-32 shadow-sm outline-none ring-rose-500/30 transition focus:border-rose-500 focus:ring-2 ${sizeClasses}`}
      />
      <button
        type="submit"
        className={`absolute right-1.5 top-1.5 rounded-full bg-rose-600 px-5 font-semibold text-white shadow-sm transition hover:bg-rose-700 ${
          size === 'lg' ? 'h-11 text-sm' : 'h-8 text-xs'
        }`}
      >
        Search
      </button>
    </form>
  );
}
