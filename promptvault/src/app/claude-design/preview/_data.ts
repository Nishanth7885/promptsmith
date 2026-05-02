// Niche copy + per-niche theme tokens. Used by the in-page browser-frame
// demo (claude-design/PreviewClient) AND the standalone full-page experiences
// at /claude-design/preview/[niche].

export type NicheKey = 'saas' | 'edtech' | 'restaurant' | 'd2c' | 'yoga';

export interface NicheCopy {
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
  // Extra copy used only by the standalone full-page experience.
  full: {
    heroBadge: string;
    statline: { num: string; label: string }[];
    featureHeadline: string;
    featureSub: string;
    howSub: string;
    testimonialsHeadline: string;
    pricingHeadline: string;
    pricingSub: string;
    faqHeadline: string;
    voiceHeadline: string;
    finalCtaSub: string;
    logos: string[];
    marquee: string[];
  };
}

export const NICHES: NicheCopy[] = [
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
        { name: 'Starter', price: '$49/mo', tagline: 'For solo PMs', bullets: ['1 product', '500 requests/mo', 'Slack + Intercom'], highlight: false },
        { name: 'Growth', price: '$199/mo', tagline: 'For 5-30 person teams', bullets: ['Unlimited products', 'CRM weighting', 'API + Linear sync'], highlight: true },
      ],
    },
    faq: [
      { q: 'Do you train on our customer data?', a: 'Never. Your tickets stay in a dedicated tenant; we never train shared models on them.' },
      { q: 'How long does setup take?', a: '12 minutes for the average team — Slack, Linear, and HubSpot connect with one click each.' },
      { q: 'Is there a free trial?', a: '14 days, no credit card. Connect your tools, see the clustered roadmap, decide after.' },
      { q: 'What if our feedback is in 3 languages?', a: 'We auto-translate and cluster across English, Spanish, French, German, Hindi, Japanese — no extra setup.' },
    ],
    testimonials: [
      { quote: 'We killed two roadmap items in week one. They had loud voices but only $14k ARR behind them.', name: 'Priya K.', role: 'Head of Product, Fingate' },
      { quote: 'My PM standup went from 90 min to 25 min. The clustering is uncanny.', name: 'Marcus L.', role: 'Sr. PM, Verte Cloud' },
      { quote: 'Loopback paid for itself in week three. We shipped the right thing for the first time in a year.', name: 'Hana T.', role: 'VP Product, Threadline' },
    ],
    cta: { headline: 'Ship the right thing next sprint.', sub: 'Free for 14 days. Cancel any time.', button: 'Connect Slack & start' },
    brandVoice: {
      adjectives: ['Direct', 'Data-led', 'PM-native'],
      sample: 'We don\'t do "synergy". We do "your top 10 accounts asked for this 47 times last quarter."',
    },
    seo: {
      title: 'Loopback — Customer feedback intelligence for PMs',
      url: 'https://loopback.app',
      description: 'Auto-cluster Slack, Intercom, and CRM feedback into a weighted roadmap. Used by 1,200+ B2B SaaS teams.',
    },
    howItWorks: [
      { step: '01', title: 'Connect your stack', body: 'Slack, Intercom, Linear, HubSpot — one click each. 12 minutes for the average team.' },
      { step: '02', title: 'See the themes', body: 'Loopback clusters every signal into ranked feature themes, weighted by ARR.' },
      { step: '03', title: 'Sync to roadmap', body: 'Push the top three into Linear with full source-tickets attached as context.' },
    ],
    footer: {
      columns: [
        { heading: 'Product', links: ['Pricing', 'Changelog', 'API', 'Integrations'] },
        { heading: 'Company', links: ['About', 'Careers', 'Press', 'Security'] },
        { heading: 'Legal', links: ['Privacy', 'Terms', 'DPA', 'Status'] },
      ],
      tagline: '© Loopback Labs Inc. Built in Bengaluru + Berlin.',
    },
    full: {
      heroBadge: 'NEW · Linear integration v2 just shipped',
      statline: [
        { num: '1,200+', label: 'product teams' },
        { num: '6.4 hrs', label: 'saved per PM, per week' },
        { num: '4.9★', label: 'G2 rating · 312 reviews' },
        { num: 'SOC 2', label: 'Type II compliant' },
      ],
      featureHeadline: 'The roadmap engine for PMs who hate roadmap meetings.',
      featureSub: 'Three connected workflows. One source of truth. Zero spreadsheets.',
      howSub: 'From a tangle of Slack DMs to a ranked, sourced roadmap — in twelve minutes.',
      testimonialsHeadline: 'PMs who got their afternoons back.',
      pricingHeadline: 'Pay for value, not seats.',
      pricingSub: 'No per-user nonsense. One flat fee. Your whole team in.',
      faqHeadline: 'Things every PM lead asks.',
      voiceHeadline: 'How we sound, on purpose.',
      finalCtaSub: 'Connect your stack. See the themes. Ship the right thing. 14 days, no card.',
      logos: ['Fingate', 'Verte Cloud', 'Threadline', 'NorthAxis', 'Pricewell', 'Glasshouse'],
      marquee: ['Slack', 'Linear', 'Intercom', 'HubSpot', 'Salesforce', 'Notion', 'Zendesk', 'Front'],
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
        { name: 'Group', price: '₹1,499/mo', tagline: '6 students per class', bullets: ['3 classes/week', 'Weekly report', 'WhatsApp doubts'], highlight: false },
        { name: '1-on-1', price: '₹4,999/mo', tagline: 'Personal tutor', bullets: ['Daily 1-on-1', 'Custom syllabus', 'Mock test bank'], highlight: true },
      ],
    },
    faq: [
      { q: 'What if my child misses a class?', a: 'Every session is recorded with timestamped doubt-clears. Watch back any time during your subscription.' },
      { q: 'Is this for boards or JEE prep?', a: 'Both — we run separate batches for boards-only and boards-plus-JEE. Choose during onboarding.' },
      { q: 'Who are the teachers?', a: 'IIT alumni who teach for a living, not undergrads doing it part-time. Average of 7 years\' tutoring experience.' },
      { q: 'Will the teacher know my child by name?', a: 'Six children per class. By week two, your child will know the teacher and three classmates by first name.' },
    ],
    testimonials: [
      { quote: 'My daughter went from 62 to 91 in two terms. The weekly report showed exactly what to revise.', name: 'Sunita R.', role: 'Parent, Class 10 · Pune' },
      { quote: 'Sir explains so calmly that I stopped panicking before tests.', name: 'Aarav M.', role: 'Student, Class 11 · Delhi' },
      { quote: 'I checked the WhatsApp at 11:14pm. They had answered at 11:09. That\'s the whole pitch.', name: 'Rohit B.', role: 'Parent, Class 9 · Mumbai' },
    ],
    cta: { headline: 'Try one class. No payment until you love it.', sub: 'Trial classes happen Mon–Sat at 5pm IST.', button: 'Book free trial' },
    brandVoice: {
      adjectives: ['Warm', 'Parent-first', 'No-jargon'],
      sample: 'We don\'t say "synchronous learning". We say "live class — your child can raise their hand."',
    },
    seo: {
      title: 'Mathlight — Live online math classes for Class 9–12 (CBSE/ICSE)',
      url: 'https://mathlight.in',
      description: 'Small-group live math tuitions with IIT-trained teachers. Plans from ₹1,499/mo. Free trial class available.',
    },
    howItWorks: [
      { step: '01', title: 'Book a free trial', body: 'Pick a slot, share your child\'s class & board. We pair them with a teacher.' },
      { step: '02', title: 'Meet the teacher', body: '45-min live class. Your child asks questions. We listen first, talk second.' },
      { step: '03', title: 'Choose a plan', body: 'Continue with the group or upgrade to 1-on-1. Cancel anytime, no questions.' },
    ],
    footer: {
      columns: [
        { heading: 'Classes', links: ['Class 9', 'Class 10', 'Class 11', 'Class 12'] },
        { heading: 'For parents', links: ['How it works', 'Pricing', 'Reviews', 'Sample lesson'] },
        { heading: 'Help', links: ['Contact', 'Refund policy', 'WhatsApp us', 'Centre tour'] },
      ],
      tagline: '© Mathlight Education Pvt. Ltd. Made with ♥ in Bengaluru.',
    },
    full: {
      heroBadge: 'NEW · Term 2 batches now open · 12 seats left',
      statline: [
        { num: '18,400+', label: 'parents trust us' },
        { num: '4.8★', label: 'across 2,300 Google reviews' },
        { num: '+27 marks', label: 'avg. board improvement' },
        { num: '20 min', label: 'avg. WhatsApp doubt response' },
      ],
      featureHeadline: 'Tuition that actually feels like teaching.',
      featureSub: 'Six students per class. Two senior teachers. Zero generic worksheets.',
      howSub: 'From "scared of math" to "asks for harder problems" — in eight weeks.',
      testimonialsHeadline: 'Parents who stopped worrying. Students who started raising hands.',
      pricingHeadline: 'Family-friendly pricing. No hidden books fee.',
      pricingSub: 'Switch tiers any time. Refund pro-rata if you leave mid-term.',
      faqHeadline: 'Questions parents always ask.',
      voiceHeadline: 'How we talk to parents.',
      finalCtaSub: 'A free trial class. A real teacher. Your child gets to ask anything. Then you decide.',
      logos: ['CBSE-aligned', 'ICSE-aligned', 'JEE Mains track', 'NEET ready', 'NTSE prep', 'Olympiad'],
      marquee: ['Algebra', 'Geometry', 'Trigonometry', 'Calculus', 'Probability', 'Coordinate', 'Vectors', 'Statistics'],
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
        { name: 'Tasting menu', price: '₹4,800/guest', tagline: '8 courses', bullets: ['Welcome drink', 'Seasonal pacing', 'Chef\'s greeting'], highlight: false },
        { name: 'With pairing', price: '₹7,200/guest', tagline: '8 courses + 5 pours', bullets: ['Indian wine flight', 'Sommelier table-side', 'Take-home note card'], highlight: true },
      ],
    },
    faq: [
      { q: 'Is the menu vegetarian-friendly?', a: 'Yes — flag preferences when booking and Chef will rebuild the entire 8-course flow around vegetables. No surcharge.' },
      { q: 'Can we celebrate a birthday here?', a: 'We do, gladly. Mention it in the booking notes; we\'ll send out a small chef-signed dessert at course six.' },
      { q: 'How long is the meal?', a: 'About two and a half hours. We pace courses so the table stays in conversation, not waiting.' },
      { q: 'Do you accommodate allergies?', a: 'Tell us at booking. Chef rebuilds the menu, not just the offending dish — flavour balance matters.' },
    ],
    testimonials: [
      { quote: 'The kokum sorbet between courses four and five made me cry. I am not a person who cries.', name: 'Nikita S.', role: 'Diner · March 2025' },
      { quote: 'Best ₹4,800 I have ever spent on dinner in this city.', name: 'Rohan A.', role: 'Diner · February 2025' },
      { quote: 'Chef came to our table to explain the malvani prawn course. We didn\'t need explanation. We just needed more.', name: 'Tara D.', role: 'Diner · April 2025' },
    ],
    cta: { headline: 'Tuesdays book out by Wednesday morning.', sub: 'Get the reservation link the moment it goes live.', button: 'Join the Monday list' },
    brandVoice: {
      adjectives: ['Quiet', 'Honest', 'Coastal'],
      sample: 'We don\'t call it "elevated cuisine". We call it dinner cooked the way Chef\'s grandmother would, if she had a sommelier.',
    },
    seo: {
      title: 'Banshi & Co. — Konkan coast tasting menu in Bandra, Mumbai',
      url: 'https://banshiandco.com',
      description: 'An 8-course chef\'s tasting menu featuring Konkan coast seafood and partner-farm produce. 12 seats, Tuesdays only. Reserve from Mondays at noon IST.',
    },
    howItWorks: [
      { step: '01', title: 'Join the Monday list', body: 'We text you the booking link the second seats open. No spam, just the link.' },
      { step: '02', title: 'Reserve in seconds', body: 'Pick 1–4 seats. Confirm dietary notes. Pay 50% to hold the reservation.' },
      { step: '03', title: 'Show up hungry', body: 'Arrive 7:30pm. We pour something cold. Then eight courses begin, slowly.' },
    ],
    footer: {
      columns: [
        { heading: 'Visit', links: ['Address', 'Reservations', 'Private dining', 'Hours'] },
        { heading: 'About', links: ['Chef Banshi', 'Our farms', 'Press', 'Sommelier'] },
        { heading: 'Stay in touch', links: ['Newsletter', 'Instagram', 'WhatsApp', 'Email'] },
      ],
      tagline: '© Banshi & Co. · Linking Road · Bandra West · Mumbai 400050',
    },
    full: {
      heroBadge: 'TUESDAY · 22 OCT · TWO SEATS LEFT',
      statline: [
        { num: '12', label: 'seats per service' },
        { num: '8', label: 'seasonal courses' },
        { num: '6', label: 'partner farms' },
        { num: '90+', label: 'Indian wine cellar' },
      ],
      featureHeadline: 'A Tuesday dinner ten years in the making.',
      featureSub: 'Source it ourselves. Cook it slowly. Pour something honest. Repeat next week.',
      howSub: 'From a Monday alert to your seat at the chef\'s table — in three quiet steps.',
      testimonialsHeadline: 'What people whisper to each other on the way home.',
      pricingHeadline: 'One menu. Two ways to drink to it.',
      pricingSub: 'Tasting menu pricing is inclusive of taxes. Pairing is optional, and excellent.',
      faqHeadline: 'The questions we love being asked.',
      voiceHeadline: 'How we talk about food — and don\'t.',
      finalCtaSub: 'We open the booking link at noon, Monday. By Tuesday afternoon it\'s usually gone.',
      logos: ['Condé Nast Traveller', 'Eater Mumbai', 'GQ India', 'Vogue', 'The Hindu', 'BBC Travel'],
      marquee: ['Konkan', 'Malvani', 'Goa', 'Sindhudurg', 'Alibaug', 'Maharashtra coast', 'Anjuna', 'Karwar'],
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
        { name: 'The Bifold', price: '₹3,200', tagline: 'Six card slots', bullets: ['Veg-tanned hide', 'Hand-stitched', 'Lifetime repair'], highlight: true },
        { name: 'The Cardholder', price: '₹2,100', tagline: 'Four card slots', bullets: ['Slim profile', 'Single fold', 'Lifetime repair'], highlight: false },
      ],
    },
    faq: [
      { q: 'Will it scratch?', a: 'Yes — and that\'s the point. Veg-tanned leather develops a patina that maps your life: train tickets, coat pockets, coffee. It only gets better.' },
      { q: 'Do you ship outside India?', a: 'We ship to 14 countries. International orders are duty-paid at checkout — no surprise fees on your doorstep.' },
      { q: 'How does the lifetime repair work?', a: 'Send it to our Mumbai studio. We assess. Most repairs ship back free in 8–12 days. Always.' },
      { q: 'What\'s "veg-tanned"?', a: 'A 30-day natural tanning process using tree bark, not chrome. Slower, kinder, and the only kind that develops a real patina.' },
    ],
    testimonials: [
      { quote: 'Three years in, mine looks like a small leather book of memories. I will never buy another wallet.', name: 'Vivaan P.', role: 'Verified buyer · Bengaluru' },
      { quote: 'Stitching came loose at year two. They fixed it free in 8 days. That is the entire pitch.', name: 'Maya T.', role: 'Verified buyer · Pune' },
      { quote: 'I returned it on day 13 and they refunded same day. I bought it again two months later, on purpose.', name: 'Karan V.', role: 'Verified buyer · Delhi' },
    ],
    cta: { headline: 'Carry one wallet for the next ten years.', sub: 'Free shipping over ₹2,000. Free returns, always.', button: 'Shop the Bifold' },
    brandVoice: {
      adjectives: ['Slow', 'Tactile', 'Confident'],
      sample: 'We don\'t say "premium leather goods". We say "we cure the hide ourselves and we sign every wallet."',
    },
    seo: {
      title: 'Gondola — Hand-stitched leather wallets from Florence',
      url: 'https://gondola.co',
      description: 'Veg-tanned, full-grain leather wallets hand-stitched in a 3-person Florence atelier. Lifetime free repair. Free 14-day try-on in India.',
    },
    howItWorks: [
      { step: '01', title: 'Pick a piece', body: 'Bifold or cardholder. Four leather colours. Each signed by the maker.' },
      { step: '02', title: 'Try it for 14 days', body: 'In-pocket, in-coat, in-real-life. Hate it? Free return label, no email.' },
      { step: '03', title: 'Carry it forever', body: 'Stitching loose? Edge worn? Send it. We repair free, for life. Always.' },
    ],
    footer: {
      columns: [
        { heading: 'Shop', links: ['Bifold', 'Cardholder', 'Gift card', 'New colours'] },
        { heading: 'Care', links: ['Repair program', 'Leather guide', 'Returns', 'Patina album'] },
        { heading: 'Brand', links: ['Our atelier', 'Story', 'Journal', 'Press'] },
      ],
      tagline: '© Gondola Goods Pvt. Ltd. · Made in Florence · Sold from Mumbai.',
    },
    full: {
      heroBadge: 'NEW · Conker brown is back in the bifold',
      statline: [
        { num: '8,300+', label: 'wallets shipped' },
        { num: '4.9★', label: 'across verified reviews' },
        { num: '14 days', label: 'home try-on' },
        { num: 'Lifetime', label: 'free repair' },
      ],
      featureHeadline: 'A wallet, made the slow way.',
      featureSub: 'Three things we do that no one else bothers with — and why each matters.',
      howSub: 'From the atelier in Florence to your back pocket — three steps, zero hurry.',
      testimonialsHeadline: 'What our buyers said, two years later.',
      pricingHeadline: 'Two pieces. One forever.',
      pricingSub: 'No subscriptions, no upsells. Buy once, repair free, carry for years.',
      faqHeadline: 'Things people email us before buying.',
      voiceHeadline: 'How we talk about leather.',
      finalCtaSub: 'Carry one wallet that gets better, not worse. We mean that very literally.',
      logos: ['Vogue India', 'GQ', 'Architectural Digest', 'Conde Nast', 'The Hindu', 'Mid-Day'],
      marquee: ['Florence', 'Veg-tanned', 'Full-grain', 'Hand-stitched', 'Saddle wax', 'Edge burnish', 'Tonal thread', 'Brass'],
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
        { name: 'Drop-in', price: '₹650/class', tagline: 'Single morning', bullets: ['Any weekday', 'No commitment', 'Mat provided'], highlight: false },
        { name: 'Monthly unlimited', price: '₹4,800/mo', tagline: 'All 26 classes', bullets: ['Unlimited mornings', 'Free workshops', 'Mat storage'], highlight: true },
      ],
    },
    faq: [
      { q: 'I have never done yoga. Is Mysore the right starting point?', a: 'It\'s actually the gentlest entry: you learn one posture at a time, at your own pace. We start every beginner with 6 postures and build from there.' },
      { q: 'Do you have changing rooms and showers?', a: 'Yes — two changing rooms and two hot showers. We provide towels for monthly members.' },
      { q: 'Can I come if I\'m not flexible?', a: 'Especially then. The practice meets you where your body is — there\'s no posture that requires advance flexibility.' },
      { q: 'What should I bring on the first day?', a: 'Comfortable clothes, an empty stomach, and curiosity. We provide everything else, including towels.' },
    ],
    testimonials: [
      { quote: 'I have tried four studios in this city. This is the only one I show up to at 6am, in the rain.', name: 'Aanya G.', role: 'Practitioner since 2023' },
      { quote: 'No music, no instagram class. Just breath. I sleep better.', name: 'Karan V.', role: 'Practitioner since 2024' },
      { quote: 'Six months in, my back stopped hurting. I didn\'t come for that, but I\'ll take it.', name: 'Devika M.', role: 'Practitioner since 2024' },
    ],
    cta: { headline: 'Try one morning. We promise nothing.', sub: 'First class is free. Walk in any weekday between 6 and 9am.', button: 'Book free first class' },
    brandVoice: {
      adjectives: ['Still', 'Honest', 'Unhurried'],
      sample: 'We don\'t say "transformative wellness journey". We say "come on Tuesday, we\'ll show you sun salutation A."',
    },
    seo: {
      title: 'Anhad — Mysore-style Ashtanga shala in Indirangar, Bengaluru',
      url: 'https://anhad.studio',
      description: 'A traditional 6-day-a-week morning Mysore Ashtanga shala in Indiranagar. Beginners welcome. First class free. Monthly unlimited from ₹4,800.',
    },
    howItWorks: [
      { step: '01', title: 'Walk in any weekday', body: 'Between 6 and 9am. We give you a mat, a glass of water, and a quiet corner.' },
      { step: '02', title: 'Learn 6 postures', body: 'Senior teacher walks you through each one, at your own pace, no rush.' },
      { step: '03', title: 'Come back tomorrow', body: 'Add one posture each visit. Build your own practice, one breath at a time.' },
    ],
    footer: {
      columns: [
        { heading: 'Practice', links: ['Schedule', 'Pricing', 'Workshops', 'Beginners'] },
        { heading: 'Studio', links: ['Teachers', 'Visit us', 'Photos', 'About'] },
        { heading: 'Connect', links: ['Newsletter', 'Instagram', 'Email us', 'Retreats'] },
      ],
      tagline: '© Anhad Yoga Shala · 12th Main · Indiranagar · Bengaluru 560038',
    },
    full: {
      heroBadge: 'OPEN · Beginners welcome any morning · 6:00 to 9:00am',
      statline: [
        { num: '480', label: 'monthly practitioners' },
        { num: '6', label: 'days a week' },
        { num: '7+ years', label: 'in Indiranagar' },
        { num: 'Free', label: 'first class · always' },
      ],
      featureHeadline: 'A practice, not a workout.',
      featureSub: 'Three things we deliberately don\'t do — and why your morning will thank you.',
      howSub: 'How a person who has never touched a mat becomes a practitioner — in three weekday mornings.',
      testimonialsHeadline: 'What practitioners say after the first month.',
      pricingHeadline: 'Two ways to commit. Both honest.',
      pricingSub: 'No annual contracts. Pause your unlimited plan any time, no fee.',
      faqHeadline: 'Questions first-timers ask at the door.',
      voiceHeadline: 'How we talk to first-timers.',
      finalCtaSub: 'Come tomorrow. Bring nothing. Stay 60 minutes. Decide afterwards.',
      logos: ['Mysore lineage', 'KPJAYI tradition', 'Beginner-friendly', '6 days a week', 'Open since 2018', 'Hot showers'],
      marquee: ['Sun salutation A', 'Sun salutation B', 'Surya namaskara', 'Standing series', 'Seated series', 'Finishing', 'Savasana', 'Pranayama'],
    },
  },
];

export const NICHE_KEYS: NicheKey[] = NICHES.map((n) => n.key);

// ---------------------------------------------------------------------------
// Per-niche visual themes for the standalone full-page experience.
// ---------------------------------------------------------------------------

export interface NicheTheme {
  // Page palette (six tokens that the landing page CSS reads).
  bg: string;
  bgSoft: string;
  surface: string;
  text: string;
  textDim: string;
  textMute: string;
  border: string;
  accent: string;
  accent2: string;
  accentSoft: string;
  // Typeface families. Both are loaded via Google Fonts on every niche page.
  display: string; // big headlines
  body: string; // paragraphs / UI
  // Hero ornament used in the hero parallax.
  heroOrnament: 'orbs' | 'grid' | 'film' | 'paper' | 'leaf';
  // Section punctuation flavour, used in tag eyebrows etc.
  flavor: 'tech' | 'school' | 'editorial' | 'craft' | 'studio';
}

export const THEMES: Record<NicheKey, NicheTheme> = {
  saas: {
    bg: '#070817',
    bgSoft: '#0c0e25',
    surface: 'rgba(255,255,255,0.04)',
    text: '#eef0fb',
    textDim: '#a4a8c4',
    textMute: '#666a86',
    border: 'rgba(255,255,255,0.08)',
    accent: '#7c5cff',
    accent2: '#22d3ee',
    accentSoft: 'rgba(124,92,255,0.16)',
    display: '"Geist", system-ui, sans-serif',
    body: '"Geist", system-ui, sans-serif',
    heroOrnament: 'grid',
    flavor: 'tech',
  },
  edtech: {
    bg: '#fff8ec',
    bgSoft: '#ffefd0',
    surface: '#ffffff',
    text: '#1f1303',
    textDim: '#5b4b2a',
    textMute: '#8a7a55',
    border: 'rgba(31,19,3,0.10)',
    accent: '#e76f3d',
    accent2: '#f5b32a',
    accentSoft: 'rgba(231,111,61,0.14)',
    display: '"Fraunces", "Instrument Serif", Georgia, serif',
    body: '"Geist", system-ui, sans-serif',
    heroOrnament: 'paper',
    flavor: 'school',
  },
  restaurant: {
    bg: '#0e0a07',
    bgSoft: '#1a120c',
    surface: 'rgba(255,243,222,0.04)',
    text: '#f6e9cf',
    textDim: '#bfa882',
    textMute: '#8a7656',
    border: 'rgba(246,233,207,0.10)',
    accent: '#d4a64a',
    accent2: '#7a4f2a',
    accentSoft: 'rgba(212,166,74,0.14)',
    display: '"Cormorant Garamond", "Instrument Serif", Georgia, serif',
    body: '"Inter", system-ui, sans-serif',
    heroOrnament: 'film',
    flavor: 'editorial',
  },
  d2c: {
    bg: '#f5efe6',
    bgSoft: '#ece3d2',
    surface: '#ffffff',
    text: '#1d1610',
    textDim: '#5b4a39',
    textMute: '#8a7c66',
    border: 'rgba(29,22,16,0.10)',
    accent: '#7c4a25',
    accent2: '#b27a3f',
    accentSoft: 'rgba(124,74,37,0.10)',
    display: '"Cormorant Garamond", "Instrument Serif", Georgia, serif',
    body: '"Inter", system-ui, sans-serif',
    heroOrnament: 'paper',
    flavor: 'craft',
  },
  yoga: {
    bg: '#f4f1ea',
    bgSoft: '#e8e2d2',
    surface: '#ffffff',
    text: '#1c2218',
    textDim: '#52604a',
    textMute: '#8a957f',
    border: 'rgba(28,34,24,0.10)',
    accent: '#6f8a55',
    accent2: '#c4774e',
    accentSoft: 'rgba(111,138,85,0.14)',
    display: '"Cormorant Garamond", "Instrument Serif", Georgia, serif',
    body: '"Inter", system-ui, sans-serif',
    heroOrnament: 'leaf',
    flavor: 'studio',
  },
};
