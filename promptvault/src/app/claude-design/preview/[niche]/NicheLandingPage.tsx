'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { THEMES, type NicheCopy, type NicheKey } from '../_data';

// ---------------------------------------------------------------------------
// Full-page niche preview. Heavy on parallax, scroll reveals, animated counters
// and theme-driven typography. Each niche gets its own palette + display font.
// ---------------------------------------------------------------------------

interface Props {
  niche: NicheCopy;
  themeKey: NicheKey;
}

const FONTS_HREF =
  'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Fraunces:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Geist:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&family=Instrument+Serif:ital@0;1&display=swap';

export default function NicheLandingPage({ niche, themeKey }: Props) {
  const theme = THEMES[themeKey];

  const heroBgRef = useRef<HTMLDivElement | null>(null);
  const heroOrbARef = useRef<HTMLDivElement | null>(null);
  const heroOrbBRef = useRef<HTMLDivElement | null>(null);
  const heroOrbCRef = useRef<HTMLDivElement | null>(null);
  const featuresStripeRef = useRef<HTMLDivElement | null>(null);
  const ctaGlowRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);
  const heroGlowRef = useRef<HTMLDivElement | null>(null);

  // Reveal-on-scroll
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>('.np-reveal');
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).classList.add('in');
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.18 },
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  // Animated counters
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>('[data-np-count]');
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          obs.unobserve(el);
          const raw = el.dataset.npCount || '0';
          const target = parseFloat(raw);
          if (Number.isNaN(target)) return;
          const suffix = el.dataset.npSuffix || '';
          const prefix = el.dataset.npPrefix || '';
          const decimals = parseInt(el.dataset.npDecimals || '0', 10);
          const start = performance.now();
          const dur = 1600;
          const ease = (t: number) => 1 - Math.pow(1 - t, 3);
          const tick = (now: number) => {
            const t = Math.min(1, (now - start) / dur);
            const v = target * ease(t);
            el.textContent = prefix + v.toFixed(decimals) + suffix;
            if (t < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        });
      },
      { threshold: 0.4 },
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  // Mouse-tracked hero parallax — written directly to DOM so it doesn't
  // re-render the whole landing page every animation frame.
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    let raf = 0;
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;
    const onMove = (e: MouseEvent) => {
      tx = (e.clientX / window.innerWidth - 0.5) * 30;
      ty = (e.clientY / window.innerHeight - 0.5) * 30;
    };
    const tick = () => {
      cx += (tx - cx) * 0.06;
      cy += (ty - cy) * 0.06;
      if (heroGlowRef.current) {
        heroGlowRef.current.style.transform = `translate3d(${cx * 1.2}px, ${cy * 1.2}px, 0)`;
      }
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener('mousemove', onMove);
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Scroll parallax + progress bar
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;
    const update = () => {
      raf = 0;
      const sy = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.max(0, Math.min(1, sy / max)) : 0;
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${p})`;
      if (reduce) return;
      if (heroBgRef.current) {
        heroBgRef.current.style.transform = `translate3d(0, ${sy * 0.18}px, 0)`;
      }
      if (heroOrbARef.current) heroOrbARef.current.style.transform = `translate3d(0, ${sy * 0.32}px, 0)`;
      if (heroOrbBRef.current) heroOrbBRef.current.style.transform = `translate3d(0, ${sy * 0.45}px, 0)`;
      if (heroOrbCRef.current) heroOrbCRef.current.style.transform = `translate3d(0, ${sy * 0.6}px, 0)`;
      if (featuresStripeRef.current) {
        featuresStripeRef.current.style.transform = `translate3d(${-sy * 0.08}px, 0, 0)`;
      }
      if (ctaGlowRef.current) {
        ctaGlowRef.current.style.transform = `translate3d(0, ${-sy * 0.04}px, 0)`;
      }
    };
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const isDarkTheme = themeKey === 'saas' || themeKey === 'restaurant';

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link rel="stylesheet" href={FONTS_HREF} />
      <style
        dangerouslySetInnerHTML={{
          __html: buildStyles(theme, isDarkTheme),
        }}
      />

      {/* Scroll progress */}
      <div className="np-progress" aria-hidden>
        <div ref={progressRef} className="np-progress-fill" />
      </div>

      {/* Floating preview banner */}
      <div className="np-banner" role="note">
        <div className="np-banner-inner">
          <span className="np-banner-pill">CLAUDE DESIGN PREVIEW</span>
          <span className="np-banner-text">
            This entire page was generated by Claude using the{' '}
            <strong>{niche.label}</strong> pack from the 500-prompt landing kit.
          </span>
          <Link href="/claude-design" className="np-banner-cta">
            ← Back to Claude Design
          </Link>
        </div>
      </div>

      <div className="np-root">
        {/* HEADER */}
        <header className="np-header">
          <div className="np-wrap np-header-inner">
            <a className="np-brand" href="#">
              <span className="np-brand-mark" aria-hidden>
                {niche.emoji}
              </span>
              <span className="np-brand-name">{niche.brand}</span>
            </a>
            <nav className="np-nav" aria-label="Primary">
              <a href="#features">Features</a>
              <a href="#how">How it works</a>
              <a href="#pricing">Pricing</a>
              <a href="#faq">FAQ</a>
            </nav>
            <a className="np-header-cta" href="#cta">
              {niche.cta.button}
            </a>
          </div>
        </header>

        {/* HERO */}
        <section className="np-hero">
          <div ref={heroBgRef} className="np-hero-bg" aria-hidden>
            <HeroOrnament theme={theme} />
            <div ref={heroOrbARef} className="np-orb np-orb-a" />
            <div ref={heroOrbBRef} className="np-orb np-orb-b" />
            <div ref={heroOrbCRef} className="np-orb np-orb-c" />
          </div>

          <div ref={heroGlowRef} className="np-hero-glow" aria-hidden />

          <div className="np-wrap np-hero-inner">
            <div className="np-hero-pill np-reveal">
              <span className="np-hero-pill-dot" />
              {niche.full.heroBadge}
            </div>
            <p className="np-hero-eyebrow np-reveal">{niche.hero.eyebrow}</p>
            <h1 className="np-hero-h1 np-reveal">
              {splitHeadline(niche.hero.h1)}
            </h1>
            <p className="np-hero-sub np-reveal">{niche.hero.sub}</p>
            <div className="np-hero-actions np-reveal">
              <a className="np-btn np-btn-primary" href="#cta">
                {niche.hero.primaryCta}
                <span aria-hidden>→</span>
              </a>
              <a className="np-btn np-btn-ghost" href="#how">
                {niche.hero.secondaryCta}
              </a>
            </div>
            <p className="np-hero-trust np-reveal">{niche.hero.trust}</p>

            {/* Stat-line */}
            <div className="np-statline np-reveal">
              {niche.full.statline.map((s) => (
                <div key={s.label} className="np-statline-item">
                  <div className="np-statline-num">{s.num}</div>
                  <div className="np-statline-lbl">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* MARQUEE */}
        <div className="np-marquee" aria-hidden>
          <div className="np-marquee-track">
            {[0, 1].map((dup) => (
              <div className="np-marquee-chunk" key={dup}>
                {niche.full.marquee.map((m, i) => (
                  <span key={`${dup}-${i}`} className="np-marquee-item">
                    <span>{m}</span>
                    <span className="np-marquee-dot" />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* LOGOS */}
        <section className="np-logos np-reveal">
          <div className="np-wrap">
            <p className="np-logos-lbl">As seen / aligned with</p>
            <div className="np-logos-row">
              {niche.full.logos.map((l) => (
                <span key={l}>{l}</span>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section id="features" className="np-section">
          <div ref={featuresStripeRef} className="np-section-stripe" aria-hidden>
            FEATURES · FEATURES · FEATURES · FEATURES · FEATURES · FEATURES
          </div>
          <div className="np-wrap">
            <div className="np-section-head np-reveal">
              <span className="np-section-tag">FEATURES</span>
              <h2 className="np-section-title">{niche.full.featureHeadline}</h2>
              <p className="np-section-desc">{niche.full.featureSub}</p>
            </div>
            <div className="np-features">
              {niche.features.map((f, i) => (
                <FeatureCard key={f.title} feature={f} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS — sticky */}
        <section id="how" className="np-section np-section-tinted">
          <div className="np-wrap">
            <div className="np-section-head np-reveal">
              <span className="np-section-tag">HOW IT WORKS</span>
              <h2 className="np-section-title">Three steps. No surprises.</h2>
              <p className="np-section-desc">{niche.full.howSub}</p>
            </div>
            <div className="np-steps">
              {niche.howItWorks.map((s, i) => (
                <div key={s.step} className="np-step np-reveal">
                  <div className="np-step-num">{s.step}</div>
                  <div>
                    <div className="np-step-title">{s.title}</div>
                    <p className="np-step-body">{s.body}</p>
                  </div>
                  {i < niche.howItWorks.length - 1 && (
                    <div className="np-step-rule" aria-hidden />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="np-section">
          <div className="np-wrap">
            <div className="np-section-head np-reveal">
              <span className="np-section-tag">TESTIMONIALS</span>
              <h2 className="np-section-title">{niche.full.testimonialsHeadline}</h2>
            </div>
            <div className="np-testimonials">
              {niche.testimonials.map((t, i) => (
                <figure key={t.name} className={`np-quote np-reveal np-quote-${i}`}>
                  <div className="np-quote-mark" aria-hidden>
                    “
                  </div>
                  <blockquote>{t.quote}</blockquote>
                  <figcaption>
                    <span className="np-quote-avatar" aria-hidden />
                    <span>
                      <strong>{t.name}</strong>
                      <span className="np-quote-role">{t.role}</span>
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section id="pricing" className="np-section np-section-tinted">
          <div className="np-wrap">
            <div className="np-section-head np-reveal">
              <span className="np-section-tag">PRICING</span>
              <h2 className="np-section-title">{niche.full.pricingHeadline}</h2>
              <p className="np-section-desc">{niche.full.pricingSub}</p>
            </div>
            <div className="np-pricing">
              {niche.pricing.tiers.map((t) => (
                <div
                  key={t.name}
                  className={`np-tier np-reveal${t.highlight ? ' np-tier-featured' : ''}`}
                >
                  {t.highlight && <span className="np-tier-flag">MOST CHOSEN</span>}
                  <div className="np-tier-name">{t.name}</div>
                  <div className="np-tier-price">{t.price}</div>
                  <div className="np-tier-tagline">{t.tagline}</div>
                  <ul className="np-tier-bullets">
                    {t.bullets.map((b) => (
                      <li key={b}>
                        <span className="np-tick" aria-hidden>
                          ✓
                        </span>
                        {b}
                      </li>
                    ))}
                  </ul>
                  <a
                    className={`np-btn ${t.highlight ? 'np-btn-primary' : 'np-btn-ghost'}`}
                    href="#cta"
                  >
                    {t.highlight ? niche.cta.button : 'Choose plan'}
                    <span aria-hidden>→</span>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* BRAND VOICE */}
        <section className="np-section">
          <div className="np-wrap">
            <div className="np-section-head np-reveal">
              <span className="np-section-tag">VOICE</span>
              <h2 className="np-section-title">{niche.full.voiceHeadline}</h2>
            </div>
            <div className="np-voice np-reveal">
              <div className="np-voice-tags">
                {niche.brandVoice.adjectives.map((a) => (
                  <span key={a} className="np-voice-tag">
                    {a}
                  </span>
                ))}
              </div>
              <p className="np-voice-sample">{niche.brandVoice.sample}</p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="np-section np-section-tinted">
          <div className="np-wrap">
            <div className="np-section-head np-reveal">
              <span className="np-section-tag">FAQ</span>
              <h2 className="np-section-title">{niche.full.faqHeadline}</h2>
            </div>
            <div className="np-faq">
              {niche.faq.map((item, i) => (
                <FaqItem key={item.q} item={item} defaultOpen={i === 0} />
              ))}
            </div>
          </div>
        </section>

        {/* SEO mini */}
        <section className="np-section">
          <div className="np-wrap">
            <div className="np-section-head np-reveal">
              <span className="np-section-tag">SEO PREVIEW</span>
              <h2 className="np-section-title">How this page shows up in search.</h2>
            </div>
            <div className="np-seo np-reveal">
              <div className="np-seo-url">{niche.seo.url}</div>
              <div className="np-seo-title">{niche.seo.title}</div>
              <p className="np-seo-desc">{niche.seo.description}</p>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section id="cta" className="np-cta">
          <div ref={ctaGlowRef} className="np-cta-glow" aria-hidden />
          <div className="np-wrap">
            <div className="np-cta-card np-reveal">
              <h2 className="np-cta-h">{niche.cta.headline}</h2>
              <p className="np-cta-sub">{niche.full.finalCtaSub}</p>
              <div className="np-cta-actions">
                <a className="np-btn np-btn-primary np-btn-large" href="#">
                  {niche.cta.button}
                  <span aria-hidden>→</span>
                </a>
                <Link className="np-btn np-btn-ghost np-btn-large" href="/claude-design">
                  See more niches
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="np-footer">
          <div className="np-wrap">
            <div className="np-footer-grid">
              <div className="np-footer-brand">
                <div className="np-brand">
                  <span className="np-brand-mark" aria-hidden>
                    {niche.emoji}
                  </span>
                  <span className="np-brand-name">{niche.brand}</span>
                </div>
                <p className="np-footer-line">{niche.brandVoice.sample}</p>
              </div>
              {niche.footer.columns.map((col) => (
                <div key={col.heading} className="np-footer-col">
                  <h4>{col.heading}</h4>
                  {col.links.map((l) => (
                    <a key={l} href="#">
                      {l}
                    </a>
                  ))}
                </div>
              ))}
            </div>
            <div className="np-footer-base">
              <span>{niche.footer.tagline}</span>
              <span>
                Built with Claude · {' '}
                <Link href="/claude-design" className="np-footer-link">
                  Get the prompt pack →
                </Link>
              </span>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function splitHeadline(text: string) {
  const words = text.split(' ');
  // Highlight the trailing 1–3 words depending on length.
  const tailLen = words.length > 6 ? 3 : 2;
  const head = words.slice(0, words.length - tailLen).join(' ');
  const tail = words.slice(words.length - tailLen).join(' ');
  return (
    <>
      <span className="np-hero-head">{head}</span>
      <span className="np-hero-tail"> {tail}</span>
    </>
  );
}

function FeatureCard({
  feature,
  index,
}: {
  feature: { title: string; body: string; emoji: string };
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement | null>(null);

  // Lightweight hover-tilt — no extra deps.
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const r = card.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    card.style.setProperty('--np-mx', `${px * 100}%`);
    card.style.setProperty('--np-my', `${py * 100}%`);
    card.style.setProperty('--np-rx', `${(0.5 - py) * 6}deg`);
    card.style.setProperty('--np-ry', `${(px - 0.5) * 8}deg`);
  };
  const onLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.setProperty('--np-rx', '0deg');
    card.style.setProperty('--np-ry', '0deg');
  };

  return (
    <div
      ref={cardRef}
      className="np-feature np-reveal"
      style={{ animationDelay: `${index * 80}ms` } as React.CSSProperties}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <div className="np-feature-emoji" aria-hidden>
        {feature.emoji}
      </div>
      <div className="np-feature-num">0{index + 1}</div>
      <h3 className="np-feature-title">{feature.title}</h3>
      <p className="np-feature-body">{feature.body}</p>
    </div>
  );
}

function FaqItem({
  item,
  defaultOpen,
}: {
  item: { q: string; a: string };
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(!!defaultOpen);
  return (
    <div className={`np-faq-item${open ? ' np-faq-open' : ''}`}>
      <button
        type="button"
        className="np-faq-q"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span>{item.q}</span>
        <span className="np-faq-icon" aria-hidden>
          {open ? '−' : '+'}
        </span>
      </button>
      <div className="np-faq-a-wrap">
        <p className="np-faq-a">{item.a}</p>
      </div>
    </div>
  );
}

function HeroOrnament({
  theme,
}: {
  theme: (typeof THEMES)[NicheKey];
}) {
  if (theme.heroOrnament === 'grid') {
    return <div className="np-orn np-orn-grid" aria-hidden />;
  }
  if (theme.heroOrnament === 'paper') {
    return <div className="np-orn np-orn-paper" aria-hidden />;
  }
  if (theme.heroOrnament === 'film') {
    return <div className="np-orn np-orn-film" aria-hidden />;
  }
  if (theme.heroOrnament === 'leaf') {
    return <div className="np-orn np-orn-leaf" aria-hidden />;
  }
  return <div className="np-orn np-orn-orbs" aria-hidden />;
}

// ---------------------------------------------------------------------------
// Stylesheet — every selector is `np-` prefixed so it cannot collide with the
// site's main landing styles. Themed via CSS custom properties on .np-root.
// ---------------------------------------------------------------------------

function buildStyles(theme: (typeof THEMES)[NicheKey], dark: boolean) {
  return `
:root {
  --np-bg: ${theme.bg};
  --np-bg-soft: ${theme.bgSoft};
  --np-surface: ${theme.surface};
  --np-text: ${theme.text};
  --np-text-dim: ${theme.textDim};
  --np-text-mute: ${theme.textMute};
  --np-border: ${theme.border};
  --np-accent: ${theme.accent};
  --np-accent-2: ${theme.accent2};
  --np-accent-soft: ${theme.accentSoft};
  --np-display: ${theme.display};
  --np-body: ${theme.body};
  --np-grad: linear-gradient(135deg, ${theme.accent}, ${theme.accent2});
  --np-radius: 16px;
  --np-radius-lg: 28px;
}

html, body {
  background: ${theme.bg} !important;
  color: var(--np-text);
  font-family: var(--np-body);
  margin: 0;
  -webkit-font-smoothing: antialiased;
  text-rendering: geometricPrecision;
  scroll-behavior: smooth;
  max-width: none !important;
}

.np-root {
  position: relative;
  background: var(--np-bg);
  color: var(--np-text);
  overflow-x: clip;
  line-height: 1.5;
  padding-top: 56px;
}

.np-wrap {
  width: 100%;
  max-width: 1180px;
  margin: 0 auto;
  padding: 0 clamp(20px, 4vw, 40px);
}

::selection { background: var(--np-accent); color: ${dark ? theme.bg : '#fff'}; }

a { color: inherit; }

.np-progress {
  position: fixed; top: 0; left: 0; right: 0;
  height: 3px; z-index: 200;
  background: rgba(0,0,0,0);
  pointer-events: none;
}
.np-progress-fill {
  width: 100%; height: 100%;
  background: var(--np-grad);
  transform-origin: 0 50%;
  transform: scaleX(0);
  transition: transform .15s linear;
  box-shadow: 0 0 12px var(--np-accent);
}

.np-banner {
  position: fixed;
  top: 12px; left: 12px; right: 12px;
  z-index: 100;
  pointer-events: none;
}
.np-banner-inner {
  pointer-events: auto;
  max-width: 980px; margin: 0 auto;
  display: flex; flex-wrap: wrap; align-items: center; gap: 14px;
  padding: 8px 14px;
  background: ${dark ? 'rgba(20,20,40,0.85)' : 'rgba(255,255,255,0.92)'};
  backdrop-filter: blur(14px) saturate(180%);
  -webkit-backdrop-filter: blur(14px) saturate(180%);
  border: 1px solid var(--np-border);
  border-radius: 999px;
  font-size: 12px;
  color: ${dark ? '#cdd0e6' : '#3b3b3b'};
  box-shadow: 0 8px 30px -10px rgba(0,0,0,0.25);
}
.np-banner-pill {
  font-size: 10px; font-weight: 700; letter-spacing: 0.12em;
  padding: 4px 10px; border-radius: 999px;
  background: var(--np-grad); color: white;
}
.np-banner-text { flex: 1 1 auto; min-width: 200px; }
.np-banner-text strong { color: ${dark ? '#fff' : '#111'}; }
.np-banner-cta {
  font-weight: 600; text-decoration: none;
  color: var(--np-accent);
  white-space: nowrap;
}
@media (max-width: 640px) {
  .np-banner-text { font-size: 11px; }
  .np-banner-pill { font-size: 9px; }
}

/* HEADER */
.np-header {
  position: sticky; top: 60px; z-index: 30;
  margin-top: 4px;
}
.np-header-inner {
  display: flex; align-items: center; justify-content: space-between;
  padding: 10px 18px;
  background: ${dark ? 'rgba(12,12,28,0.6)' : 'rgba(255,255,255,0.65)'};
  backdrop-filter: blur(14px) saturate(160%);
  border: 1px solid var(--np-border);
  border-radius: 999px;
  margin: 0 auto;
}
.np-brand {
  display: inline-flex; align-items: center; gap: 10px;
  text-decoration: none; color: var(--np-text);
  font-family: var(--np-display);
  font-weight: 600;
  font-size: 18px;
  letter-spacing: -0.01em;
}
.np-brand-mark {
  width: 30px; height: 30px;
  display: grid; place-items: center;
  background: var(--np-grad);
  border-radius: 8px;
  color: white;
  font-size: 16px;
  box-shadow: 0 6px 18px -6px var(--np-accent);
}
.np-nav { display: flex; gap: 6px; }
.np-nav a {
  padding: 8px 14px;
  font-size: 13px; font-weight: 500;
  color: var(--np-text-dim);
  text-decoration: none;
  border-radius: 999px;
  transition: color .2s, background .2s;
}
.np-nav a:hover { color: var(--np-text); background: var(--np-accent-soft); }
.np-header-cta {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 9px 18px;
  background: var(--np-text); color: var(--np-bg);
  font-size: 13px; font-weight: 600;
  text-decoration: none;
  border-radius: 999px;
  transition: transform .2s, box-shadow .2s;
}
.np-header-cta:hover { transform: translateY(-1px); box-shadow: 0 10px 24px -10px var(--np-accent); }
@media (max-width: 820px) {
  .np-nav { display: none; }
}

/* HERO */
.np-hero {
  position: relative;
  padding: clamp(56px, 9vw, 120px) 0 clamp(40px, 6vw, 90px);
  overflow: hidden;
  isolation: isolate;
}
.np-hero-bg {
  position: absolute; inset: -10% -10% -20% -10%;
  z-index: -2;
  pointer-events: none;
  will-change: transform;
}
.np-hero-glow {
  position: absolute; inset: 0; z-index: -1;
  pointer-events: none;
  background: radial-gradient(ellipse 60% 40% at 50% 30%, var(--np-accent-soft), transparent 70%);
}
.np-orb {
  position: absolute; border-radius: 50%;
  filter: blur(60px); opacity: 0.5;
  will-change: transform;
}
.np-orb-a { top: -8%; left: -10%; width: 540px; height: 540px;
  background: radial-gradient(circle, var(--np-accent), transparent 70%); }
.np-orb-b { top: 18%; right: -12%; width: 600px; height: 600px;
  background: radial-gradient(circle, var(--np-accent-2), transparent 70%); opacity: 0.4; }
.np-orb-c { bottom: -10%; left: 35%; width: 520px; height: 520px;
  background: radial-gradient(circle, var(--np-accent), transparent 70%); opacity: 0.3; }

.np-orn { position: absolute; inset: 0; pointer-events: none; }
.np-orn-grid {
  background-image:
    linear-gradient(to right, ${dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'} 1px, transparent 1px),
    linear-gradient(to bottom, ${dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'} 1px, transparent 1px);
  background-size: 64px 64px;
  -webkit-mask-image: radial-gradient(ellipse 70% 55% at 50% 35%, black 30%, transparent 80%);
          mask-image: radial-gradient(ellipse 70% 55% at 50% 35%, black 30%, transparent 80%);
}
.np-orn-paper {
  background-image:
    radial-gradient(circle at 20% 30%, ${dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'}, transparent 40%),
    radial-gradient(circle at 80% 70%, ${dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'}, transparent 40%);
}
.np-orn-film {
  background-image:
    repeating-linear-gradient(0deg, transparent, transparent 36px, rgba(212,166,74,0.05) 36px, rgba(212,166,74,0.05) 38px),
    radial-gradient(circle at 50% 30%, rgba(212,166,74,0.10), transparent 60%);
}
.np-orn-leaf {
  background-image:
    radial-gradient(ellipse 40% 30% at 30% 30%, rgba(111,138,85,0.18), transparent 60%),
    radial-gradient(ellipse 30% 25% at 70% 70%, rgba(196,119,78,0.14), transparent 60%);
}

.np-hero-inner { position: relative; text-align: center; }
.np-hero-pill {
  display: inline-flex; align-items: center; gap: 10px;
  padding: 7px 14px;
  background: ${dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'};
  border: 1px solid var(--np-border);
  color: var(--np-text-dim);
  font-size: 12px; font-weight: 500;
  border-radius: 999px;
  margin-bottom: 24px;
  transition: transform .25s ease;
}
.np-hero-pill-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: var(--np-accent);
  box-shadow: 0 0 10px var(--np-accent);
  animation: npPulse 1.6s ease-in-out infinite;
}
@keyframes npPulse { 50% { opacity: 0.5; transform: scale(1.4); } }

.np-hero-eyebrow {
  font-family: var(--np-body);
  font-size: 12px; font-weight: 600;
  letter-spacing: 0.18em; text-transform: uppercase;
  color: var(--np-accent);
  margin: 0 0 12px;
}

.np-hero-h1 {
  font-family: var(--np-display);
  font-weight: 600;
  font-size: clamp(40px, 6.5vw, 92px);
  line-height: 1.04;
  letter-spacing: -0.035em;
  margin: 0 auto;
  max-width: 16ch;
}
.np-hero-h1 .np-hero-tail {
  background: var(--np-grad);
  -webkit-background-clip: text;
          background-clip: text;
  -webkit-text-fill-color: transparent;
  font-style: italic;
  font-family: ${theme.flavor === 'tech' ? '"Instrument Serif", serif' : '"Cormorant Garamond", serif'};
  font-weight: 400;
}

.np-hero-sub {
  margin: 22px auto 0;
  max-width: 600px;
  font-size: clamp(15px, 1.5vw, 18px);
  line-height: 1.55;
  color: var(--np-text-dim);
}

.np-hero-actions {
  margin-top: 30px;
  display: flex; gap: 12px; flex-wrap: wrap;
  justify-content: center;
}

.np-btn {
  display: inline-flex; align-items: center; gap: 10px;
  padding: 13px 22px;
  font-size: 15px; font-weight: 600;
  text-decoration: none; cursor: pointer;
  border: 0;
  border-radius: 999px;
  transition: transform .2s, box-shadow .2s, background .2s, color .2s;
  font-family: var(--np-body);
}
.np-btn-primary {
  background: var(--np-grad);
  color: ${dark ? '#fff' : '#fff'};
  box-shadow: 0 12px 28px -8px var(--np-accent);
}
.np-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 18px 36px -8px var(--np-accent); }
.np-btn-ghost {
  background: ${dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'};
  color: var(--np-text);
  border: 1px solid var(--np-border);
}
.np-btn-ghost:hover { background: ${dark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.06)'}; transform: translateY(-2px); }
.np-btn-large { padding: 16px 28px; font-size: 16px; }

.np-hero-trust {
  margin: 24px auto 0;
  font-size: 13px;
  color: var(--np-text-mute);
}

.np-statline {
  margin: 56px auto 0;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0;
  padding: 22px;
  max-width: 880px;
  background: var(--np-surface);
  border: 1px solid var(--np-border);
  border-radius: var(--np-radius-lg);
  backdrop-filter: blur(14px);
  text-align: left;
}
.np-statline-item { padding: 0 18px; }
.np-statline-item + .np-statline-item { border-left: 1px solid var(--np-border); }
.np-statline-num {
  font-family: var(--np-display);
  font-size: clamp(22px, 2.6vw, 32px);
  line-height: 1;
  letter-spacing: -0.03em;
  font-weight: 600;
  background: var(--np-grad);
  -webkit-background-clip: text;
          background-clip: text;
  -webkit-text-fill-color: transparent;
}
.np-statline-lbl {
  margin-top: 8px;
  font-size: 12px;
  color: var(--np-text-mute);
  line-height: 1.4;
}
@media (max-width: 760px) {
  .np-statline { grid-template-columns: repeat(2, 1fr); gap: 16px; }
  .np-statline-item { padding: 0; }
  .np-statline-item + .np-statline-item { border-left: 0; }
}

/* MARQUEE */
.np-marquee {
  margin: clamp(56px, 8vw, 96px) 0 0;
  border-top: 1px solid var(--np-border);
  border-bottom: 1px solid var(--np-border);
  background: var(--np-bg-soft);
  padding: 18px 0;
  -webkit-mask-image: linear-gradient(90deg, transparent, black 12%, black 88%, transparent);
          mask-image: linear-gradient(90deg, transparent, black 12%, black 88%, transparent);
}
.np-marquee-track {
  display: flex; width: max-content;
  animation: npMarquee 38s linear infinite;
}
.np-marquee-chunk { display: flex; flex-shrink: 0; }
.np-marquee-item {
  display: inline-flex; align-items: center; gap: 22px;
  padding: 0 22px;
  font-family: var(--np-display);
  font-size: clamp(20px, 2.2vw, 30px);
  letter-spacing: -0.01em;
  color: var(--np-text-dim);
  white-space: nowrap;
}
.np-marquee-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: var(--np-accent);
  box-shadow: 0 0 10px var(--np-accent);
  flex-shrink: 0;
}
@keyframes npMarquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }

/* LOGOS */
.np-logos { padding: 36px 0 12px; }
.np-logos-lbl {
  text-align: center;
  font-size: 12px; color: var(--np-text-mute);
  letter-spacing: 0.14em; text-transform: uppercase;
  margin-bottom: 18px;
}
.np-logos-row {
  display: flex; flex-wrap: wrap; justify-content: center;
  gap: clamp(20px, 4vw, 48px);
  font-family: var(--np-display);
  font-size: clamp(14px, 1.6vw, 18px);
  font-weight: 500;
  color: var(--np-text-dim);
  opacity: 0.8;
}

/* SECTIONS */
.np-section {
  position: relative;
  padding: clamp(72px, 10vw, 130px) 0;
  overflow: hidden;
}
.np-section-tinted { background: var(--np-bg-soft); }
.np-section-stripe {
  position: absolute; top: 30px; left: 0;
  font-family: var(--np-display);
  font-size: clamp(80px, 14vw, 200px);
  font-weight: 600;
  letter-spacing: -0.05em;
  white-space: nowrap;
  color: ${dark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.04)'};
  pointer-events: none;
  user-select: none;
  z-index: 0;
}
.np-section > .np-wrap { position: relative; z-index: 1; }

.np-section-head {
  text-align: center;
  max-width: 740px;
  margin: 0 auto clamp(36px, 5vw, 64px);
}
.np-section-tag {
  display: inline-block;
  font-size: 11px; font-weight: 600;
  letter-spacing: 0.18em; text-transform: uppercase;
  color: var(--np-accent);
  margin-bottom: 10px;
}
.np-section-title {
  font-family: var(--np-display);
  font-size: clamp(30px, 4.6vw, 58px);
  letter-spacing: -0.03em;
  line-height: 1.05;
  font-weight: 600;
  margin: 0 0 14px;
}
.np-section-desc {
  font-size: clamp(14px, 1.4vw, 17px);
  line-height: 1.55;
  color: var(--np-text-dim);
  margin: 0 auto;
  max-width: 540px;
}

/* FEATURES */
.np-features {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
}
@media (max-width: 980px) { .np-features { grid-template-columns: 1fr; } }

.np-feature {
  --np-mx: 50%;
  --np-my: 0%;
  --np-rx: 0deg;
  --np-ry: 0deg;
  position: relative;
  padding: 30px 26px 36px;
  background: var(--np-surface);
  border: 1px solid var(--np-border);
  border-radius: var(--np-radius-lg);
  transition: transform .35s ease, border-color .25s, box-shadow .25s;
  transform: perspective(1000px) rotateX(var(--np-rx)) rotateY(var(--np-ry));
  overflow: hidden;
  isolation: isolate;
}
.np-feature::before {
  content: ""; position: absolute; inset: 0;
  z-index: -1;
  background: radial-gradient(circle at var(--np-mx) var(--np-my), var(--np-accent-soft), transparent 50%);
  opacity: 0; transition: opacity .25s ease;
}
.np-feature:hover { border-color: var(--np-accent); box-shadow: 0 30px 60px -30px var(--np-accent); }
.np-feature:hover::before { opacity: 1; }
.np-feature-emoji {
  width: 48px; height: 48px; border-radius: 14px;
  background: var(--np-grad);
  display: grid; place-items: center;
  font-size: 24px;
  margin-bottom: 22px;
  box-shadow: 0 12px 28px -10px var(--np-accent);
}
.np-feature-num {
  position: absolute; top: 22px; right: 24px;
  font-family: ${theme.flavor === 'tech' ? '"Geist Mono", monospace' : 'var(--np-display)'};
  font-size: 12px;
  letter-spacing: 0.14em;
  color: var(--np-text-mute);
}
.np-feature-title {
  font-family: var(--np-display);
  font-size: clamp(18px, 2.2vw, 24px);
  font-weight: 600;
  letter-spacing: -0.02em;
  margin: 0 0 10px;
}
.np-feature-body {
  font-size: 14.5px;
  line-height: 1.55;
  color: var(--np-text-dim);
  margin: 0;
}

/* STEPS */
.np-steps {
  display: grid; gap: 16px;
  max-width: 880px; margin: 0 auto;
}
.np-step {
  display: grid;
  grid-template-columns: 70px 1fr;
  gap: 22px; align-items: start;
  padding: 26px 24px;
  background: var(--np-surface);
  border: 1px solid var(--np-border);
  border-radius: var(--np-radius-lg);
  position: relative;
}
.np-step-num {
  font-family: var(--np-display);
  font-size: clamp(36px, 5vw, 56px);
  line-height: 1;
  font-weight: 600;
  letter-spacing: -0.04em;
  background: var(--np-grad);
  -webkit-background-clip: text;
          background-clip: text;
  -webkit-text-fill-color: transparent;
}
.np-step-title {
  font-family: var(--np-display);
  font-size: clamp(18px, 2vw, 22px);
  font-weight: 600;
  letter-spacing: -0.02em;
  margin-bottom: 8px;
}
.np-step-body {
  font-size: 14.5px;
  line-height: 1.55;
  color: var(--np-text-dim);
  margin: 0;
}
.np-step-rule {
  position: absolute;
  left: 56px; bottom: -16px;
  width: 1px; height: 32px;
  background: var(--np-border);
}
.np-step-rule::after {
  content: ""; position: absolute; left: -3px; bottom: 0;
  width: 7px; height: 7px; border-radius: 50%;
  background: var(--np-accent);
}

/* TESTIMONIALS */
.np-testimonials {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
}
@media (max-width: 880px) { .np-testimonials { grid-template-columns: 1fr; } }
.np-quote {
  position: relative;
  margin: 0;
  padding: 30px 26px 26px;
  background: var(--np-surface);
  border: 1px solid var(--np-border);
  border-radius: var(--np-radius-lg);
}
.np-quote-mark {
  position: absolute;
  top: -20px; left: 18px;
  font-family: var(--np-display);
  font-style: italic;
  font-size: 80px;
  line-height: 1;
  color: var(--np-accent);
  opacity: 0.3;
}
.np-quote blockquote {
  font-family: var(--np-display);
  font-size: clamp(17px, 2vw, 22px);
  line-height: 1.35;
  letter-spacing: -0.01em;
  color: var(--np-text);
  margin: 0 0 22px;
}
.np-quote figcaption {
  display: flex; align-items: center; gap: 12px;
  border-top: 1px solid var(--np-border);
  padding-top: 16px;
  font-size: 13px;
}
.np-quote-avatar {
  width: 32px; height: 32px; border-radius: 50%;
  background: var(--np-grad);
}
.np-quote-role {
  display: block;
  color: var(--np-text-mute);
  font-size: 12px;
}
.np-quote-1 { transform: translateY(0); }
@media (min-width: 881px) {
  .np-quote-0 { transform: translateY(20px); }
  .np-quote-2 { transform: translateY(40px); }
}

/* PRICING */
.np-pricing {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
  max-width: 860px; margin: 0 auto;
}
@media (max-width: 760px) { .np-pricing { grid-template-columns: 1fr; } }
.np-tier {
  position: relative;
  padding: 36px clamp(22px, 3vw, 32px);
  background: var(--np-surface);
  border: 1px solid var(--np-border);
  border-radius: var(--np-radius-lg);
  display: flex; flex-direction: column;
  overflow: hidden;
}
.np-tier-featured {
  border: 1px solid transparent;
  background:
    linear-gradient(180deg, var(--np-surface), var(--np-surface)) padding-box,
    var(--np-grad) border-box;
  box-shadow: 0 30px 80px -30px var(--np-accent);
}
.np-tier-flag {
  position: absolute; top: 18px; right: 18px;
  background: var(--np-grad); color: white;
  padding: 4px 12px; border-radius: 999px;
  font-size: 10px; font-weight: 700; letter-spacing: 0.08em;
}
.np-tier-name {
  font-size: 12px; font-weight: 600;
  letter-spacing: 0.12em; text-transform: uppercase;
  color: var(--np-text-dim);
}
.np-tier-price {
  margin-top: 14px;
  font-family: var(--np-display);
  font-size: clamp(40px, 6vw, 64px);
  font-weight: 600;
  letter-spacing: -0.03em;
  line-height: 1;
}
.np-tier-tagline {
  margin-top: 6px;
  font-size: 13px;
  color: var(--np-text-mute);
}
.np-tier-bullets {
  list-style: none; padding: 0;
  margin: 26px 0 30px;
  display: flex; flex-direction: column; gap: 10px;
}
.np-tier-bullets li {
  display: flex; align-items: center; gap: 10px;
  font-size: 14.5px;
  color: var(--np-text-dim);
}
.np-tick {
  display: inline-grid; place-items: center;
  width: 18px; height: 18px; border-radius: 50%;
  background: var(--np-accent-soft);
  color: var(--np-accent);
  font-size: 11px; font-weight: 700;
}

/* VOICE */
.np-voice {
  max-width: 760px; margin: 0 auto;
  text-align: center;
}
.np-voice-tags {
  display: flex; justify-content: center; gap: 10px;
  margin-bottom: 24px; flex-wrap: wrap;
}
.np-voice-tag {
  padding: 8px 18px;
  background: var(--np-surface);
  border: 1px solid var(--np-border);
  border-radius: 999px;
  font-size: 13px; font-weight: 500;
  color: var(--np-text);
}
.np-voice-sample {
  font-family: var(--np-display);
  font-style: italic;
  font-size: clamp(18px, 2.4vw, 26px);
  line-height: 1.4;
  color: var(--np-text);
  max-width: 640px; margin: 0 auto;
}

/* FAQ */
.np-faq { max-width: 820px; margin: 0 auto; display: grid; gap: 10px; }
.np-faq-item {
  background: var(--np-surface);
  border: 1px solid var(--np-border);
  border-radius: var(--np-radius);
  overflow: hidden;
  transition: border-color .25s;
}
.np-faq-item:hover { border-color: var(--np-accent); }
.np-faq-q {
  width: 100%; cursor: pointer;
  display: flex; justify-content: space-between; align-items: center; gap: 18px;
  padding: 18px 22px;
  background: transparent; border: 0;
  font-family: var(--np-body);
  font-size: 16px; font-weight: 600;
  color: var(--np-text);
  text-align: left;
}
.np-faq-icon {
  display: inline-grid; place-items: center;
  width: 28px; height: 28px; border-radius: 50%;
  background: var(--np-accent-soft);
  color: var(--np-accent);
  font-size: 18px; font-weight: 600;
  transition: transform .25s, background .25s;
  flex-shrink: 0;
}
.np-faq-open .np-faq-icon { background: var(--np-accent); color: white; }
.np-faq-a-wrap {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows .35s ease;
}
.np-faq-open .np-faq-a-wrap { grid-template-rows: 1fr; }
.np-faq-a {
  margin: 0;
  overflow: hidden;
  font-size: 15px;
  line-height: 1.55;
  color: var(--np-text-dim);
  padding: 0 22px;
}
.np-faq-open .np-faq-a { padding: 0 22px 22px; }

/* SEO PREVIEW */
.np-seo {
  max-width: 600px; margin: 0 auto;
  padding: 22px 24px;
  background: var(--np-surface);
  border: 1px solid var(--np-border);
  border-radius: var(--np-radius);
}
.np-seo-url {
  font-size: 12px; color: var(--np-text-mute);
  margin-bottom: 6px;
}
.np-seo-title {
  font-size: 18px; font-weight: 500;
  color: ${dark ? '#8ab4f8' : '#1a0dab'};
  text-decoration: underline; text-underline-offset: 3px;
  margin-bottom: 6px;
}
.np-seo-desc {
  font-size: 13.5px; line-height: 1.5;
  color: var(--np-text-dim);
  margin: 0;
}

/* FINAL CTA */
.np-cta {
  position: relative;
  padding: clamp(80px, 11vw, 140px) 0;
  overflow: hidden;
}
.np-cta-glow {
  position: absolute; inset: 0;
  background:
    radial-gradient(ellipse 60% 60% at 50% 50%, var(--np-accent-soft), transparent 70%),
    radial-gradient(ellipse 40% 40% at 20% 70%, var(--np-accent-soft), transparent 70%);
  pointer-events: none;
  z-index: 0;
  will-change: transform;
}
.np-cta > .np-wrap { position: relative; z-index: 1; }
.np-cta-card {
  position: relative;
  text-align: center;
  padding: clamp(40px, 6vw, 72px) clamp(24px, 4vw, 56px);
  background: var(--np-surface);
  border: 1px solid var(--np-border);
  border-radius: var(--np-radius-lg);
  overflow: hidden;
}
.np-cta-card::before {
  content: ""; position: absolute; inset: 0;
  background: radial-gradient(ellipse at 50% 100%, var(--np-accent-soft), transparent 70%);
  pointer-events: none;
}
.np-cta-h {
  position: relative;
  font-family: var(--np-display);
  font-size: clamp(32px, 5vw, 64px);
  letter-spacing: -0.03em;
  line-height: 1.05;
  margin: 0 0 14px;
  font-weight: 600;
}
.np-cta-sub {
  position: relative;
  font-size: clamp(14px, 1.4vw, 17px);
  color: var(--np-text-dim);
  margin: 0 auto 30px;
  max-width: 520px;
  line-height: 1.55;
}
.np-cta-actions {
  position: relative;
  display: flex; justify-content: center; gap: 12px; flex-wrap: wrap;
}

/* FOOTER */
.np-footer {
  padding: clamp(48px, 7vw, 80px) 0 28px;
  border-top: 1px solid var(--np-border);
  background: var(--np-bg-soft);
}
.np-footer-grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr 1fr;
  gap: 40px;
  padding-bottom: 32px;
}
@media (max-width: 760px) { .np-footer-grid { grid-template-columns: 1fr 1fr; } }
.np-footer-line {
  margin: 16px 0 0;
  font-family: var(--np-display);
  font-style: italic;
  font-size: 14px;
  line-height: 1.55;
  color: var(--np-text-dim);
  max-width: 320px;
}
.np-footer-col h4 {
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--np-text-mute);
  font-weight: 600;
  margin: 0 0 14px;
}
.np-footer-col a {
  display: block;
  padding: 5px 0;
  font-size: 14px;
  color: var(--np-text-dim);
  text-decoration: none;
  transition: color .15s;
}
.np-footer-col a:hover { color: var(--np-accent); }
.np-footer-base {
  border-top: 1px solid var(--np-border);
  padding-top: 22px;
  display: flex; justify-content: space-between; flex-wrap: wrap;
  gap: 12px;
  font-size: 12px;
  color: var(--np-text-mute);
}
.np-footer-link {
  color: var(--np-accent);
  font-weight: 600;
  text-decoration: none;
}

/* REVEAL */
.np-reveal {
  opacity: 0;
  transform: translateY(28px);
  transition: opacity .8s cubic-bezier(.22,1,.36,1), transform .8s cubic-bezier(.22,1,.36,1);
}
.np-reveal.in { opacity: 1; transform: translateY(0); }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  .np-marquee-track { animation: none; }
  .np-orb { display: none; }
}
`;
}
