'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { NICHES, type NicheCopy, type NicheKey } from './preview/_data';

const AUTO_ROTATE_MS = 8000;

export default function PreviewClient() {
  const [activeKey, setActiveKey] = useState<NicheKey>('saas');
  const [paused, setPaused] = useState(false);

  // Parallax tracking
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const innerScrollRef = useRef<HTMLDivElement | null>(null);
  const layer1Ref = useRef<HTMLDivElement | null>(null);
  const layer2Ref = useRef<HTMLDivElement | null>(null);
  const layer3Ref = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const reducedMotionRef = useRef<boolean>(false);

  const active = useMemo<NicheCopy>(
    () => NICHES.find((n) => n.key === activeKey) ?? NICHES[0],
    [activeKey],
  );

  // Auto-rotate niches every 8s unless paused (paused after first user click).
  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => {
      setActiveKey((prev) => {
        const idx = NICHES.findIndex((n) => n.key === prev);
        return NICHES[(idx + 1) % NICHES.length].key;
      });
    }, AUTO_ROTATE_MS);
    return () => window.clearInterval(id);
  }, [paused]);

  // Detect reduced motion
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    reducedMotionRef.current = mq.matches;
    const onChange = (e: MediaQueryListEvent) => {
      reducedMotionRef.current = e.matches;
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // Parallax: outer page scroll → translate inner layers at different rates
  const update = useCallback(() => {
    rafRef.current = null;
    const section = sectionRef.current;
    if (!section) return;

    const rect = section.getBoundingClientRect();
    const viewportH = window.innerHeight || 1;
    // progress: 0 when section enters bottom of viewport, 1 when it leaves the top.
    const totalRange = rect.height + viewportH;
    const raw = (viewportH - rect.top) / totalRange;
    const progress = Math.max(0, Math.min(1, raw));

    const isMobile = window.innerWidth < 768;
    const reduce = reducedMotionRef.current;
    // Dampening: 1 on desktop, 0.4 on mobile, 0 if reduced motion
    const damp = reduce ? 0 : isMobile ? 0.4 : 1;

    // Inner viewport scrolls top -> bottom across the section's range.
    const inner = innerScrollRef.current;
    if (inner) {
      const maxScroll = inner.scrollHeight - inner.clientHeight;
      inner.scrollTop = maxScroll * progress * damp + (reduce ? 0 : 0);
    }

    // Layered translateY for parallax depth (relative to section center)
    const sectionCenter = rect.top + rect.height / 2;
    const offset = (viewportH / 2 - sectionCenter) * damp;
    if (layer1Ref.current) layer1Ref.current.style.transform = `translate3d(0, ${offset * 0.05}px, 0)`;
    if (layer2Ref.current) layer2Ref.current.style.transform = `translate3d(0, ${offset * 0.12}px, 0)`;
    if (layer3Ref.current) layer3Ref.current.style.transform = `translate3d(0, ${offset * 0.22}px, 0)`;
  }, []);

  useEffect(() => {
    const onScroll = () => {
      if (rafRef.current != null) return;
      rafRef.current = window.requestAnimationFrame(update);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (rafRef.current != null) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [update]);

  const handlePillClick = (key: NicheKey) => {
    setActiveKey(key);
    setPaused(true);
  };

  return (
    <section
      id="demo"
      ref={sectionRef}
      className="relative mx-auto max-w-7xl scroll-mt-20 px-4 pb-20 sm:px-6"
    >
      <div className="mx-auto max-w-3xl text-center">
        <span className="inline-flex rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700">
          Live preview
        </span>
        <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Watch the same prompt build a different page for each niche.
        </h2>
        <p className="mt-3 text-sm text-slate-600">
          Pick a niche to peek inside the browser frame — then open the full, scrollable page in a new tab.
        </p>
      </div>

      {/* Niche pills */}
      <div className="mt-8 flex justify-center">
        <div className="flex flex-wrap items-center justify-center gap-2 rounded-full border border-slate-200 bg-white/80 p-1.5 shadow-sm backdrop-blur">
          {NICHES.map((n) => {
            const isActive = n.key === activeKey;
            return (
              <button
                key={n.key}
                type="button"
                onClick={() => handlePillClick(n.key)}
                className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition sm:text-sm ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
                aria-pressed={isActive}
              >
                <span aria-hidden>{n.emoji}</span>
                <span>{n.label}</span>
              </button>
            );
          })}
        </div>
      </div>
      {!paused && (
        <p className="mt-3 text-center text-[11px] uppercase tracking-wider text-slate-400">
          auto-rotating · click to pause
        </p>
      )}

      {/* Browser frame */}
      <div className="relative mx-auto mt-8 max-w-5xl">
        <div
          ref={layer1Ref}
          aria-hidden
          className="pointer-events-none absolute -inset-x-8 -top-8 -z-10 h-32 rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(244,114,182,0.18),transparent_70%)] blur-2xl"
        />
        <div
          ref={layer2Ref}
          aria-hidden
          className="pointer-events-none absolute -inset-x-12 -bottom-10 -z-10 h-32 rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(167,139,250,0.18),transparent_70%)] blur-2xl"
        />

        <div
          ref={layer3Ref}
          className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-xl"
        >
          {/* Chrome bar */}
          <div className="flex items-center gap-3 border-b border-slate-200 bg-gradient-to-b from-slate-50 to-slate-100 px-4 py-2.5">
            <div className="flex gap-1.5">
              <span className="h-3 w-3 rounded-full bg-rose-400" />
              <span className="h-3 w-3 rounded-full bg-amber-400" />
              <span className="h-3 w-3 rounded-full bg-emerald-400" />
            </div>
            <Link
              href={`/claude-design/preview/${active.key}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mx-auto flex max-w-md items-center gap-2 rounded-md bg-white px-3 py-1 text-[11px] text-slate-500 ring-1 ring-slate-200 transition hover:text-rose-600 hover:ring-rose-300"
              title={`Open ${active.brand} full landing page in a new tab`}
            >
              <span aria-hidden>🔒</span>
              <span className="truncate">{active.domain}</span>
              <span aria-hidden className="text-slate-400">↗</span>
            </Link>
            <Link
              href={`/claude-design/preview/${active.key}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden rounded-full bg-slate-900 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white transition hover:bg-rose-600 sm:inline-flex"
              title={`Open ${active.brand} full page`}
            >
              Open ↗
            </Link>
          </div>

          {/* Inner viewport (scrolls via parallax) */}
          <div
            ref={innerScrollRef}
            className="h-[440px] overflow-hidden bg-white sm:h-[520px]"
          >
            <InnerLanding niche={active} />
          </div>
        </div>

        {/* Below-frame CTA: open the actual full landing page in a new tab. */}
        <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href={`/claude-design/preview/${active.key}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-rose-600 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-rose-500/30 transition hover:shadow-rose-500/50"
          >
            Open the full {active.label} page
            <span className="transition group-hover:translate-x-0.5" aria-hidden>↗</span>
          </Link>
          <span className="text-[12px] text-slate-500">
            Real route · scrollable · parallax · niche-themed.
          </span>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Inner landing page mock                                                    */
/* -------------------------------------------------------------------------- */

function InnerLanding({ niche }: { niche: NicheCopy }) {
  return (
    <div className="text-slate-900">
      {/* Mini header */}
      <div className="flex items-center justify-between border-b border-slate-100 bg-white/90 px-5 py-3 text-[10px] backdrop-blur">
        <div className="flex items-center gap-1.5 font-bold">
          <span className="text-base">{niche.emoji}</span>
          <span>{niche.brand}</span>
        </div>
        <div className="hidden gap-3 text-slate-500 sm:flex">
          <span>Features</span>
          <span>Pricing</span>
          <span>FAQ</span>
        </div>
        <div className="rounded-full bg-slate-900 px-2.5 py-1 text-[9px] font-semibold text-white">
          Get started
        </div>
      </div>

      {/* HERO */}
      <section className="bg-gradient-to-b from-rose-50/40 via-white to-white px-6 py-10 text-center sm:px-10">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-rose-600">
          {niche.hero.eyebrow}
        </p>
        <h1 className="mx-auto mt-3 max-w-xl text-2xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-3xl">
          {niche.hero.h1}
        </h1>
        <p className="mx-auto mt-3 max-w-md text-xs leading-relaxed text-slate-600 sm:text-sm">
          {niche.hero.sub}
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          <span className="rounded-full bg-rose-600 px-4 py-2 text-[11px] font-semibold text-white shadow-sm">
            {niche.hero.primaryCta}
          </span>
          <span className="rounded-full bg-white px-4 py-2 text-[11px] font-semibold text-slate-800 ring-1 ring-slate-200">
            {niche.hero.secondaryCta}
          </span>
        </div>
        <p className="mt-4 text-[10px] text-slate-500">{niche.hero.trust}</p>
      </section>

      {/* FEATURES */}
      <section className="border-t border-slate-100 px-6 py-10 sm:px-10">
        <p className="text-center text-[10px] font-bold uppercase tracking-[0.18em] text-violet-600">
          Features
        </p>
        <h2 className="mx-auto mt-2 max-w-md text-center text-lg font-bold text-slate-900 sm:text-xl">
          Built for the way your team actually works.
        </h2>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {niche.features.map((f) => (
            <div
              key={f.title}
              className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm"
            >
              <div className="text-xl">{f.emoji}</div>
              <div className="mt-2 text-xs font-bold text-slate-900">{f.title}</div>
              <p className="mt-1 text-[11px] leading-relaxed text-slate-600">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section className="border-t border-slate-100 bg-slate-50 px-6 py-10 sm:px-10">
        <p className="text-center text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-600">
          Pricing
        </p>
        <h2 className="mt-2 text-center text-lg font-bold sm:text-xl">Honest pricing, no surprises.</h2>
        <div className="mx-auto mt-6 grid max-w-lg gap-3 sm:grid-cols-2">
          {niche.pricing.tiers.map((t) => (
            <div
              key={t.name}
              className={`rounded-xl border p-4 ${
                t.highlight
                  ? 'border-rose-300 bg-white shadow-md ring-1 ring-rose-200'
                  : 'border-slate-200 bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-slate-900">{t.name}</div>
                {t.highlight && (
                  <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[9px] font-bold text-rose-700">
                    POPULAR
                  </span>
                )}
              </div>
              <div className="mt-1 text-lg font-extrabold tracking-tight">{t.price}</div>
              <div className="text-[10px] text-slate-500">{t.tagline}</div>
              <ul className="mt-3 space-y-1.5 text-[11px] text-slate-700">
                {t.bullets.map((b) => (
                  <li key={b} className="flex items-center gap-1.5">
                    <span className="text-emerald-600">✓</span>
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-slate-100 px-6 py-10 sm:px-10">
        <p className="text-center text-[10px] font-bold uppercase tracking-[0.18em] text-amber-600">
          FAQ
        </p>
        <h2 className="mt-2 text-center text-lg font-bold sm:text-xl">Questions, answered.</h2>
        <div className="mx-auto mt-5 max-w-xl space-y-2.5">
          {niche.faq.map((item) => (
            <div
              key={item.q}
              className="rounded-xl border border-slate-100 bg-white p-3.5"
            >
              <div className="text-[11px] font-bold text-slate-900">{item.q}</div>
              <p className="mt-1 text-[11px] leading-relaxed text-slate-600">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="border-t border-slate-100 bg-gradient-to-b from-white to-rose-50/40 px-6 py-10 sm:px-10">
        <p className="text-center text-[10px] font-bold uppercase tracking-[0.18em] text-rose-600">
          Testimonials
        </p>
        <h2 className="mt-2 text-center text-lg font-bold sm:text-xl">
          What real customers say.
        </h2>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {niche.testimonials.map((t) => (
            <div
              key={t.name}
              className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm"
            >
              <p className="text-[11px] italic leading-relaxed text-slate-700">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="mt-3 text-[10px] font-semibold text-slate-900">{t.name}</div>
              <div className="text-[10px] text-slate-500">{t.role}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="border-t border-slate-100 px-6 py-8 sm:px-10">
        <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-rose-900 p-6 text-center text-white">
          <h3 className="text-base font-bold sm:text-lg">{niche.cta.headline}</h3>
          <p className="mt-1 text-[11px] text-slate-200">{niche.cta.sub}</p>
          <span className="mt-4 inline-block rounded-full bg-white px-4 py-2 text-[11px] font-semibold text-slate-900">
            {niche.cta.button}
          </span>
        </div>
      </section>

      {/* BRAND VOICE */}
      <section className="border-t border-slate-100 bg-slate-50 px-6 py-8 sm:px-10">
        <p className="text-center text-[10px] font-bold uppercase tracking-[0.18em] text-violet-600">
          Brand voice
        </p>
        <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
          {niche.brandVoice.adjectives.map((a) => (
            <span
              key={a}
              className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold text-slate-700"
            >
              {a}
            </span>
          ))}
        </div>
        <p className="mx-auto mt-3 max-w-md text-center text-[11px] italic leading-relaxed text-slate-600">
          {niche.brandVoice.sample}
        </p>
      </section>

      {/* SEO META PREVIEW */}
      <section className="border-t border-slate-100 px-6 py-8 sm:px-10">
        <p className="text-center text-[10px] font-bold uppercase tracking-[0.18em] text-sky-600">
          SEO preview
        </p>
        <div className="mx-auto mt-4 max-w-md rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
          <div className="text-[10px] text-slate-500">{niche.seo.url}</div>
          <div className="mt-1 text-sm font-medium leading-snug text-blue-700 hover:underline">
            {niche.seo.title}
          </div>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-600">{niche.seo.description}</p>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="border-t border-slate-100 bg-gradient-to-b from-white to-violet-50/40 px-6 py-10 sm:px-10">
        <p className="text-center text-[10px] font-bold uppercase tracking-[0.18em] text-violet-600">
          How it works
        </p>
        <h2 className="mt-2 text-center text-lg font-bold sm:text-xl">Three steps. That&apos;s it.</h2>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {niche.howItWorks.map((s) => (
            <div
              key={s.step}
              className="rounded-xl border border-slate-100 bg-white p-4 text-center shadow-sm"
            >
              <div className="mx-auto flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-[10px] font-bold text-white">
                {s.step}
              </div>
              <div className="mt-2 text-xs font-bold text-slate-900">{s.title}</div>
              <p className="mt-1 text-[11px] leading-relaxed text-slate-600">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-slate-900 px-6 py-8 text-slate-300 sm:px-10">
        <div className="grid gap-4 sm:grid-cols-3">
          {niche.footer.columns.map((col) => (
            <div key={col.heading}>
              <div className="text-[10px] font-bold uppercase tracking-wider text-white">
                {col.heading}
              </div>
              <ul className="mt-2 space-y-1 text-[11px] text-slate-400">
                {col.links.map((l) => (
                  <li key={l}>{l}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-6 border-t border-slate-800 pt-4 text-[10px] text-slate-500">
          {niche.footer.tagline}
        </p>
      </footer>
    </div>
  );
}
