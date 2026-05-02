'use client';

import { useState } from 'react';

const FAQS: { q: string; a: string }[] = [
  {
    q: 'Can I use these prompts with any AI tool?',
    a: 'Yes. Every prompt is written to work with ChatGPT, Claude, Gemini, Copilot, Perplexity, Grok, or any LLM. We tag a few code-heavy prompts as Claude-preferred but every prompt is portable.',
  },
  {
    q: 'Are these India-specific or generic copy-pasted prompts?',
    a: 'India-first. Every prompt references INR, Indian regulations (GST, SEBI, RBI, NCERT, CDSCO, FSSAI, BIS, IRDAI, FCRA, DPDP), Indian companies, cities, festivals, and curriculum. No generic Western templates.',
  },
  {
    q: 'How will I receive the prompts?',
    a: 'Instantly after payment, you can browse all 4,029 prompts on this site and download a structured ZIP (JSON + Markdown + organised by category) for offline use.',
  },
  {
    q: 'Do I get free updates?',
    a: 'Yes. Every quarter we add 100-300 new prompts and refresh existing ones. Lifetime access — buy once, no renewals.',
  },
  {
    q: 'Is there a free trial or preview?',
    a: 'Yes — 248 prompts are marked free. Browse the Free Preview page or look for the green "FREE" badge on any category page.',
  },
  {
    q: 'What does the download include?',
    a: 'A ZIP with all 4,029 prompts organised in: a single ALL-PROMPTS.json, a single ALL-PROMPTS.md, and 124 individual subcategory Markdown files for clean offline reading. Plus a README.',
  },
  {
    q: 'Refund policy?',
    a: 'All sales are final. Prompt Smith is a digital, instantly-delivered product, so we do not offer refunds or returns once payment is complete. If you cannot access what you paid for, email digitalhub.admin@gmail.com within 7 days and we will re-grant access at no cost. Full terms on the Refund Policy page.',
  },
  {
    q: 'Is the payment secure?',
    a: 'Payments run via Cashfree (RBI-licensed PA). We do not see or store your card / UPI details. PCI-DSS compliant.',
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h2 className="text-center text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
        Frequently asked questions
      </h2>
      <div className="mt-10 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
        {FAQS.map((item, i) => (
          <div key={item.q} className="px-5 py-4">
            <button
              type="button"
              onClick={() => setOpen(open === i ? null : i)}
              className="flex w-full items-center justify-between gap-4 text-left text-base font-semibold text-slate-900"
            >
              {item.q}
              <span
                className={`grid h-6 w-6 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-600 transition ${
                  open === i ? 'rotate-45' : ''
                }`}
                aria-hidden
              >
                +
              </span>
            </button>
            {open === i && (
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{item.a}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
