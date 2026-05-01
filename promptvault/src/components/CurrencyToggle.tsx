'use client';

import { useCurrency } from './CurrencyContext';

export function CurrencyToggle({ className = '' }: { className?: string }) {
  const { currency, setCurrency } = useCurrency();
  return (
    <div className={`inline-flex rounded-full border border-slate-300 p-0.5 text-xs ${className}`}>
      {(['INR', 'USD'] as const).map((c) => (
        <button
          key={c}
          type="button"
          onClick={() => setCurrency(c)}
          className={`px-2.5 py-1 rounded-full transition ${
            currency === c
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:text-slate-900'
          }`}
          aria-pressed={currency === c}
        >
          {c}
        </button>
      ))}
    </div>
  );
}
