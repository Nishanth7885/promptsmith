'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

type NicheKey = 'saas' | 'edtech' | 'restaurant' | 'd2c' | 'yoga';

interface NicheCopy {
  key: NicheKey;
  label: string;
  emoji: string;
  brand: string;
  domain: string;
  hero: {
    eyebrow: string;
    h1: string;
    sub: string;
    primaryCta: string;
    secondaryCta: string;
    trust: string;
  };
  features: { title: string; body: string; emoji: string }[];
  pricing: {
    tiers: { name: string; price: string; tagline: string; bullets: string[]; highlight: boolean }[];
  };
  faq: { q: string; a: string }[];
  testimonials: { quote: string; name: string; role: string }[];
  cta: { headline: string; sub: string; button: string };
  brandVoice: { adjectives: string[]; sample: string };
  seo: { title: string; url: string; description: string };
  howItWorks: { step: string; title: string; body: string }[];
  footer: { columns: { heading: string; links: string[] }[]; tagline: string };
}

const NICHES: NicheCopy[] = [
  {
    key: 'saas',
    label: 'SaaS',
    emoji: '🛠️',
    brand: 'Loopback',
    domain: 'loopback.app',
    hero: {
      eyebrow: 'AUTOMATION FOR PMs',
      h1: 'Stop guessing what to ship next.',
      sub: 'See which features your top 5 customers need most — synced from Slack, Linear, and your CRM. Saves PM teams 6+ hours/week.',
      primaryCta: 'Start free trial — no card',
      secondaryCta: 'Watch 2-min demo',
      trust: 'Trusted by 1,200+ product teams · SOC 2 Type II',
    },
    features: [
      { emoji: '⚡', title: 'Auto-cluster requests', body: 'GPT groups 4,000+ tickets into themes in under a minute.' },
      { emoji: '🎯', title: 'Top-account weighting', body: 'Score features by ARR, not by who shouts loudest.' },
      { emoji: '🔁', title: 'Two-way Linear sync', body: 'Push prioritised epics straight into your sprint.' },
    ],
    pricing: {
      tiers: [
        {
          name: 'Starter',
          price: '$49/mo',
          tagline: 'For solo PMs',
          bullets: ['1 product', '500 requests/mo', 'Slack + Intercom'],
          highlight: false,
        },
        {
          name: 'Growth',
          price: '$199/mo',
          tagline: 'For 5-30 person teams',
          bullets: ['Unlimited products', 'CRM weighting', 'API + Linear sync'],
          highlight: true,
        },
      ],
    },
    faq: [
      { q: 'Do you train on our customer data?', a: 'Never. Your tickets stay in a dedicated tenant; we never train shared models on them.' },
      { q: 'How long does setup take?', a: '12 minutes for the average team — Slack, Linear, and HubSpot connect with one click each.' },
    ],
    testimonials: [
      { quote: 'We killed two roadmap items in week one. They had loud voices but only $14k ARR behind them.', name: 'Priya K.', role: 'Head of Product, Fingate' },
      { quote: 'My PM standup went from 90 min to 25 min. The clustering is uncanny.', name: 'Marcus L.', role: 'Sr. PM, Verte Cloud' },
    ],
    cta: { headline: 'Ship the right thing next sprint.', sub: 'Free for 14 days. Cancel any time.', button: 'Connect Slack & start' },
    brandVoice: { adjectives: ['Direct', 'Data-led', 'PM-native'], sample: 'We don\'t do "synergy". We do "your top 10 accounts asked for this 47 times last quarter."' },
    seo: {
      title: 'Loopback — Customer feedback intelligence for PMs',
      url: 'https://loopback.app',
      description: 'Auto-cluster Slack, Intercom, and CRM feedback into a weighted roadmap. Used by 1,200+ B2B SaaS teams.',
    },
    howItWorks: [
      { step: '01', title: 'Connect your stack', body: 'Slack, Intercom, Linear, HubSpot — one click each.' },
      { step: '02', title: 'See the themes', body: 'Loopback clusters every signal into ranked feature themes.' },
      { step: '03', title: 'Sync to roadmap', body: 'Push the top three into Linear with full source-tickets attached.' },
    ],
    footer: {
      columns: [
        { heading: 'Product', links: ['Pricing', 'Changelog', 'API'] },
        { heading: 'Company', links: ['About', 'Careers', 'Press'] },
        { heading: 'Legal', links: ['Privacy', 'Terms', 'DPA'] },
      ],
      tagline: '© Loopback Labs Inc. Built in Bengaluru + Berlin.',
    },
  },
  {
    key: 'edtech',
    label: 'EdTech',
    emoji: '🎓',
    brand: 'Mathlight',
    domain: 'mathlight.in',
    hero: {
      eyebrow: 'CLASS 9–12 · CBSE & ICSE',
      h1: 'Math, finally explained the way it clicks for your kid.',
      sub: 'Live small-group classes with IIT-trained tutors. 6 students max. Doubt-clearing on WhatsApp. Plans from ₹1,499/mo.',
      primaryCta: 'Book a free trial class',
      secondaryCta: 'See sample lesson',
      trust: 'Loved by 18,400+ parents · 4.8★ on Google',
    },
    features: [
      { emoji: '👩‍🏫', title: 'Live, not recorded', body: 'Real teachers, real questions, real chalk-and-talk on a digital board.' },
      { emoji: '📱', title: 'WhatsApp doubt help', body: 'Stuck on a sum at 10pm? Photograph it. We answer in under 20 minutes.' },
      { emoji: '📊', title: 'Weekly parent report', body: 'Concept-wise mastery scores so you see exactly where the gaps are.' },
    ],
    pricing: {
      tiers: [
        {
          name: 'Group',
          price: '₹1,499/mo',
          tagline: '6 students per class',
          bullets: ['3 classes/week', 'Weekly report', 'WhatsApp doubts'],
          highlight: false,
        },
        {
          name: '1-on-1',
          price: '₹4,999/mo',
          tagline: 'Personal tutor',
          bullets: ['Daily 1-on-1', 'Custom syllabus', 'Mock test bank'],
          highlight: true,
        },
      ],
    },
    faq: [
      { q: 'What if my child misses a class?', a: 'Every session is recorded with timestamped doubt-clears. Watch back any time during your subscription.' },
      { q: 'Is this for boards or JEE prep?', a: 'Both — we run separate batches for boards-only and boards-plus-JEE. Choose during onboarding.' },
    ],
    testimonials: [
      { quote: 'My daughter went from 62 to 91 in two terms. The weekly report showed exactly what to revise.', name: 'Sunita R.', role: 'Parent, Class 10 · Pune' },
      { quote: 'Sir explains so calmly that I stopped panicking before tests.', name: 'Aarav M.', role: 'Student, Class 11 · Delhi' },
    ],
    cta: { headline: 'Try one class. No payment until you love it.', sub: 'Trial classes happen Mon–Sat at 5pm IST.', button: 'Book free trial' },
    brandVoice: { adjectives: ['Warm', 'Parent-first', 'No-jargon'], sample: 'We don\'t say "synchronous learning". We say "live class — your child can raise their hand."' },
    seo: {
      title: 'Mathlight — Live online math classes for Class 9–12 (CBSE/ICSE)',
      url: 'https://mathlight.in',
      description: 'Small-group live math tuitions with IIT-trained teachers. Plans from ₹1,499/mo. Free trial class available.',
    },
    howItWorks: [
      { step: '01', title: 'Book a free trial', body: 'Pick a slot, share your child\'s class & board.' },
      { step: '02', title: 'Meet the teacher', body: '45-min live class. Your child asks questions, we listen.' },
      { step: '03', title: 'Choose a plan', body: 'Continue group or upgrade to 1-on-1. Cancel anytime.' },
    ],
    footer: {
      columns: [
        { heading: 'Classes', links: ['Class 9', 'Class 10', 'Class 11', 'Class 12'] },
        { heading: 'For parents', links: ['How it works', 'Pricing', 'Reviews'] },
        { heading: 'Help', links: ['Contact', 'Refund policy', 'WhatsApp us'] },
      ],
      tagline: '© Mathlight Education Pvt. Ltd. Made with ♥ in Bengaluru.',
    },
  },
  {
    key: 'restaurant',
    label: 'Restaurant',
    emoji: '🍜',
    brand: 'Banshi & Co.',
    domain: 'banshiandco.com',
    hero: {
      eyebrow: 'CHEF\'S TABLE · BANDRA',
      h1: 'Eight courses. Twelve seats. One unforgettable Tuesday.',
      sub: 'Chef Banshi\'s seasonal tasting menu — sourced from the Konkan coast and the farms we\'ve cooked with for ten years. Reservations open Mondays at noon.',
      primaryCta: 'Reserve a seat',
      secondaryCta: 'See this week\'s menu',
      trust: 'Featured in Condé Nast Traveller · Eater Mumbai\'s Best of 2025',
    },
    features: [
      { emoji: '🐟', title: 'Coast to plate in 18hrs', body: 'Daily catch from Sindhudurg, on your fork the next evening.' },
      { emoji: '🌾', title: '6 farms, no middlemen', body: 'Vegetables we\'ve farmed-to-table since 2015 — you can visit them.' },
      { emoji: '🍷', title: 'Pairing by sommelier', body: 'Optional Indian wine flight from a 90+ bottle cellar.' },
    ],
    pricing: {
      tiers: [
        {
          name: 'Tasting menu',
          price: '₹4,800/guest',
          tagline: '8 courses',
          bullets: ['Welcome drink', 'Seasonal pacing', 'Chef\'s greeting'],
          highlight: false,
        },
        {
          name: 'With pairing',
          price: '₹7,200/guest',
          tagline: '8 courses + 5 pours',
          bullets: ['Indian wine flight', 'Sommelier table-side', 'Take-home note card'],
          highlight: true,
        },
      ],
    },
    faq: [
      { q: 'Is the menu vegetarian-friendly?', a: 'Yes — flag preferences when booking and Chef will rebuild the entire 8-course flow around vegetables. No surcharge.' },
      { q: 'Can we celebrate a birthday here?', a: 'We do, gladly. Mention it in the booking notes; we\'ll send out a small chef-signed dessert at course six.' },
    ],
    testimonials: [
      { quote: 'The kokum sorbet between courses four and five made me cry. I am not a person who cries.', name: 'Nikita S.', role: 'Diner · March 2025' },
      { quote: 'Best ₹4,800 I have ever spent on dinner in this city.', name: 'Rohan A.', role: 'Diner · February 2025' },
    ],
    cta: { headline: 'Tuesdays book out by Wednesday morning.', sub: 'Get the reservation link the moment it goes live.', button: 'Join the Monday list' },
    brandVoice: { adjectives: ['Quiet', 'Honest', 'Coastal'], sample: 'We don\'t call it "elevated cuisine". We call it dinner cooked the way Chef\'s grandmother would, if she had a sommelier.' },
    seo: {
      title: 'Banshi & Co. — Konkan coast tasting menu in Bandra, Mumbai',
      url: 'https://banshiandco.com',
      description: 'An 8-course chef\'s tasting menu featuring Konkan coast seafood and partner-farm produce. 12 seats, Tuesdays only. Reserve from Mondays at noon IST.',
    },
    howItWorks: [
      { step: '01', title: 'Join the Monday list', body: 'We text you the booking link the second seats open.' },
      { step: '02', title: 'Reserve in seconds', body: 'Pick 1–4 seats. Confirm dietary notes. Pay 50% to hold.' },
      { step: '03', title: 'Show up hungry', body: 'Arrive 7:30pm. We pour something cold. Then 8 courses begin.' },
    ],
    footer: {
      columns: [
        { heading: 'Visit', links: ['Address', 'Reservations', 'Private dining'] },
        { heading: 'About', links: ['Chef Banshi', 'Our farms', 'Press'] },
        { heading: 'Stay in touch', links: ['Newsletter', 'Instagram', 'WhatsApp'] },
      ],
      tagline: '© Banshi & Co. · Linking Road · Bandra West · Mumbai 400050',
    },
  },
  {
    key: 'd2c',
    label: 'D2C Brand',
    emoji: '🛍️',
    brand: 'Gondola',
    domain: 'gondola.co',
    hero: {
      eyebrow: 'VEG-TANNED LEATHER · ITALY → INDIA',
      h1: 'A wallet that ages better than your Instagram aesthetic.',
      sub: 'Hand-stitched in Florence with full-grain leather we cure ourselves. Lifetime free repair. Free 14-day try-on.',
      primaryCta: 'Shop the bifold — ₹3,200',
      secondaryCta: 'How we make it',
      trust: '8,300+ wallets shipped · 4.9★ verified reviews',
    },
    features: [
      { emoji: '🇮🇹', title: 'Florence-stitched', body: 'Each wallet hand-stitched by a 3-person atelier outside Florence.' },
      { emoji: '♻️', title: 'Lifetime free repair', body: 'Stitching loose? Edge worn? Send it back. We repair, no questions.' },
      { emoji: '📦', title: '14-day home try-on', body: 'Touch it, pocket it, walk around. Don\'t love it? Free return label.' },
    ],
    pricing: {
      tiers: [
        {
          name: 'The Bifold',
          price: '₹3,200',
          tagline: 'Six card slots',
          bullets: ['Veg-tanned hide', 'Hand-stitched', 'Lifetime repair'],
          highlight: true,
        },
        {
          name: 'The Cardholder',
          price: '₹2,100',
          tagline: 'Four card slots',
          bullets: ['Slim profile', 'Single fold', 'Lifetime repair'],
          highlight: false,
        },
      ],
    },
    faq: [
      { q: 'Will it scratch?', a: 'Yes — and that\'s the point. Veg-tanned leather develops a patina that maps your life: train tickets, coat pockets, coffee. It only gets better.' },
      { q: 'Do you ship outside India?', a: 'We ship to 14 countries. International orders are duty-paid at checkout — no surprise fees on your doorstep.' },
    ],
    testimonials: [
      { quote: 'Three years in, mine looks like a small leather book of memories. I will never buy another wallet.', name: 'Vivaan P.', role: 'Verified buyer · Bengaluru' },
      { quote: 'Stitching came loose at year two. They fixed it free in 8 days. That is the entire pitch.', name: 'Maya T.', role: 'Verified buyer · Pune' },
    ],
    cta: { headline: 'Carry one wallet for the next ten years.', sub: 'Free shipping over ₹2,000. Free returns, always.', button: 'Shop the Bifold' },
    brandVoice: { adjectives: ['Slow', 'Tactile', 'Confident'], sample: 'We don\'t say "premium leather goods". We say "we cure the hide ourselves and we sign every wallet."' },
    seo: {
      title: 'Gondola — Hand-stitched leather wallets from Florence',
      url: 'https://gondola.co',
      description: 'Veg-tanned, full-grain leather wallets hand-stitched in a 3-person Florence atelier. Lifetime free repair. Free 14-day try-on in India.',
    },
    howItWorks: [
      { step: '01', title: 'Pick a piece', body: 'Bifold or cardholder. Four leather colours.' },
      { step: '02', title: 'Try it for 14 days', body: 'In-pocket, in-coat, in-real-life. Hate it? Free return.' },
      { step: '03', title: 'Carry it forever', body: 'Stitching loose? Send it. We repair free, for life.' },
    ],
    footer: {
      columns: [
        { heading: 'Shop', links: ['Bifold', 'Cardholder', 'Gift card'] },
        { heading: 'Care', links: ['Repair program', 'Leather guide', 'Returns'] },
        { heading: 'Brand', links: ['Our atelier', 'Story', 'Journal'] },
      ],
      tagline: '© Gondola Goods Pvt. Ltd. · Made in Florence · Sold from Mumbai.',
    },
  },
  {
    key: 'yoga',
    label: 'Yoga Studio',
    emoji: '🧘',
    brand: 'Anhad',
    domain: 'anhad.studio',
    hero: {
      eyebrow: 'ASHTANGA · INDIRANAGAR',
      h1: 'A morning practice you actually look forward to.',
      sub: '60-minute Mysore-style Ashtanga, 6 days a week, in a sunlit shala. Beginners welcome. First class on us.',
      primaryCta: 'Claim free first class',
      secondaryCta: 'See class schedule',
      trust: 'Established 2018 · 480 monthly practitioners',
    },
    features: [
      { emoji: '☀️', title: '6am to 9am, every weekday', body: 'Roll in any time in the window. Practise at your own count.' },
      { emoji: '🧑‍🏫', title: 'Two senior teachers, always present', body: 'Adjustments and modifications, never barked instructions.' },
      { emoji: '🌱', title: 'No mirrors, no music', body: 'Just breath, mat, and the sound of the city waking up.' },
    ],
    pricing: {
      tiers: [
        {
          name: 'Drop-in',
          price: '₹650/class',
          tagline: 'Single morning',
          bullets: ['Any weekday', 'No commitment', 'Mat provided'],
          highlight: false,
        },
        {
          name: 'Monthly unlimited',
          price: '₹4,800/mo',
          tagline: 'All 26 classes',
          bullets: ['Unlimited mornings', 'Free workshops', 'Mat storage'],
          highlight: true,
        },
      ],
    },
    faq: [
      { q: 'I have never done yoga. Is Mysore the right starting point?', a: 'It\'s actually the gentlest entry: you learn one posture at a time, at your own pace. We start every beginner with 6 postures and build from there.' },
      { q: 'Do you have changing rooms and showers?', a: 'Yes — two changing rooms and two hot showers. We provide towels for monthly members.' },
    ],
    testimonials: [
      { quote: 'I have tried four studios in this city. This is the only one I show up to at 6am, in the rain.', name: 'Aanya G.', role: 'Practitioner since 2023' },
      { quote: 'No music, no instagram class. Just breath. I sleep better.', name: 'Karan V.', role: 'Practitioner since 2024' },
    ],
    cta: { headline: 'Try one morning. We promise nothing.', sub: 'First class is free. Walk in any weekday between 6 and 9am.', button: 'Book free first class' },
    brandVoice: { adjectives: ['Still', 'Honest', 'Unhurried'], sample: 'We don\'t say "transformative wellness journey". We say "come on Tuesday, we\'ll show you sun salutation A."' },
    seo: {
      title: 'Anhad — Mysore-style Ashtanga shala in Indirangar, Bengaluru',
      url: 'https://anhad.studio',
      description: 'A traditional 6-day-a-week morning Mysore Ashtanga shala in Indiranagar. Beginners welcome. First class free. Monthly unlimited from ₹4,800.',
    },
    howItWorks: [
      { step: '01', title: 'Walk in any weekday', body: 'Between 6 and 9am. We give you a mat.' },
      { step: '02', title: 'Learn 6 postures', body: 'Senior teacher walks you through, at your pace.' },
      { step: '03', title: 'Come back tomorrow', body: 'Add one posture each visit. Build your own practice.' },
    ],
    footer: {
      columns: [
        { heading: 'Practice', links: ['Schedule', 'Pricing', 'Workshops'] },
        { heading: 'Studio', links: ['Teachers', 'Visit us', 'Photos'] },
        { heading: 'Connect', links: ['Newsletter', 'Instagram', 'Email us'] },
      ],
      tagline: '© Anhad Yoga Shala · 12th Main · Indiranagar · Bengaluru 560038',
    },
  },
];

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
          Pick a niche. Scroll the page. The browser frame below shows what Claude generates with that pack — hero to footer.
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
            <div className="mx-auto flex max-w-md items-center gap-2 rounded-md bg-white px-3 py-1 text-[11px] text-slate-500 ring-1 ring-slate-200">
              <span aria-hidden>🔒</span>
              <span className="truncate">{active.domain}</span>
            </div>
            <div className="w-12" />
          </div>

          {/* Inner viewport (scrolls via parallax) */}
          <div
            ref={innerScrollRef}
            className="h-[440px] overflow-hidden bg-white sm:h-[520px]"
          >
            <InnerLanding niche={active} />
          </div>
        </div>
        <p className="mt-3 text-center text-[11px] text-slate-400">
          Scroll the page — the browser frame scrolls itself.
        </p>
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
