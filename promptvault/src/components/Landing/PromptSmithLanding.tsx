'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { hasAccess } from '@/lib/access';
import CheckoutModal from '@/components/CheckoutModal';
import ClaudeDesignSection from '@/components/Landing/ClaudeDesignSection';

type Prompt = {
  title: string;
  model: string;
  tokens: string;
  prompt: string;
  response: string;
};

type VaultEntry = {
  cat: 'dev' | 'write' | 'design' | 'research' | 'biz';
  title: string;
  tags: string;
  tier: 'PRO' | 'FREE';
  snippet: string;
};

const PROMPTS: Prompt[] = [
  {
    title: 'Code review',
    model: 'GPT-5 / Claude 4.5',
    tokens: '312 tok',
    prompt: `You are a senior {{language}} engineer reviewing a PR.

Be terse. Flag only:
1. Bugs that will cause runtime errors
2. Security issues (injection, auth, secrets)
3. Performance regressions > {{threshold}}ms

Skip nitpicks. Output as a numbered list with file:line refs.`,
    response: `1. auth.ts:42 — JWT verified after DB lookup. Reverse it; saves a query on every invalid token.
2. handlers/upload.ts:118 — No size cap on multer config. DoS vector.
3. db/queries.ts:201 — N+1 on user.posts. Use a single join.`,
  },
  {
    title: 'Cold email',
    model: 'Claude 4.5 Opus',
    tokens: '287 tok',
    prompt: `Write a cold email to {{persona}} at {{company}}.

Constraints:
- Under 90 words
- Reference one specific public detail (recent ship, hiring, post)
- One CTA: a 15-min call
- No "Hope this finds you well"
- No adverbs

Subject line: 5 words max. Curiosity, not clickbait.`,
    response: `Subject: Saw the Series B — quick idea

Hi Maya — congrats on the Series B. Noticed your team just opened three growth roles in two weeks; usually a sign onboarding is the bottleneck before scaling activation. We helped Linear and Pitch cut activation friction by 40% in 6 weeks. Worth a 15-min call next Tuesday?`,
  },
  {
    title: 'Storyboard',
    model: 'GPT-5 Vision',
    tokens: '421 tok',
    prompt: `Generate a {{n}}-frame storyboard for a {{duration}}s product film.

Product: {{product}}
Tone: {{tone}}
Audience: {{audience}}

Per frame return:
- Camera (angle, lens, movement)
- Action (1 sentence)
- VO (max 8 words)
- Sound design

Avoid: drone shots, "epic" anything, lens flares.`,
    response: `Frame 1 — Macro 60mm. Hand reaches into shadow, flicks a switch.
VO: "Most prompts are guesses."
SFX: low hum, single click.

Frame 2 — Static wide. Vault door rotates open in stop-motion.
VO: "We tested 40,000."
SFX: deep mechanical thud.`,
  },
];

const VAULT: VaultEntry[] = [
  {
    cat: 'dev',
    title: 'Production Code Reviewer',
    tags: 'Engineering · 12k uses',
    tier: 'PRO',
    snippet: `You are a senior {{language}} engineer.\nFlag only bugs, security & perf > {{threshold}}ms.\nNo nitpicks. Numbered list w/ file:line.`,
  },
  {
    cat: 'write',
    title: '90-Word Cold Email',
    tags: 'Sales · 8.4k uses',
    tier: 'FREE',
    snippet: `Cold email to {{persona}} at {{company}}.\nUnder 90 words, one specific reference,\none CTA. No adverbs. 5-word subject.`,
  },
  {
    cat: 'design',
    title: 'Design Brand System',
    tags: 'Design · 3.2k uses',
    tier: 'PRO',
    snippet: `Generate a brand system for {{co}}.\nReturn: type pair, palette (oklch),\ngrid rules, motion principles.`,
  },
  {
    cat: 'research',
    title: 'Literature Synthesizer',
    tags: 'Research · 5.1k uses',
    tier: 'PRO',
    snippet: `Synthesize {{n}} papers on {{topic}}.\nOutput: consensus, conflicts,\nopen questions, methodological gaps.`,
  },
  {
    cat: 'biz',
    title: 'Investor Memo (1-pager)',
    tags: 'Business · 6.8k uses',
    tier: 'FREE',
    snippet: `1-page memo for {{round}} round.\nThesis · traction · market · ask.\nNo jargon. Numbers in tables.`,
  },
  {
    cat: 'dev',
    title: 'API Spec → Tests',
    tags: 'Engineering · 4.7k uses',
    tier: 'PRO',
    snippet: `Convert OpenAPI spec to {{framework}} tests.\nCover happy path, edge cases,\nauth failures, rate limits.`,
  },
  {
    cat: 'write',
    title: 'Anti-Slop Blog Post',
    tags: 'Content · 9.1k uses',
    tier: 'PRO',
    snippet: `Write a {{length}}-word post on {{topic}}.\nNo "in today's fast-paced world".\nNo bullet lists. One opinion.`,
  },
  {
    cat: 'design',
    title: 'UX Copy Auditor',
    tags: 'Design · 2.8k uses',
    tier: 'FREE',
    snippet: `Audit UX copy in {{screens}}.\nFlag: passive voice, jargon,\nambiguous CTAs. Suggest replacements.`,
  },
  {
    cat: 'research',
    title: 'Competitor Teardown',
    tags: 'Strategy · 3.9k uses',
    tier: 'PRO',
    snippet: `Teardown of {{competitor}}.\nPositioning · pricing · moat ·\nweaknesses · what we'd steal.`,
  },
];

const FILTERS: { id: 'all' | VaultEntry['cat']; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'dev', label: 'Dev' },
  { id: 'write', label: 'Writing' },
  { id: 'design', label: 'Design' },
  { id: 'research', label: 'Research' },
  { id: 'biz', label: 'Business' },
];

const escapeHtml = (s: string) =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

const formatPrompt = (text: string) =>
  escapeHtml(text).replace(/\{\{([^}]+)\}\}/g, '<span class="var">{{$1}}</span>');

const formatSnippet = (text: string) =>
  escapeHtml(text)
    .replace(/\{\{([^}]+)\}\}/g, '<span class="v">{{$1}}</span>')
    .replace(/\n/g, '<br>');

export default function PromptSmithLanding() {
  const router = useRouter();
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState(0);
  const [activeFilter, setActiveFilter] = useState<'all' | VaultEntry['cat']>('all');
  const [statusLive, setStatusLive] = useState(false);
  const [copied, setCopied] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  // Read localStorage unlock flag once on mount (legacy device-bound access).
  useEffect(() => {
    setUnlocked(hasAccess());
  }, []);

  // Wire the paid CTA. Three paths:
  //   - Already legacy-unlocked on this device → straight to /browse.
  //   - Logged in → open the checkout modal (uses session email).
  //   - Anonymous → route to /signup with a callback so they bounce back.
  const onUnlockClick = () => {
    if (unlocked) {
      router.push('/browse');
      return;
    }
    if (!session?.user) {
      router.push('/signup?callbackUrl=' + encodeURIComponent('/?buy=1'));
      return;
    }
    setCheckoutOpen(true);
  };

  // Free CTA goes to the 348-prompt preview page.
  const onStartFree = () => router.push('/preview');

  const promptElRef = useRef<HTMLDivElement | null>(null);
  const responseElRef = useRef<HTMLDivElement | null>(null);
  const userInteractedRef = useRef(false);
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cycleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const blobsRef = useRef<HTMLDivElement | null>(null);

  // body bg/color now lives in globals.css :root + body — no JS override needed.

  // typewriter console
  useEffect(() => {
    const promptEl = promptElRef.current;
    const responseEl = responseElRef.current;
    if (!promptEl || !responseEl) return;

    const clearTimers = () => {
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
      if (cycleTimerRef.current) clearTimeout(cycleTimerRef.current);
    };

    clearTimers();
    setStatusLive(false);
    promptEl.innerHTML = '<span class="caret"></span>';
    responseEl.innerHTML = '';

    const p = PROMPTS[activeTab];
    let i = 0;
    const text = p.prompt;
    const tick = () => {
      i = Math.min(text.length, i + Math.max(1, Math.floor(Math.random() * 4) + 1));
      promptEl.innerHTML = formatPrompt(text.slice(0, i)) + '<span class="caret"></span>';
      if (i < text.length) {
        typingTimerRef.current = setTimeout(tick, 12 + Math.random() * 28);
      } else {
        promptEl.innerHTML = formatPrompt(text);
        setStatusLive(true);
        let j = 0;
        const r = p.response;
        const rtick = () => {
          j = Math.min(r.length, j + Math.max(1, Math.floor(Math.random() * 5) + 2));
          responseEl.innerHTML =
            '<span class="typed">' +
            escapeHtml(r.slice(0, j)).replace(/\n/g, '<br>') +
            '</span>';
          if (j < r.length) {
            typingTimerRef.current = setTimeout(rtick, 8 + Math.random() * 18);
          } else if (!userInteractedRef.current) {
            cycleTimerRef.current = setTimeout(() => {
              setActiveTab((prev) => (prev + 1) % PROMPTS.length);
            }, 3400);
          }
        };
        rtick();
      }
    };
    tick();

    return clearTimers;
  }, [activeTab]);

  // counters
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>('[data-count]');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          observer.unobserve(el);
          const target = parseInt(el.dataset.count || '0', 10);
          const suffix = el.dataset.suffix || '';
          const start = performance.now();
          const dur = 1800;
          const ease = (t: number) => 1 - Math.pow(1 - t, 3);
          const frame = (now: number) => {
            const t = Math.min(1, (now - start) / dur);
            const v = Math.floor(target * ease(t));
            el.textContent = v.toLocaleString() + suffix;
            if (t < 1) requestAnimationFrame(frame);
          };
          requestAnimationFrame(frame);
        });
      },
      { threshold: 0.4 },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // reveal-on-scroll
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>('.reveal');
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
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [activeFilter]);

  // staggered card reveal each filter change
  useEffect(() => {
    const cards = document.querySelectorAll<HTMLElement>('.grid .card.reveal');
    cards.forEach((el, i) => {
      setTimeout(() => el.classList.add('in'), 60 + i * 50);
    });
  }, [activeFilter]);

  // parallax on bg blobs
  useEffect(() => {
    const stage = blobsRef.current;
    if (!stage) return;
    const blobs = stage.querySelectorAll<HTMLElement>('.blob');
    let tx = 0,
      ty = 0,
      cx = 0,
      cy = 0;
    let raf = 0;
    const onMove = (e: MouseEvent) => {
      tx = (e.clientX / window.innerWidth - 0.5) * 30;
      ty = (e.clientY / window.innerHeight - 0.5) * 30;
    };
    const tick = () => {
      cx += (tx - cx) * 0.05;
      cy += (ty - cy) * 0.05;
      blobs.forEach((b, i) => {
        const f = (i + 1) * 0.6;
        b.style.translate = `${cx * f}px ${cy * f}px`;
      });
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener('mousemove', onMove);
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  const onTab = (i: number) => {
    userInteractedRef.current = true;
    setActiveTab(i);
  };

  const onCopyPrompt = () => {
    navigator.clipboard?.writeText(PROMPTS[activeTab].prompt).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  const filteredVault = VAULT.filter((p) => activeFilter === 'all' || p.cat === activeFilter);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <link
        rel="preconnect"
        href="https://fonts.googleapis.com"
      />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin=""
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Geist:wght@300;400;500;600;700&family=Geist+Mono:wght@400;500&display=swap"
        rel="stylesheet"
      />

      <div className="bg-stage" aria-hidden="true" ref={blobsRef}>
        <div className="blob b1" />
        <div className="blob b2" />
        <div className="blob b3" />
      </div>
      <div className="bg-grid" aria-hidden="true" />
      <div className="bg-noise" aria-hidden="true" />

      <header className="nav">
        <div className="nav-inner">
          <a className="logo" href="/">
            <span className="logo-mark"><span>PS</span></span>
            Prompt Smith
          </a>
          <nav
            className="nav-links"
            aria-label="Primary"
            style={menuOpen ? mobileMenuOpenStyle : undefined}
          >
            <a href="#vault" onClick={() => setMenuOpen(false)}>Vault</a>
            <a href="#pricing" onClick={() => setMenuOpen(false)}>Pricing</a>
            <a href="/preview" onClick={() => setMenuOpen(false)}>Free preview</a>
            {session?.user ? (
              <a href="/account" onClick={() => setMenuOpen(false)}>Account</a>
            ) : (
              <a href="/login" onClick={() => setMenuOpen(false)}>Sign in</a>
            )}
          </nav>
          {session?.user ? (
            <button
              type="button"
              className="nav-cta"
              onClick={onUnlockClick}
            >
              {unlocked ? 'Open library →' : 'Get access →'}
            </button>
          ) : (
            <a className="nav-cta" href="/signup">Get access →</a>
          )}
          <button
            className="menu-btn"
            aria-label="Menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          </button>
        </div>
      </header>

      <main>
        {/* HERO */}
        <section className="hero">
          <div className="wrap">
            <div className="hero-grid">
              <div>
                <a className="pill-tag" href="#vault">
                  <span className="new">NEW</span>
                  <span>148k AI builders shipped this week</span>
                  <span className="arr">→</span>
                </a>
                <h1>
                  <span className="line"><span>Unlock the</span></span>
                  <span className="line"><span><em className="iri">best</em> prompts</span></span>
                  <span className="line"><span>for serious builders.</span></span>
                </h1>
                <p className="hero-sub">
                  A curated, battle-tested library of prompts that actually ship. Browse free.
                  Upgrade for the ones used in production by 148k AI power users.
                </p>
                <div className="hero-actions">
                  <button type="button" className="btn btn-primary" onClick={onStartFree}>
                    <span>Start free</span>
                    <span>→</span>
                  </button>
                  <a className="btn btn-ghost" href="#vault">Browse the vault</a>
                </div>
                <div className="trust">
                  <div className="avatars">
                    <span className="av" />
                    <span className="av" />
                    <span className="av" />
                    <span className="av" />
                  </div>
                  <div>
                    <div className="stars">★★★★★</div>
                    <div>Loved by 148k+ builders</div>
                  </div>
                </div>
                <div className="hero-counters">
                  <div>
                    <div className="num" data-count="2847">0</div>
                    <div className="lbl">Prompts indexed</div>
                  </div>
                  <div>
                    <div className="num" data-count="148000" data-suffix="+">0</div>
                    <div className="lbl">Active users</div>
                  </div>
                  <div>
                    <div className="num" data-count="98" data-suffix="%">0</div>
                    <div className="lbl">Success rate</div>
                  </div>
                </div>
              </div>

              <div className="console-wrap">
                <div className="console" id="console">
                  <div className="console-bar">
                    <div className="dots">
                      <span />
                      <span />
                      <span />
                    </div>
                    <div>prompt.live / demo</div>
                    <div className={`status${statusLive ? ' live' : ''}`} id="consoleStatus">
                      <span className="led" />
                      <span id="statusText">{statusLive ? 'Live' : 'Composing'}</span>
                    </div>
                  </div>
                  <div className="console-tabs">
                    {PROMPTS.map((p, i) => (
                      <button
                        key={p.title}
                        className={i === activeTab ? 'active' : ''}
                        onClick={() => onTab(i)}
                      >
                        {p.title}
                      </button>
                    ))}
                  </div>
                  <div className="console-body">
                    <div className="label">Prompt</div>
                    <div className="prompt-text" ref={promptElRef} />
                    <div className="response">
                      <div className="label" style={{ marginBottom: '8px' }}>
                        Sample output
                      </div>
                      <div ref={responseElRef} />
                    </div>
                  </div>
                  <div className="console-foot">
                    <div className="meta">
                      <span>{PROMPTS[activeTab].model}</span>
                      <span>{PROMPTS[activeTab].tokens}</span>
                    </div>
                    <button
                      className={`copy${copied ? ' copied' : ''}`}
                      onClick={onCopyPrompt}
                    >
                      {copied ? 'Copied ✓' : 'Copy prompt'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* LOGOS */}
        <section className="logos-strip">
          <div className="wrap">
            <div className="lbl">Trusted by teams at</div>
            <div className="logos-row">
              <span>◆ Linear</span>
              <span>✺ Notion</span>
              <span>◐ Vercel</span>
              <span>▲ Pitch</span>
              <span>◇ Raycast</span>
              <span>● Loops</span>
            </div>
          </div>
        </section>

        {/* VAULT */}
        <section className="section" id="vault">
          <div className="wrap">
            <div className="section-head reveal">
              <div>
                <div className="section-tag">FEATURED · S25</div>
                <h2 className="section-title">
                  The <em>vault.</em>
                </h2>
              </div>
              <p className="section-desc">
                Hand-picked prompts that consistently outperform. Tap any card to flip it open and
                read the actual prompt — premium ones run live the moment you join.
              </p>
            </div>

            <div className="filters reveal" role="tablist">
              {FILTERS.map((f) => (
                <button
                  key={f.id}
                  className={`chip${activeFilter === f.id ? ' active' : ''}`}
                  onClick={() => setActiveFilter(f.id)}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="grid">
              {filteredVault.map((p, idx) => (
                <VaultCard key={`${activeFilter}-${idx}-${p.title}`} entry={p} />
              ))}
            </div>
          </div>
        </section>

        <ClaudeDesignSection />

        {/* PRICING */}
        <section className="section" id="pricing">
          <div className="wrap">
            <div className="section-head reveal">
              <div>
                <div className="section-tag">PLANS · 02</div>
                <h2 className="section-title">
                  Free or <em>full power.</em>
                </h2>
              </div>
              <p className="section-desc">
                Browse the entire vault for free. Upgrade for the prompts that ship to production —
                plus weekly drops, version history, and team workspaces.
              </p>
            </div>

            <div className="price-grid reveal">
              <div className="tier">
                <div className="tier-name">Free</div>
                <div className="tier-price">
                  $0<span className="per">/forever</span>
                </div>
                <p className="tier-desc">
                  Everything you need to explore the vault and run the basics.
                </p>
                <ul className="tier-features">
                  <li><span className="tick">✓</span> Access to 600+ free prompts</li>
                  <li><span className="tick">✓</span> Copy &amp; paste any prompt</li>
                  <li><span className="tick">✓</span> Browse all 38 categories</li>
                  <li><span className="tick">✓</span> 5 saves per month</li>
                  <li><span className="tick">✓</span> Community ratings</li>
                </ul>
                <button type="button" className="tier-cta" onClick={onStartFree}>Start free →</button>
              </div>
              <div className="tier featured">
                <div className="tier-flag">RECOMMENDED</div>
                <div className="tier-name">Premium</div>
                <div className="tier-price">
                  $12<span className="per">/month</span>
                </div>
                <p className="tier-desc">
                  Every prompt. Every update. Every workflow that actually ships.
                </p>
                <ul className="tier-features">
                  <li><span className="tick">✓</span> All 2,847 prompts (+weekly drops)</li>
                  <li><span className="tick">✓</span> Production-grade prompt chains</li>
                  <li><span className="tick">✓</span> Version history &amp; A/B variants</li>
                  <li><span className="tick">✓</span> Unlimited saves &amp; collections</li>
                  <li><span className="tick">✓</span> Run prompts live in-browser</li>
                  <li><span className="tick">✓</span> Priority requests &amp; private discord</li>
                </ul>
                <button type="button" className="tier-cta" onClick={onUnlockClick}>
                  {unlocked ? 'Open your library →' : 'Unlock premium →'}
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="wrap">
          <div className="footer-cta">
            <h3>
              Ready to ship with <em>better</em> prompts?
            </h3>
            <p>Join 148,000+ builders who stopped guessing. Free forever. Premium when you&apos;re ready.</p>
            <button type="button" className="btn btn-primary" onClick={onStartFree}>
              <span>Get started free</span>
              <span>→</span>
            </button>
          </div>

          <div className="footer-cols">
            <div>
              <a className="logo" href="#" style={{ marginBottom: '14px' }}>
                <span className="logo-mark"><span>PS</span></span>
                Prompt Smith
              </a>
              <p>
                Curated by AI power users for AI power users. No filler, no SEO slop, no
                &ldquo;25 ChatGPT hacks&rdquo; lists. Just prompts that work.
              </p>
            </div>
            <div>
              <h4>Product</h4>
              <a href="/browse">Browse</a>
              <a href="/search">Search</a>
              <a href="/preview">Free preview</a>
              <a href="#pricing">Pricing</a>
            </div>
            <div>
              <h4>Account</h4>
              <a href="/signup">Sign up</a>
              <a href="/login">Log in</a>
              <a href="/account">Your account</a>
            </div>
            <div>
              <h4>Company</h4>
              <a href="/about">About us</a>
              <a href="/contact">Contact us</a>
              <a href="/refund">Refund policy</a>
              <a href="/return">Return policy</a>
              <a href="/privacy">Privacy</a>
              <a href="/terms">Terms</a>
            </div>
          </div>
          <div className="footer-base">
            <div>© 2026 Prompt Smith</div>
            <div>v.04 · Built for builders</div>
          </div>
        </div>
      </footer>

      <CheckoutModal open={checkoutOpen} onClose={() => setCheckoutOpen(false)} />
    </>
  );
}

function VaultCard({ entry }: { entry: VaultEntry }) {
  const [flipped, setFlipped] = useState(false);
  const [copyState, setCopyState] = useState(false);
  const frontRef = useRef<HTMLDivElement | null>(null);

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const front = frontRef.current;
    if (!front) return;
    const r = front.getBoundingClientRect();
    front.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`);
    front.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`);
  };

  const onCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('.card-back-foot')) return;
    setFlipped((v) => !v);
  };

  const onCopy = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(entry.snippet).catch(() => {});
    setCopyState(true);
    setTimeout(() => setCopyState(false), 1400);
  };

  return (
    <div
      className={`card reveal${flipped ? ' flipped' : ''}`}
      onClick={onCardClick}
    >
      <div className="card-inner">
        <div
          className="card-face front"
          ref={frontRef}
          onMouseMove={onMouseMove}
        >
          <div className="card-cat">
            <span>{entry.cat.toUpperCase()}</span>
            <span className={`badge${entry.tier === 'FREE' ? ' free' : ''}`}>{entry.tier}</span>
          </div>
          <div className="card-flip-hint">↻ Flip</div>
          <div className="card-title">{entry.title}</div>
          <div className="card-meta">
            <span>{entry.tags}</span>
            <span className={`price${entry.tier === 'FREE' ? '' : ' pro'}`}>
              {entry.tier === 'FREE' ? 'FREE' : '$0.99'}
            </span>
          </div>
        </div>
        <div className="card-face back">
          <div className="card-cat">
            <span>PROMPT.SOURCE</span>
            <span className={`badge${entry.tier === 'FREE' ? ' free' : ''}`}>{entry.tier}</span>
          </div>
          <div
            className="card-back-snippet"
            dangerouslySetInnerHTML={{ __html: formatSnippet(entry.snippet) }}
          />
          <div className="card-back-foot">
            <button className="b" onClick={onCopy}>
              {copyState ? 'Copied ✓' : 'Copy'}
            </button>
            <button className="b alt" onClick={(e) => e.stopPropagation()}>
              Run live
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const mobileMenuOpenStyle: React.CSSProperties = {
  display: 'flex',
  position: 'absolute',
  top: '64px',
  left: 0,
  right: 0,
  flexDirection: 'column',
  gap: 0,
  background: 'rgba(12,12,24,0.95)',
  backdropFilter: 'blur(18px)',
  padding: '8px',
  borderRadius: '20px',
  border: '1px solid var(--border)',
};

const STYLES = `
:root {
  --bg-0: #07070d;
  --bg-1: #0c0c18;
  --bg-2: #12122a;
  --surface: rgba(255, 255, 255, 0.04);
  --surface-2: rgba(255, 255, 255, 0.06);
  --border: rgba(255, 255, 255, 0.08);
  --border-strong: rgba(255, 255, 255, 0.16);

  --text: #f0eef7;
  --text-dim: #a5a3b8;
  --text-mute: #6c6a85;

  --violet: #7c5cff;
  --magenta: #d946ef;
  --cyan: #22d3ee;
  --mint: #5eead4;

  --grad-iri: linear-gradient(135deg, #7c5cff 0%, #d946ef 50%, #22d3ee 100%);
  --grad-iri-soft: linear-gradient(135deg, rgba(124,92,255,0.85), rgba(217,70,239,0.85), rgba(34,211,238,0.85));
  --grad-glow: radial-gradient(circle at 50% 50%, rgba(124,92,255,0.5), transparent 60%);

  --r-sm: 10px;
  --r-md: 16px;
  --r-lg: 24px;
  --r-xl: 32px;
  --r-pill: 999px;

  --shadow-glow: 0 0 80px -20px rgba(124,92,255,0.5), 0 0 160px -40px rgba(217,70,239,0.3);
}

html, body {
  background: var(--bg-0) !important;
  color: var(--text);
  font-family: "Geist", system-ui, -apple-system, sans-serif;
  -webkit-font-smoothing: antialiased;
  text-rendering: geometricPrecision;
  overflow-x: hidden;
  line-height: 1.5;
  max-width: none !important;
}

.bg-stage {
  position: fixed; inset: 0; z-index: 0; pointer-events: none;
  overflow: hidden;
}
.bg-stage .blob {
  position: absolute; border-radius: 50%;
  filter: blur(80px); opacity: 0.5;
  will-change: transform;
}
.bg-stage .b1 { top: -10%; left: -10%; width: 600px; height: 600px; background: radial-gradient(circle, #7c5cff, transparent 70%); animation: drift1 22s ease-in-out infinite; }
.bg-stage .b2 { top: 20%; right: -15%; width: 700px; height: 700px; background: radial-gradient(circle, #d946ef, transparent 70%); opacity: 0.35; animation: drift2 28s ease-in-out infinite; }
.bg-stage .b3 { bottom: -20%; left: 30%; width: 800px; height: 800px; background: radial-gradient(circle, #22d3ee, transparent 70%); opacity: 0.28; animation: drift3 34s ease-in-out infinite; }
@keyframes drift1 { 0%,100% { transform: translate(0,0) } 50% { transform: translate(80px, 60px) } }
@keyframes drift2 { 0%,100% { transform: translate(0,0) } 50% { transform: translate(-100px, 80px) } }
@keyframes drift3 { 0%,100% { transform: translate(0,0) } 50% { transform: translate(60px, -100px) } }

.bg-grid {
  position: fixed; inset: 0; z-index: 1; pointer-events: none;
  background-image:
    linear-gradient(to right, rgba(255,255,255,0.025) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255,255,255,0.025) 1px, transparent 1px);
  background-size: 64px 64px;
  -webkit-mask-image: radial-gradient(ellipse 80% 60% at 50% 30%, black 30%, transparent 80%);
  mask-image: radial-gradient(ellipse 80% 60% at 50% 30%, black 30%, transparent 80%);
}
.bg-noise {
  position: fixed; inset: 0; z-index: 2; pointer-events: none;
  opacity: 0.04; mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence baseFrequency='0.9' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
}

main, header, footer { position: relative; z-index: 3; }

.wrap {
  max-width: 1280px; margin: 0 auto;
  padding: 0 clamp(20px, 4vw, 48px);
}

.nav {
  position: sticky; top: 16px; z-index: 50;
  margin: 16px clamp(20px, 4vw, 48px) 0;
}
.nav-inner {
  max-width: 1280px; margin: 0 auto;
  display: flex; align-items: center; justify-content: space-between;
  padding: 12px 12px 12px 22px;
  background: rgba(12,12,24,0.65);
  backdrop-filter: blur(18px) saturate(180%);
  -webkit-backdrop-filter: blur(18px) saturate(180%);
  border: 1px solid var(--border);
  border-radius: var(--r-pill);
  box-shadow: 0 10px 40px -20px rgba(0,0,0,0.6);
}
.logo {
  display: flex; align-items: center; gap: 10px;
  font-weight: 600; font-size: 16px; letter-spacing: -0.01em;
  color: var(--text); text-decoration: none;
}
.logo-mark {
  width: 30px; height: 30px;
  border-radius: 8px;
  background: var(--grad-iri);
  display: grid; place-items: center;
  color: white; font-weight: 700; font-size: 12px;
  box-shadow: 0 4px 16px -2px rgba(124,92,255,0.6);
  position: relative;
}
.logo-mark::before {
  content: ""; position: absolute; inset: 1px;
  border-radius: 7px; background: linear-gradient(135deg, rgba(255,255,255,0.2), transparent 50%);
}
.logo-mark span { position: relative; z-index: 2; letter-spacing: 0.02em; }

.nav-links {
  display: flex; align-items: center; gap: 6px;
}
.nav-links a {
  color: var(--text-dim); text-decoration: none;
  font-size: 14px; font-weight: 500;
  padding: 8px 14px; border-radius: var(--r-pill);
  transition: color .2s, background .2s;
}
.nav-links a:hover { color: var(--text); background: var(--surface); }

.nav-cta {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 10px 18px;
  background: var(--text); color: var(--bg-0);
  font-size: 14px; font-weight: 600;
  text-decoration: none;
  border-radius: var(--r-pill);
  transition: transform .2s, box-shadow .2s;
}
.nav-cta:hover { transform: translateY(-1px); box-shadow: 0 8px 24px -8px rgba(255,255,255,0.4); }

.menu-btn { display: none; background: var(--surface); border: 1px solid var(--border); color: var(--text); cursor: pointer; padding: 10px; border-radius: var(--r-sm); }
@media (max-width: 820px) {
  .nav-links { display: none; }
  .menu-btn { display: block; }
  .nav-links a { padding: 12px 16px; width: 100%; }
}

.hero {
  padding: clamp(64px, 9vw, 120px) 0 clamp(60px, 9vw, 100px);
  position: relative;
}

.pill-tag {
  display: inline-flex; align-items: center; gap: 10px;
  padding: 7px 7px 7px 14px;
  background: var(--surface); border: 1px solid var(--border);
  border-radius: var(--r-pill);
  font-size: 13px; color: var(--text-dim);
  margin-bottom: 28px;
  text-decoration: none;
}
.pill-tag .new {
  padding: 3px 10px; border-radius: var(--r-pill);
  background: var(--grad-iri); color: white;
  font-size: 11px; font-weight: 600; letter-spacing: 0.02em;
}
.pill-tag .arr { opacity: 0.5; transition: transform .2s; }
.pill-tag:hover .arr { transform: translateX(3px); }

.hero-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 0.95fr);
  gap: clamp(32px, 5vw, 72px);
  align-items: center;
}
@media (max-width: 980px) { .hero-grid { grid-template-columns: 1fr; gap: 48px; } }

.hero h1 {
  font-family: "Geist", sans-serif;
  font-weight: 600;
  font-size: clamp(44px, 6.4vw, 92px);
  line-height: 1.08;
  letter-spacing: -0.035em;
}
.hero h1 .iri {
  background: var(--grad-iri);
  -webkit-background-clip: text; background-clip: text;
  -webkit-text-fill-color: transparent;
  font-family: "Instrument Serif", serif;
  font-style: italic;
  font-weight: 400;
  letter-spacing: -0.01em;
}
.hero h1 .line { display: block; padding-bottom: 0.12em; }
.hero h1 .line span { display: inline-block; opacity: 0; transform: translateY(40px); animation: reveal 1s cubic-bezier(.22,1,.36,1) forwards; }
.hero h1 .line:nth-child(1) span { animation-delay: 0.1s; }
.hero h1 .line:nth-child(2) span { animation-delay: 0.2s; }
.hero h1 .line:nth-child(3) span { animation-delay: 0.3s; }
@keyframes reveal { to { transform: translateY(0); opacity: 1; } }

.hero-sub {
  margin-top: 24px;
  max-width: 520px;
  font-size: 17px;
  line-height: 1.55;
  color: var(--text-dim);
}

.hero-actions {
  margin-top: 36px;
  display: flex; flex-wrap: wrap; gap: 12px;
  align-items: center;
}
.btn {
  display: inline-flex; align-items: center; gap: 10px;
  padding: 14px 22px;
  font-size: 15px; font-weight: 500;
  text-decoration: none; cursor: pointer;
  border-radius: var(--r-pill);
  border: 0;
  transition: transform .2s, box-shadow .2s, background .2s;
}
.btn-primary {
  background: var(--text); color: var(--bg-0);
  font-weight: 600;
  position: relative;
  overflow: hidden;
}
.btn-primary::before {
  content: ""; position: absolute; inset: 0;
  background: var(--grad-iri); opacity: 0;
  transition: opacity .3s;
}
.btn-primary span { position: relative; z-index: 2; }
.btn-primary:hover { transform: translateY(-2px); box-shadow: var(--shadow-glow); color: white; }
.btn-primary:hover::before { opacity: 1; }

.btn-ghost {
  background: var(--surface); color: var(--text);
  border: 1px solid var(--border);
  backdrop-filter: blur(10px);
}
.btn-ghost:hover { background: var(--surface-2); border-color: var(--border-strong); transform: translateY(-2px); }

.trust {
  margin-top: 20px;
  display: flex; align-items: center; gap: 14px;
  font-size: 13px; color: var(--text-mute);
}
.avatars { display: flex; }
.avatars .av {
  width: 28px; height: 28px; border-radius: 50%;
  border: 2px solid var(--bg-0);
  margin-left: -8px;
  background-size: cover; background-position: center;
}
.avatars .av:first-child { margin-left: 0; }
.avatars .av:nth-child(1) { background: linear-gradient(135deg, #7c5cff, #d946ef); }
.avatars .av:nth-child(2) { background: linear-gradient(135deg, #22d3ee, #5eead4); }
.avatars .av:nth-child(3) { background: linear-gradient(135deg, #f59e0b, #ef4444); }
.avatars .av:nth-child(4) { background: linear-gradient(135deg, #10b981, #22d3ee); }
.stars { color: #fbbf24; letter-spacing: 1px; }

.hero-counters {
  margin-top: 56px;
  display: grid; grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  padding: 24px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-lg);
  backdrop-filter: blur(10px);
}
.hero-counters > div { text-align: left; }
.hero-counters > div + div { border-left: 1px solid var(--border); padding-left: 24px; }
@media (max-width: 600px) {
  .hero-counters { grid-template-columns: 1fr; gap: 16px; }
  .hero-counters > div + div { border-left: 0; border-top: 1px solid var(--border); padding-left: 0; padding-top: 16px; }
}
.hero-counters .num {
  font-size: clamp(28px, 3.4vw, 40px);
  font-weight: 600; letter-spacing: -0.02em; line-height: 1;
  background: var(--grad-iri);
  -webkit-background-clip: text; background-clip: text;
  -webkit-text-fill-color: transparent;
}
.hero-counters .lbl {
  margin-top: 8px;
  font-size: 13px; color: var(--text-mute);
}

.console-wrap { position: relative; }
.console-wrap::before {
  content: ""; position: absolute; inset: -40px;
  background: var(--grad-glow); opacity: 0.6;
  filter: blur(40px); z-index: -1;
}
.console {
  background: linear-gradient(180deg, rgba(20,20,40,0.7), rgba(12,12,24,0.7));
  backdrop-filter: blur(24px) saturate(160%);
  -webkit-backdrop-filter: blur(24px) saturate(160%);
  border: 1px solid var(--border-strong);
  border-radius: var(--r-lg);
  overflow: hidden;
  box-shadow: 0 30px 80px -20px rgba(0,0,0,0.6), 0 0 0 1px rgba(124,92,255,0.1);
  transition: transform .4s ease;
  position: relative;
}
.console::before {
  content: ""; position: absolute; inset: 0;
  border-radius: var(--r-lg); padding: 1px;
  background: linear-gradient(135deg, rgba(124,92,255,0.4), transparent 40%, transparent 60%, rgba(34,211,238,0.4));
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor; mask-composite: exclude;
  pointer-events: none;
}
.console-bar {
  display: flex; align-items: center; justify-content: space-between;
  padding: 14px 18px;
  border-bottom: 1px solid var(--border);
  font-family: "Geist Mono", monospace; font-size: 12px;
  color: var(--text-dim);
}
.console-bar .dots { display: flex; gap: 6px; }
.console-bar .dots span {
  width: 11px; height: 11px; border-radius: 50%;
  background: rgba(255,255,255,0.12);
}
.console-bar .dots span:nth-child(1) { background: #ef4444; }
.console-bar .dots span:nth-child(2) { background: #f59e0b; }
.console-bar .dots span:nth-child(3) { background: #10b981; }

.console-bar .status {
  display: flex; align-items: center; gap: 8px;
}
.console-bar .status .led {
  width: 7px; height: 7px; border-radius: 50%; background: #f59e0b;
  box-shadow: 0 0 8px currentColor; color: #f59e0b;
  animation: blink 1.4s ease-in-out infinite;
}
.console-bar .status.live .led { color: #10b981; background: #10b981; }
@keyframes blink { 50% { opacity: 0.35; } }

.console-tabs {
  display: flex; gap: 6px;
  padding: 12px 12px 0;
}
.console-tabs button {
  flex: 1;
  padding: 9px 10px;
  background: transparent; border: 1px solid transparent;
  color: var(--text-mute); cursor: pointer;
  font-family: "Geist", sans-serif; font-size: 13px; font-weight: 500;
  border-radius: var(--r-pill);
  transition: all .2s;
}
.console-tabs button:hover { color: var(--text); background: var(--surface); }
.console-tabs button.active {
  color: var(--text); background: var(--surface-2); border-color: var(--border);
}

.console-body {
  padding: 22px 22px 18px;
  font-family: "Geist Mono", monospace;
  font-size: 13.5px; line-height: 1.65;
  min-height: 280px;
}
.console-body .label {
  font-size: 10.5px; color: var(--text-mute); text-transform: uppercase;
  letter-spacing: 0.1em; margin-bottom: 8px;
  font-family: "Geist", sans-serif; font-weight: 500;
}
.prompt-text {
  color: var(--text); white-space: pre-wrap; word-break: break-word;
  min-height: 4.4em;
}
.prompt-text .var {
  color: var(--cyan); background: rgba(34,211,238,0.08);
  padding: 0 4px; border-radius: 4px;
}
.prompt-text .caret {
  display: inline-block; width: 8px; height: 1.05em;
  background: var(--violet); border-radius: 2px;
  vertical-align: -2px; margin-left: 2px;
  animation: blink 1s steps(2) infinite;
  box-shadow: 0 0 8px var(--violet);
}
.response {
  margin-top: 18px; padding: 16px;
  border-radius: var(--r-md);
  background: rgba(124,92,255,0.06);
  border: 1px solid rgba(124,92,255,0.18);
  color: var(--text-dim); font-size: 13px;
}
.response .typed { color: var(--text); }

.console-foot {
  display: flex; align-items: center; justify-content: space-between;
  padding: 12px 18px; border-top: 1px solid var(--border);
  font-family: "Geist Mono", monospace; font-size: 11px;
  color: var(--text-mute);
}
.console-foot .meta { display: flex; gap: 14px; }
.copy {
  background: var(--surface); border: 1px solid var(--border);
  color: var(--text-dim); padding: 6px 12px; cursor: pointer;
  font-family: "Geist", sans-serif; font-size: 12px; font-weight: 500;
  border-radius: var(--r-pill);
  transition: all .2s;
}
.copy:hover { border-color: var(--violet); color: var(--text); background: rgba(124,92,255,0.1); }
.copy.copied { background: var(--mint); color: var(--bg-0); border-color: var(--mint); }

.logos-strip {
  padding: 32px 0;
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
}
.logos-strip .lbl {
  text-align: center;
  font-size: 12px; color: var(--text-mute);
  letter-spacing: 0.12em; text-transform: uppercase;
  margin-bottom: 20px;
}
.logos-row {
  display: flex; justify-content: center; align-items: center;
  flex-wrap: wrap;
  gap: clamp(28px, 5vw, 56px);
  opacity: 0.55;
}
.logos-row span {
  font-family: "Geist", sans-serif; font-weight: 600;
  font-size: clamp(16px, 1.6vw, 20px);
  color: var(--text-dim); letter-spacing: -0.01em;
  transition: color .2s, opacity .2s;
}
.logos-row span:hover { color: var(--text); }

.section { padding: clamp(72px, 10vw, 120px) 0; position: relative; }
.section-head {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
  gap: 40px;
  align-items: end;
  margin-bottom: 56px;
}
@media (max-width: 760px) { .section-head { grid-template-columns: 1fr; gap: 20px; } }
.section-tag {
  display: inline-block;
  font-size: 12px; font-weight: 500;
  color: var(--violet); text-transform: uppercase; letter-spacing: 0.12em;
  margin-bottom: 12px;
}
.section-title {
  font-family: "Geist", sans-serif;
  font-size: clamp(36px, 5vw, 64px);
  font-weight: 600; letter-spacing: -0.035em; line-height: 1.05;
}
.section-title em {
  font-style: italic; font-weight: 400;
  font-family: "Instrument Serif", serif;
  background: var(--grad-iri);
  -webkit-background-clip: text; background-clip: text;
  -webkit-text-fill-color: transparent;
}
.section-desc {
  color: var(--text-dim); max-width: 460px;
  font-size: 16px; line-height: 1.55;
}

.filters {
  display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 32px;
}
.chip {
  background: var(--surface); border: 1px solid var(--border);
  color: var(--text-dim);
  padding: 8px 16px;
  font-family: "Geist", sans-serif; font-size: 13px; font-weight: 500;
  border-radius: var(--r-pill);
  cursor: pointer; transition: all .2s;
}
.chip:hover { color: var(--text); background: var(--surface-2); border-color: var(--border-strong); }
.chip.active {
  background: var(--text); color: var(--bg-0); border-color: var(--text);
  font-weight: 600;
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
}
@media (max-width: 980px) { .grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 600px) { .grid { grid-template-columns: 1fr; } }

.card {
  perspective: 1400px;
  height: 320px;
  position: relative;
}
.card-inner {
  position: absolute; inset: 0;
  transition: transform .8s cubic-bezier(.22,1,.36,1);
  transform-style: preserve-3d;
}
.card.flipped .card-inner { transform: rotateY(180deg); }
.card-face {
  position: absolute; inset: 0;
  backface-visibility: hidden; -webkit-backface-visibility: hidden;
  background: linear-gradient(180deg, rgba(20,20,40,0.7), rgba(12,12,24,0.7));
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--border);
  border-radius: var(--r-lg);
  display: flex; flex-direction: column;
  padding: 22px;
  overflow: hidden;
  transition: border-color .25s, transform .25s, box-shadow .25s;
  cursor: pointer;
}
.card-face::before {
  content: ""; position: absolute; inset: 0;
  background: radial-gradient(circle at var(--mx, 50%) var(--my, 0%), rgba(124,92,255,0.18), transparent 50%);
  opacity: 0; transition: opacity .3s;
  pointer-events: none;
}
.card:hover .card-face.front { border-color: rgba(124,92,255,0.35); transform: translateY(-4px); box-shadow: 0 20px 60px -20px rgba(124,92,255,0.4); }
.card:hover .card-face.front::before { opacity: 1; }

.card-face.back {
  transform: rotateY(180deg);
  background: linear-gradient(180deg, rgba(28,20,60,0.85), rgba(20,12,40,0.85));
  border-color: rgba(124,92,255,0.35);
}

.card-cat {
  display: flex; align-items: center; justify-content: space-between;
  font-size: 11.5px; font-weight: 500;
  color: var(--text-mute); text-transform: uppercase; letter-spacing: 0.1em;
}
.badge {
  padding: 4px 10px; border-radius: var(--r-pill);
  font-size: 10.5px; font-weight: 600; letter-spacing: 0.04em;
  background: var(--grad-iri); color: white;
}
.badge.free {
  background: var(--surface-2); color: var(--text-dim);
  border: 1px solid var(--border);
}

.card-title {
  margin-top: auto;
  font-size: 24px; line-height: 1.1;
  font-weight: 600; letter-spacing: -0.02em;
}
.card-meta {
  margin-top: 12px;
  display: flex; align-items: center; justify-content: space-between;
  font-size: 12px; color: var(--text-mute);
}
.card-meta .price { color: var(--mint); font-weight: 600; font-family: "Geist Mono", monospace; }
.card-meta .price.pro {
  background: var(--grad-iri);
  -webkit-background-clip: text; background-clip: text;
  -webkit-text-fill-color: transparent;
}

.card-flip-hint {
  position: absolute; top: 22px; right: 22px;
  font-size: 11px; color: var(--text-mute);
  display: flex; align-items: center; gap: 6px;
  opacity: 0; transition: opacity .25s;
  pointer-events: none;
}
.card:hover .card-flip-hint { opacity: 1; }

.card-back-snippet {
  margin-top: 14px;
  font-family: "Geist Mono", monospace;
  font-size: 12px; line-height: 1.6;
  color: var(--text-dim);
  flex: 1;
  overflow: hidden;
}
.card-back-snippet .v {
  color: var(--cyan); background: rgba(34,211,238,0.1);
  padding: 0 4px; border-radius: 4px;
}
.card-back-foot {
  display: flex; gap: 8px; margin-top: 12px;
}
.card-back-foot .b {
  flex: 1;
  padding: 11px 14px;
  font-family: "Geist", sans-serif; font-size: 12px; font-weight: 600;
  border: 1px solid var(--border-strong); cursor: pointer;
  background: var(--surface-2); color: var(--text);
  border-radius: var(--r-pill);
  transition: all .2s;
}
.card-back-foot .b.alt {
  background: var(--grad-iri); border-color: transparent; color: white;
}
.card-back-foot .b:hover { transform: translateY(-1px); box-shadow: 0 8px 20px -8px rgba(124,92,255,0.5); }

.price-grid {
  display: grid; grid-template-columns: 1fr 1fr; gap: 18px;
}
@media (max-width: 760px) { .price-grid { grid-template-columns: 1fr; } }

.tier {
  padding: 36px clamp(24px, 3vw, 36px);
  background: linear-gradient(180deg, rgba(20,20,40,0.6), rgba(12,12,24,0.6));
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--border);
  border-radius: var(--r-xl);
  display: flex; flex-direction: column;
  position: relative;
  overflow: hidden;
}
.tier.featured {
  border: 1px solid transparent;
  background:
    linear-gradient(180deg, rgba(20,20,40,0.6), rgba(12,12,24,0.6)) padding-box,
    var(--grad-iri) border-box;
  box-shadow: 0 30px 80px -30px rgba(124,92,255,0.5);
}
.tier.featured::before {
  content: ""; position: absolute; top: -40%; right: -20%;
  width: 400px; height: 400px;
  background: radial-gradient(circle, rgba(124,92,255,0.25), transparent 60%);
  pointer-events: none;
}
.tier-flag {
  position: absolute; top: 18px; right: 18px;
  background: var(--grad-iri); color: white;
  padding: 4px 12px; border-radius: var(--r-pill);
  font-size: 11px; font-weight: 600; letter-spacing: 0.04em;
}
.tier-name {
  font-size: 13px; font-weight: 500;
  color: var(--text-dim); text-transform: uppercase; letter-spacing: 0.1em;
}
.tier-price {
  margin-top: 16px;
  font-size: clamp(56px, 7vw, 84px);
  line-height: 1; letter-spacing: -0.04em; font-weight: 600;
}
.tier.featured .tier-price {
  background: var(--grad-iri);
  -webkit-background-clip: text; background-clip: text;
  -webkit-text-fill-color: transparent;
}
.tier-price .per {
  font-size: 14px; font-weight: 500;
  margin-left: 8px; vertical-align: middle;
  color: var(--text-mute);
  -webkit-text-fill-color: var(--text-mute);
}
.tier-desc {
  margin-top: 12px; font-size: 15px; line-height: 1.55;
  color: var(--text-dim);
  max-width: 360px;
}
.tier-features {
  list-style: none; margin: 28px 0;
  display: flex; flex-direction: column; gap: 12px;
}
.tier-features li {
  display: flex; gap: 12px; align-items: flex-start;
  font-size: 14.5px; line-height: 1.45;
}
.tick {
  flex: 0 0 20px; width: 20px; height: 20px; margin-top: 1px;
  border-radius: 50%;
  background: var(--surface-2);
  color: var(--mint);
  display: grid; place-items: center;
  font-size: 11px; font-weight: 700;
  border: 1px solid var(--border);
}
.tier.featured .tick {
  background: var(--grad-iri); color: white; border-color: transparent;
}
.tier-cta {
  margin-top: auto;
  display: inline-flex; align-items: center; justify-content: center; gap: 10px;
  padding: 16px 22px;
  font-family: "Geist", sans-serif; font-size: 15px;
  font-weight: 600;
  text-decoration: none; cursor: pointer;
  background: var(--surface-2); color: var(--text);
  border: 1px solid var(--border-strong);
  border-radius: var(--r-pill);
  transition: all .2s;
}
.tier.featured .tier-cta {
  background: var(--grad-iri); border-color: transparent; color: white;
  box-shadow: 0 12px 32px -8px rgba(124,92,255,0.6);
}
.tier-cta:hover { transform: translateY(-2px); }
.tier.featured .tier-cta:hover { box-shadow: 0 18px 48px -8px rgba(124,92,255,0.8); }

footer {
  padding: clamp(60px, 8vw, 100px) 0 32px;
  border-top: 1px solid var(--border);
  margin-top: 48px;
}
.footer-cta {
  background: linear-gradient(180deg, rgba(20,20,40,0.7), rgba(12,12,24,0.7));
  backdrop-filter: blur(16px);
  border: 1px solid var(--border);
  border-radius: var(--r-xl);
  padding: clamp(40px, 6vw, 72px) clamp(24px, 4vw, 56px);
  text-align: center;
  margin-bottom: 80px;
  position: relative;
  overflow: hidden;
}
.footer-cta::before {
  content: ""; position: absolute; inset: 0;
  background: radial-gradient(ellipse at 50% 100%, rgba(124,92,255,0.25), transparent 60%);
  pointer-events: none;
}
.footer-cta h3 {
  font-size: clamp(32px, 4.5vw, 56px);
  font-weight: 600; letter-spacing: -0.03em; line-height: 1.05;
  margin-bottom: 12px;
  position: relative;
}
.footer-cta h3 em {
  font-style: italic; font-weight: 400;
  font-family: "Instrument Serif", serif;
  background: var(--grad-iri);
  -webkit-background-clip: text; background-clip: text;
  -webkit-text-fill-color: transparent;
}
.footer-cta p {
  color: var(--text-dim); font-size: 16px;
  max-width: 480px; margin: 0 auto 28px;
  position: relative;
}
.footer-cta .btn { position: relative; }

.footer-cols {
  display: grid; grid-template-columns: 1.4fr 1fr 1fr 1fr; gap: 32px;
  padding-bottom: 32px;
}
@media (max-width: 760px) { .footer-cols { grid-template-columns: 1fr 1fr; } }
.footer-cols h4 {
  font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em;
  color: var(--text-mute); margin-bottom: 14px; font-weight: 500;
}
.footer-cols a {
  display: block; padding: 4px 0;
  color: var(--text-dim); text-decoration: none;
  font-size: 14px; transition: color .15s;
}
.footer-cols a:hover { color: var(--text); }
.footer-cols p { color: var(--text-dim); font-size: 14px; line-height: 1.6; max-width: 320px; }

.footer-base {
  display: flex; justify-content: space-between; align-items: center;
  padding-top: 24px;
  border-top: 1px solid var(--border);
  font-size: 12px;
  color: var(--text-mute);
}
@media (max-width: 600px) { .footer-base { flex-direction: column; gap: 12px; text-align: center; } }

.reveal { opacity: 0; transform: translateY(28px); transition: opacity .8s ease, transform .8s cubic-bezier(.22,1,.36,1); }
.reveal.in { opacity: 1; transform: translateY(0); }

::selection { background: rgba(124,92,255,0.4); color: white; }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
`;
