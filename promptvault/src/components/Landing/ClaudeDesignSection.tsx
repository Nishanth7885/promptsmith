'use client';

import { useEffect, useRef } from 'react';

/**
 * ClaudeDesignSection — Instagram-influencer-style parallax ad slot for the
 * "Claude Design" prompt pack. Drops in between the vault and pricing sections
 * of the main landing page. Self-contained styles, all class names are
 * `cd-`-prefixed to avoid colliding with the parent landing styles.
 */

const NICHES: string[] = [
  'SaaS',
  'EdTech',
  'Restaurant',
  'Yoga Studio',
  'D2C',
  'Fintech',
  'Coaching',
  'Real Estate',
  'Salon',
  'Newsletter',
  'Podcast',
  'Mobile App',
  'AI Tooling',
  'Crypto',
  'Dev Tools',
  'Agency',
  'Photography',
  'Wedding',
  'Gym',
  'Pilates',
  'Therapy',
  'Bookstore',
  'Cafe',
  'Bakery',
  'Travel',
  'Hotel',
  'Airbnb Host',
  'NGO',
  'Bootcamp',
  'Course Creator',
  'Influencer',
  'Studio',
  'Architecture',
  'Interior Design',
  'Fashion D2C',
  'Skincare',
  'Pet Brand',
  'Plant Shop',
  'Music Label',
  'Game Studio',
];

export default function ClaudeDesignSection() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLDivElement | null>(null);
  const phoneRef = useRef<HTMLDivElement | null>(null);
  const phoneInnerRef = useRef<HTMLDivElement | null>(null);
  const card1Ref = useRef<HTMLDivElement | null>(null);
  const card2Ref = useRef<HTMLDivElement | null>(null);
  const card3Ref = useRef<HTMLDivElement | null>(null);
  const marqueeRef = useRef<HTMLDivElement | null>(null);

  // Reveal-on-mount, mirrors the parent landing's `.reveal` / `.reveal.in` pattern.
  useEffect(() => {
    const el = titleRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).classList.add('in');
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Parallax — single rAF-throttled scroll listener, normalized to the section's
  // position, dampened on mobile, and respects prefers-reduced-motion.
  useEffect(() => {
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    const section = sectionRef.current;
    const phone = phoneRef.current;
    const phoneInner = phoneInnerRef.current;
    const c1 = card1Ref.current;
    const c2 = card2Ref.current;
    const c3 = card3Ref.current;
    const marquee = marqueeRef.current;

    if (!section) return;

    const mqMobile = window.matchMedia('(max-width: 760px)');
    let mobile = mqMobile.matches;
    const mqHandler = (e: MediaQueryListEvent) => {
      mobile = e.matches;
    };
    mqHandler({ matches: mqMobile.matches } as MediaQueryListEvent);
    if (typeof mqMobile.addEventListener === 'function') {
      mqMobile.addEventListener('change', mqHandler);
    }

    let ticking = false;

    const update = () => {
      ticking = false;
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      // Normalized progress through the section: 0 when section just enters
      // viewport bottom, 1 when its top has scrolled vh past viewport top.
      const raw = (vh - rect.top) / (vh + rect.height);
      const p = Math.max(-0.2, Math.min(1.2, raw));

      const damp = mobile ? 0.45 : 1;

      // Foreground phone: drifts up faster, untilts as you scroll.
      if (phone) {
        const ty = (0.2 - p) * 80 * damp; // -ish px range
        const rot = (1 - Math.min(1, Math.max(0, p))) * 5; // 5deg -> 0deg
        phone.style.setProperty('--cd-phone-y', `${ty.toFixed(2)}px`);
        phone.style.setProperty('--cd-phone-rot', `${rot.toFixed(2)}deg`);
      }
      // Inside-phone scroll: simulates the page scrolling inside the device.
      if (phoneInner) {
        const innerY = -p * 220 * damp;
        phoneInner.style.transform = `translateY(${innerY.toFixed(2)}px)`;
      }
      // Background screenshot cards: slower drift => deeper layer.
      if (c1) {
        const ty = (0.5 - p) * 50 * damp;
        c1.style.setProperty('--cd-card-y', `${ty.toFixed(2)}px`);
      }
      if (c2) {
        const ty = (0.5 - p) * 30 * damp;
        c2.style.setProperty('--cd-card-y', `${ty.toFixed(2)}px`);
      }
      if (c3) {
        const ty = (0.5 - p) * 65 * damp;
        c3.style.setProperty('--cd-card-y', `${ty.toFixed(2)}px`);
      }
      // Marquee gets a subtle horizontal nudge on top of its CSS animation.
      if (marquee) {
        const tx = (0.5 - p) * 40 * damp;
        marquee.style.setProperty('--cd-marquee-x', `${tx.toFixed(2)}px`);
      }
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (typeof mqMobile.removeEventListener === 'function') {
        mqMobile.removeEventListener('change', mqHandler);
      }
    };
  }, []);

  return (
    <section
      className="section cd-section"
      id="claude-design-demo"
      ref={sectionRef}
    >
      <style dangerouslySetInnerHTML={{ __html: CD_STYLES }} />

      {/* TOP MARQUEE — niches scroll horizontally */}
      <div className="cd-marquee-wrap" aria-hidden="true">
        <div className="cd-marquee" ref={marqueeRef}>
          <div className="cd-marquee-track">
            {[0, 1].map((dup) => (
              <div className="cd-marquee-chunk" key={dup}>
                {NICHES.map((n, i) => (
                  <span className="cd-marquee-item" key={`${dup}-${i}`}>
                    <span className="cd-marquee-name">{n}</span>
                    <span className="cd-marquee-dot" />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="wrap">
        {/* HEAD */}
        <div className="section-head reveal cd-head" ref={titleRef}>
          <div>
            <div className="section-tag cd-tag">
              CLAUDE DESIGN <span className="cd-tag-dot" /> NEW · FLAGSHIP PACK
            </div>
            <h2 className="section-title cd-title">
              Skip the ₹50,000 copywriter.{' '}
              <em className="iri">Ship the page tonight.</em>
            </h2>
          </div>
          <p className="section-desc cd-desc">
            <strong style={{ color: 'var(--text)' }}>500 battle-tested prompts</strong> across
            50 niches × 10 sections — hero, features, pricing, FAQ, testimonials, CTA, brand
            voice, SEO, how-it-works, footer. Paste into Claude. Get a complete landing page
            back. <span className="iri">Bundled in your ₹299 all-access purchase.</span>
          </p>
        </div>

        {/* STAGE — parallax theatre */}
        <div className="cd-stage">
          {/* BG screenshot cards */}
          <div
            className="cd-screen-card cd-card-hero"
            ref={card1Ref}
            aria-hidden="true"
          >
            <div className="cd-mini-nav">
              <span className="cd-dot r" />
              <span className="cd-dot y" />
              <span className="cd-dot g" />
              <span className="cd-mini-url">acme.studio</span>
            </div>
            <div className="cd-mini-hero">
              <div className="cd-mini-pill">v2 launch</div>
              <div className="cd-mini-h1">
                Ship a brand <span className="cd-iri">that converts.</span>
              </div>
              <div className="cd-mini-sub">
                Strategy, copy, design — one weekend.
              </div>
              <div className="cd-mini-row">
                <div className="cd-mini-btn primary">Start now</div>
                <div className="cd-mini-btn ghost">Demo</div>
              </div>
            </div>
          </div>

          <div
            className="cd-screen-card cd-card-testi"
            ref={card2Ref}
            aria-hidden="true"
          >
            <div className="cd-quote">
              &ldquo;Built our entire site in a weekend. Bookings up{' '}
              <span className="cd-iri">3.2&times;</span> in two weeks.&rdquo;
            </div>
            <div className="cd-quote-meta">
              <div className="cd-avatar" />
              <div>
                <div className="cd-quote-name">Lina Park</div>
                <div className="cd-quote-role">Founder, Northcut</div>
              </div>
            </div>
          </div>

          <div
            className="cd-screen-card cd-card-price"
            ref={card3Ref}
            aria-hidden="true"
          >
            <div className="cd-mini-pill alt">Pro</div>
            <div className="cd-price-row">
              <span className="cd-price-num">$24</span>
              <span className="cd-price-per">/mo</span>
            </div>
            <ul className="cd-price-list">
              <li>500+ landing prompts</li>
              <li>50 niche packs</li>
              <li>Brand voice generator</li>
              <li>SEO + meta builder</li>
            </ul>
            <div className="cd-mini-btn primary cd-price-cta">Get the pack</div>
          </div>

          {/* FOREGROUND phone */}
          <div className="cd-phone" ref={phoneRef} aria-hidden="true">
            <div className="cd-phone-frame">
              <div className="cd-phone-notch" />
              <div className="cd-phone-screen">
                <div className="cd-phone-inner" ref={phoneInnerRef}>
                  {/* hero */}
                  <div className="cd-p-section">
                    <div className="cd-p-nav">
                      <div className="cd-p-logo" />
                      <div className="cd-p-links">
                        <span /> <span /> <span />
                      </div>
                    </div>
                    <div className="cd-p-tag">For founders shipping v1</div>
                    <div className="cd-p-h1">
                      Stop guessing what to{' '}
                      <span className="cd-iri">ship.</span>
                    </div>
                    <div className="cd-p-sub">
                      A pack of 500+ prompts that write your landing page,
                      tuned for your niche.
                    </div>
                    <div className="cd-p-row">
                      <div className="cd-p-btn primary">Open the pack</div>
                      <div className="cd-p-btn ghost">See demo</div>
                    </div>
                  </div>

                  {/* features */}
                  <div className="cd-p-section">
                    <div className="cd-p-tag">FEATURES</div>
                    <div className="cd-p-h2">Everything a page needs.</div>
                    <div className="cd-p-grid">
                      <div className="cd-p-card">
                        <div className="cd-p-card-icon" />
                        <div className="cd-p-card-title">Hero copy</div>
                        <div className="cd-p-card-body">
                          5 angles, ranked by clarity.
                        </div>
                      </div>
                      <div className="cd-p-card">
                        <div className="cd-p-card-icon alt" />
                        <div className="cd-p-card-title">Pricing</div>
                        <div className="cd-p-card-body">
                          3-tier table, anchor + decoy.
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* pricing preview */}
                  <div className="cd-p-section">
                    <div className="cd-p-tag">PRICING</div>
                    <div className="cd-p-price-card">
                      <div className="cd-p-price-name">Studio</div>
                      <div className="cd-p-price-row">
                        <span className="cd-p-price-num">$24</span>
                        <span className="cd-p-price-per">/mo</span>
                      </div>
                      <div className="cd-p-price-cta">Choose plan</div>
                    </div>
                  </div>

                  {/* testimonial-ish footer */}
                  <div className="cd-p-section">
                    <div className="cd-p-tag">LOVED BY 4,200+ FOUNDERS</div>
                    <div className="cd-p-h2">
                      &ldquo;The fastest landing page I&rsquo;ve ever
                      shipped.&rdquo;
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* glow under the device */}
            <div className="cd-phone-glow" />
          </div>
        </div>

        {/* STATS */}
        <div className="cd-stats reveal">
          <div className="cd-stat">
            <span className="cd-stat-num">500</span>
            <span className="cd-stat-label">prompts</span>
          </div>
          <span className="cd-stat-sep" aria-hidden="true">
            ·
          </span>
          <div className="cd-stat">
            <span className="cd-stat-num">50</span>
            <span className="cd-stat-label">niches</span>
          </div>
          <span className="cd-stat-sep" aria-hidden="true">
            ·
          </span>
          <div className="cd-stat">
            <span className="cd-stat-num">10</span>
            <span className="cd-stat-label">sections each</span>
          </div>
          <span className="cd-stat-sep" aria-hidden="true">
            ·
          </span>
          <div className="cd-stat cd-stat-bundled">
            <span className="cd-stat-label">Just ₹249 · Lifetime</span>
          </div>
        </div>

        {/* VALUE STACK */}
        <div className="cd-value reveal" aria-label="What's in the pack">
          <div className="cd-value-item">
            <span className="cd-value-check">✓</span>
            <span><strong>3 free</strong> hero previews — paste, see Claude output, decide</span>
          </div>
          <div className="cd-value-item">
            <span className="cd-value-check">✓</span>
            <span>Each prompt is <strong>280–500 words</strong>, niche-tuned, India-aware</span>
          </div>
          <div className="cd-value-item">
            <span className="cd-value-check">✓</span>
            <span>SaaS, EdTech, restaurants, yoga studios, D2C — <strong>50 niches covered</strong></span>
          </div>
          <div className="cd-value-item">
            <span className="cd-value-check">✓</span>
            <span>Plus <strong>4,029 other expert prompts</strong> — same one-time payment</span>
          </div>
        </div>

        {/* CTA */}
        <div className="cd-cta-row reveal">
          <a className="cd-btn-primary" href="/claude-design">
            Unlock all 500 — ₹249 <span aria-hidden="true">→</span>
          </a>
          <a className="cd-btn-ghost" href="#claude-design-demo">
            See live demo first
          </a>
        </div>
        <p className="cd-cta-foot reveal">
          One-time payment · Lifetime access · 39 categories · 4,929 prompts total
        </p>
      </div>
    </section>
  );
}

const CD_STYLES = `
.cd-section {
  position: relative;
  overflow: hidden;
  isolation: isolate;
}
.cd-section::before {
  content: "";
  position: absolute; inset: 0;
  background:
    radial-gradient(ellipse 60% 40% at 80% 20%, rgba(124,92,255,0.18), transparent 70%),
    radial-gradient(ellipse 50% 35% at 10% 80%, rgba(34,211,238,0.12), transparent 70%);
  pointer-events: none;
  z-index: 0;
}
.cd-section > * { position: relative; z-index: 1; }

/* MARQUEE */
.cd-marquee-wrap {
  position: relative;
  margin-bottom: clamp(48px, 7vw, 80px);
  padding: 14px 0;
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  background: linear-gradient(180deg, rgba(124,92,255,0.04), rgba(34,211,238,0.04));
  -webkit-mask-image: linear-gradient(90deg, transparent, black 12%, black 88%, transparent);
  mask-image: linear-gradient(90deg, transparent, black 12%, black 88%, transparent);
}
.cd-marquee {
  --cd-marquee-x: 0px;
  transform: translateX(var(--cd-marquee-x));
  will-change: transform;
}
.cd-marquee-track {
  display: flex; width: max-content;
  animation: cd-marquee 40s linear infinite;
}
.cd-marquee-chunk {
  display: flex; align-items: center; flex-shrink: 0;
  padding-right: 8px;
}
.cd-marquee-item {
  display: inline-flex; align-items: center; gap: 18px;
  padding: 0 10px;
  font-family: "Instrument Serif", "Geist", serif;
  font-size: 22px; letter-spacing: -0.01em;
  color: var(--text-dim);
  white-space: nowrap;
}
.cd-marquee-name {
  background: linear-gradient(90deg, var(--text), var(--text-dim));
  -webkit-background-clip: text; background-clip: text;
  -webkit-text-fill-color: transparent;
}
.cd-marquee-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: var(--grad-iri);
  box-shadow: 0 0 12px rgba(124,92,255,0.7);
  flex-shrink: 0;
}
@keyframes cd-marquee {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}

/* HEAD */
.cd-head { margin-bottom: 56px; }
.cd-tag {
  display: inline-flex; align-items: center; gap: 10px;
  color: var(--violet);
}
.cd-tag-dot {
  width: 5px; height: 5px; border-radius: 50%;
  background: var(--grad-iri);
  display: inline-block;
}
.cd-title { max-width: 14ch; }
.cd-desc { max-width: 520px; }

/* STAGE */
.cd-stage {
  position: relative;
  height: clamp(520px, 62vw, 720px);
  margin-bottom: clamp(48px, 6vw, 72px);
  perspective: 1400px;
}

/* BG SCREENSHOT CARDS */
.cd-screen-card {
  --cd-card-y: 0px;
  position: absolute;
  background: linear-gradient(180deg, rgba(18,18,42,0.92), rgba(12,12,24,0.92));
  border: 1px solid var(--border);
  border-radius: var(--r-lg);
  padding: 18px;
  box-shadow:
    0 30px 80px -20px rgba(0,0,0,0.6),
    0 0 0 1px rgba(255,255,255,0.02) inset;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  transform: translateY(var(--cd-card-y)) rotate(var(--cd-card-rot, 0deg));
  will-change: transform;
  z-index: 1;
}
.cd-screen-card::before {
  content: "";
  position: absolute; inset: 0;
  border-radius: var(--r-lg);
  padding: 1px;
  background: var(--grad-iri-soft);
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
          mask-composite: exclude;
  opacity: 0.35;
  pointer-events: none;
}

.cd-card-hero {
  --cd-card-rot: -3deg;
  top: 4%; left: 0%;
  width: clamp(220px, 28%, 320px);
}
.cd-card-testi {
  --cd-card-rot: 6deg;
  top: 52%; left: 6%;
  width: clamp(220px, 26%, 300px);
}
.cd-card-price {
  --cd-card-rot: -2deg;
  top: 58%; right: 4%;
  width: clamp(200px, 22%, 260px);
  z-index: 2;
}

.cd-mini-nav {
  display: flex; align-items: center; gap: 6px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border);
  margin-bottom: 14px;
}
.cd-dot {
  width: 8px; height: 8px; border-radius: 50%;
  background: rgba(255,255,255,0.2);
}
.cd-dot.r { background: #ff6b6b; }
.cd-dot.y { background: #f5c451; }
.cd-dot.g { background: #5eead4; }
.cd-mini-url {
  margin-left: auto;
  font-size: 10px; color: var(--text-mute);
  font-family: "Geist Mono", ui-monospace, monospace;
}
.cd-mini-pill {
  display: inline-block;
  padding: 3px 10px;
  border-radius: var(--r-pill);
  background: rgba(124,92,255,0.18); color: #c5b6ff;
  font-size: 10px; font-weight: 600; letter-spacing: 0.04em;
  text-transform: uppercase;
  margin-bottom: 10px;
}
.cd-mini-pill.alt { background: rgba(34,211,238,0.16); color: #9ce8f3; }
.cd-mini-h1 {
  font-family: "Geist", sans-serif;
  font-size: 18px; font-weight: 600; line-height: 1.15;
  letter-spacing: -0.02em;
  margin-bottom: 6px;
}
.cd-iri {
  background: var(--grad-iri);
  -webkit-background-clip: text; background-clip: text;
  -webkit-text-fill-color: transparent;
  font-family: "Instrument Serif", serif;
  font-style: italic; font-weight: 400;
}
.cd-mini-sub {
  font-size: 11px; color: var(--text-dim); line-height: 1.4;
  margin-bottom: 12px;
}
.cd-mini-row { display: flex; gap: 6px; }
.cd-mini-btn {
  font-size: 10px; font-weight: 600;
  padding: 6px 12px; border-radius: var(--r-pill);
  white-space: nowrap;
}
.cd-mini-btn.primary { background: var(--text); color: var(--bg-0); }
.cd-mini-btn.ghost {
  background: var(--surface); color: var(--text);
  border: 1px solid var(--border);
}

.cd-quote {
  font-family: "Instrument Serif", serif;
  font-size: 18px; line-height: 1.3;
  color: var(--text);
  margin-bottom: 14px;
}
.cd-quote-meta {
  display: flex; align-items: center; gap: 10px;
  padding-top: 12px; border-top: 1px solid var(--border);
}
.cd-avatar {
  width: 28px; height: 28px; border-radius: 50%;
  background: var(--grad-iri);
  flex-shrink: 0;
}
.cd-quote-name { font-size: 11px; font-weight: 600; }
.cd-quote-role { font-size: 10px; color: var(--text-mute); }

.cd-price-row { display: flex; align-items: baseline; gap: 4px; margin-bottom: 12px; }
.cd-price-num {
  font-size: 32px; font-weight: 600; letter-spacing: -0.03em;
  background: var(--grad-iri);
  -webkit-background-clip: text; background-clip: text;
  -webkit-text-fill-color: transparent;
}
.cd-price-per { color: var(--text-mute); font-size: 12px; }
.cd-price-list {
  list-style: none; padding: 0; margin: 0 0 14px 0;
  font-size: 11px; color: var(--text-dim);
  display: grid; gap: 6px;
}
.cd-price-list li::before {
  content: "+ ";
  color: var(--violet);
  font-weight: 600;
}
.cd-price-cta { display: block; text-align: center; padding: 8px 14px; }

/* PHONE */
.cd-phone {
  --cd-phone-y: 0px;
  --cd-phone-rot: 5deg;
  position: absolute;
  top: 50%; right: 6%;
  transform: translateY(-50%) translateY(var(--cd-phone-y)) rotate(var(--cd-phone-rot));
  transform-origin: 50% 50%;
  width: clamp(260px, 32%, 360px);
  aspect-ratio: 9 / 18.5;
  z-index: 5;
  will-change: transform;
}
.cd-phone-frame {
  position: relative;
  width: 100%; height: 100%;
  border-radius: 42px;
  background: linear-gradient(160deg, #1c1c34, #0a0a14);
  padding: 10px;
  box-shadow:
    0 40px 100px -20px rgba(124,92,255,0.5),
    0 20px 60px -10px rgba(0,0,0,0.7),
    0 0 0 1px rgba(255,255,255,0.06) inset,
    0 0 0 2px rgba(255,255,255,0.04);
}
.cd-phone-frame::before {
  content: "";
  position: absolute; inset: -1px;
  border-radius: 43px;
  padding: 1px;
  background: var(--grad-iri-soft);
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
          mask-composite: exclude;
  opacity: 0.5;
  pointer-events: none;
}
.cd-phone-notch {
  position: absolute;
  top: 14px; left: 50%;
  transform: translateX(-50%);
  width: 80px; height: 18px;
  border-radius: 12px;
  background: #05050a;
  z-index: 3;
}
.cd-phone-screen {
  position: relative;
  width: 100%; height: 100%;
  border-radius: 32px;
  overflow: hidden;
  background: var(--bg-0);
}
.cd-phone-inner {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 36px 14px 24px;
  will-change: transform;
}
.cd-p-section {
  background: linear-gradient(180deg, rgba(18,18,42,0.6), rgba(12,12,24,0.6));
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 14px;
}
.cd-p-nav {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 14px;
}
.cd-p-logo {
  width: 22px; height: 22px; border-radius: 6px;
  background: var(--grad-iri);
}
.cd-p-links { display: flex; gap: 6px; }
.cd-p-links span {
  width: 22px; height: 4px; border-radius: 2px;
  background: var(--surface-2);
  display: inline-block;
}
.cd-p-tag {
  font-size: 9px; font-weight: 600; letter-spacing: 0.1em;
  color: var(--violet); text-transform: uppercase;
  margin-bottom: 8px;
}
.cd-p-h1 {
  font-family: "Geist", sans-serif;
  font-size: 18px; font-weight: 600; line-height: 1.1;
  letter-spacing: -0.02em;
  margin-bottom: 6px;
}
.cd-p-h2 {
  font-family: "Geist", sans-serif;
  font-size: 14px; font-weight: 600; line-height: 1.2;
  letter-spacing: -0.02em;
  margin-bottom: 8px;
}
.cd-p-sub {
  font-size: 10px; color: var(--text-dim); line-height: 1.45;
  margin-bottom: 12px;
}
.cd-p-row { display: flex; gap: 6px; }
.cd-p-btn {
  font-size: 9px; font-weight: 600;
  padding: 6px 12px; border-radius: var(--r-pill);
}
.cd-p-btn.primary { background: var(--text); color: var(--bg-0); }
.cd-p-btn.ghost {
  background: var(--surface); color: var(--text);
  border: 1px solid var(--border);
}
.cd-p-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.cd-p-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 10px;
}
.cd-p-card-icon {
  width: 18px; height: 18px; border-radius: 5px;
  background: var(--grad-iri);
  margin-bottom: 8px;
}
.cd-p-card-icon.alt {
  background: linear-gradient(135deg, #22d3ee, #5eead4);
}
.cd-p-card-title { font-size: 10px; font-weight: 600; margin-bottom: 4px; }
.cd-p-card-body { font-size: 9px; color: var(--text-dim); line-height: 1.4; }
.cd-p-price-card {
  text-align: center; padding: 14px 10px;
  border: 1px solid var(--border);
  border-radius: 12px;
  background: var(--surface);
}
.cd-p-price-name { font-size: 10px; color: var(--text-dim); margin-bottom: 4px; }
.cd-p-price-row { display: flex; align-items: baseline; gap: 2px; justify-content: center; margin-bottom: 8px; }
.cd-p-price-num {
  font-size: 26px; font-weight: 600; letter-spacing: -0.03em;
  background: var(--grad-iri);
  -webkit-background-clip: text; background-clip: text;
  -webkit-text-fill-color: transparent;
}
.cd-p-price-per { font-size: 10px; color: var(--text-mute); }
.cd-p-price-cta {
  font-size: 9px; font-weight: 600;
  padding: 6px 12px; border-radius: var(--r-pill);
  background: var(--text); color: var(--bg-0);
  display: inline-block;
}

.cd-phone-glow {
  position: absolute;
  bottom: -40px; left: 50%; transform: translateX(-50%);
  width: 80%; height: 60px;
  background: radial-gradient(ellipse, rgba(124,92,255,0.5), transparent 70%);
  filter: blur(20px);
  z-index: -1;
}

/* STATS */
.cd-stats {
  display: flex; flex-wrap: wrap;
  align-items: baseline; justify-content: center;
  gap: 14px 18px;
  padding: 22px;
  border: 1px solid var(--border);
  border-radius: var(--r-lg);
  background: var(--surface);
  margin-bottom: 36px;
}
.cd-stat { display: inline-flex; align-items: baseline; gap: 8px; }
.cd-stat-num {
  font-family: "Geist", sans-serif;
  font-size: clamp(28px, 4vw, 44px);
  font-weight: 600; letter-spacing: -0.03em;
  background: var(--grad-iri);
  -webkit-background-clip: text; background-clip: text;
  -webkit-text-fill-color: transparent;
}
.cd-stat-label { color: var(--text-dim); font-size: 14px; }
.cd-stat-sep { color: var(--text-mute); font-size: 18px; }
.cd-stat-bundled .cd-stat-label { color: var(--text); font-weight: 500; }

/* CTA */
.cd-value {
  margin: 36px auto 24px;
  max-width: 760px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px 32px;
}
@media (max-width: 720px) { .cd-value { grid-template-columns: 1fr; gap: 10px; } }
.cd-value-item {
  display: flex; align-items: flex-start; gap: 10px;
  font-size: 14px; line-height: 1.55;
  color: var(--text-dim);
}
.cd-value-item strong { color: var(--text); font-weight: 600; }
.cd-value-check {
  flex: 0 0 22px;
  width: 22px; height: 22px;
  border-radius: 50%;
  background: var(--grad-iri);
  color: white;
  display: grid; place-items: center;
  font-size: 11px; font-weight: 700;
  margin-top: 1px;
  box-shadow: 0 4px 12px -2px rgba(124,92,255,0.5);
}
.cd-cta-foot {
  margin-top: 14px;
  text-align: center;
  font-size: 12px;
  color: var(--text-mute);
  letter-spacing: 0.02em;
}
.cd-cta-row {
  display: flex; flex-wrap: wrap; gap: 12px;
  justify-content: center;
}
.cd-btn-primary {
  display: inline-flex; align-items: center; gap: 10px;
  padding: 14px 26px;
  background: var(--grad-iri);
  color: white;
  font-weight: 600; font-size: 15px;
  text-decoration: none;
  border-radius: var(--r-pill);
  box-shadow: var(--shadow-glow);
  transition: transform .2s, box-shadow .2s;
}
.cd-btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 100px -20px rgba(217,70,239,0.6), 0 0 60px -20px rgba(124,92,255,0.7);
}
.cd-btn-ghost {
  display: inline-flex; align-items: center;
  padding: 14px 22px;
  background: var(--surface);
  color: var(--text);
  border: 1px solid var(--border);
  font-weight: 500; font-size: 15px;
  text-decoration: none;
  border-radius: var(--r-pill);
  transition: background .2s, border-color .2s;
}
.cd-btn-ghost:hover {
  background: var(--surface-2);
  border-color: var(--border-strong);
}

/* MOBILE STACKING */
@media (max-width: 980px) {
  .cd-stage {
    height: auto;
    display: flex;
    flex-direction: column;
    gap: 18px;
    perspective: none;
  }
  .cd-screen-card,
  .cd-phone {
    position: relative;
    top: auto; left: auto; right: auto; bottom: auto;
    transform: translateY(var(--cd-card-y, 0px)) rotate(var(--cd-card-rot, 0deg));
    width: min(100%, 360px);
    margin: 0 auto;
  }
  .cd-card-hero  { --cd-card-rot: -2deg; }
  .cd-card-testi { --cd-card-rot:  3deg; }
  .cd-card-price { --cd-card-rot: -2deg; }
  .cd-phone {
    transform: translateY(var(--cd-phone-y)) rotate(var(--cd-phone-rot));
    width: min(72%, 280px);
  }
}

@media (max-width: 760px) {
  .cd-marquee-item { font-size: 18px; }
  .cd-stat-sep { display: none; }
}

@media (prefers-reduced-motion: reduce) {
  .cd-marquee-track { animation: none; }
  .cd-marquee,
  .cd-phone,
  .cd-screen-card,
  .cd-phone-inner {
    transform: none !important;
  }
  .cd-phone {
    transform: translateY(-50%) !important;
  }
}
`;
