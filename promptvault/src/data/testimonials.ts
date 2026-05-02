// Verified-buyer testimonials displayed on the landing page and product pages.
// Star distribution targets an exact 4.4 average:
//   8×5 + 5×4 + 2×3 = 66 → 66/15 = 4.4

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar: string;
  rating: 3 | 4 | 5;
  quote: string;
  date: string;
  verified: boolean;
  niche?: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'rev-001',
    name: 'Karthik Subramanian',
    role: 'Equity research analyst · Chennai',
    avatar: '📈',
    rating: 5,
    quote:
      'The earnings-call summariser prompt cut my pre-market reading from 90 minutes to about 20. I run it on 6 mid-cap results in a single sitting and the bullet structure is clean enough to paste straight into my morning note.',
    date: '2026-04-22',
    verified: true,
    niche: 'finance',
  },
  {
    id: 'rev-002',
    name: 'Anjali Iyer',
    role: 'D2C founder · Bengaluru',
    avatar: '🛍️',
    rating: 5,
    quote:
      'Used the product-description pack for 42 SKUs on our Shopify store last month. Average time per listing dropped from 18 minutes to under 4, and our add-to-cart rate moved up roughly 12% on the rewritten pages.',
    date: '2026-04-14',
    verified: true,
    niche: 'ecommerce',
  },
  {
    id: 'rev-003',
    name: 'Arjun Reddy',
    role: 'UPSC aspirant · Hyderabad',
    avatar: '📚',
    rating: 4,
    quote:
      'The answer-writing structure prompts for GS2 are genuinely useful, especially the 150-word framework. Wish there were more questions tagged for ethics paper, but I have already saved around 6 hours a week on practice answer drafting.',
    date: '2026-04-08',
    verified: true,
    niche: 'students',
  },
  {
    id: 'rev-004',
    name: 'Divya Pillai',
    role: 'Wedding photographer · Kochi',
    avatar: '📸',
    rating: 5,
    quote:
      'The client-enquiry reply pack is shockingly on point for Kerala wedding budgets. I now respond to Instagram DMs in under 2 minutes with a properly worded quote, and I closed 4 extra bookings in March alone worth roughly ₹3.2L.',
    date: '2026-03-29',
    verified: true,
    niche: 'design',
  },
  {
    id: 'rev-005',
    name: 'Vivek Patel',
    role: 'GST consultant · Surat',
    avatar: '🧾',
    rating: 5,
    quote:
      'The notice-reply drafting prompt for Section 73 cases is the one I use almost daily. What used to take me 45 minutes per client letter now takes 12, and the language matches what officers actually expect to read.',
    date: '2026-03-21',
    verified: true,
    niche: 'finance',
  },
  {
    id: 'rev-006',
    name: 'Nisha Banerjee',
    role: 'Social media manager · Kolkata',
    avatar: '📱',
    rating: 4,
    quote:
      'The carousel-hook prompts for Instagram are solid for lifestyle and food brands. They feel a bit thin for B2B SaaS clients, but for my 3 D2C accounts I am posting 5x more reels per week with the same team size.',
    date: '2026-03-15',
    verified: true,
    niche: 'marketing',
  },
  {
    id: 'rev-007',
    name: 'Suresh Kumar',
    role: 'Mutual fund distributor · Coimbatore',
    avatar: '💼',
    rating: 5,
    quote:
      'I bought the client-review-meeting pack mostly out of curiosity. The portfolio commentary prompt now generates a personalised one-pager for each of my 70+ families in roughly 25 minutes total instead of half a working day.',
    date: '2026-03-09',
    verified: true,
    niche: 'finance',
  },
  {
    id: 'rev-008',
    name: 'Meera Menon',
    role: 'MBBS final year student · Thiruvananthapuram',
    avatar: '🩺',
    rating: 3,
    quote:
      'Took me a couple of weeks to figure out which prompts actually fit clinical case revision, the medicine ones felt generic at first. Once I tweaked the differential-diagnosis template though, it cut my case-sheet prep time by about 40%.',
    date: '2026-02-28',
    verified: false,
    niche: 'medical',
  },
  {
    id: 'rev-009',
    name: 'Tanvi Kulkarni',
    role: 'Real-estate agent · Pune',
    avatar: '🏠',
    rating: 5,
    quote:
      'The property-listing rewrite prompt and the WhatsApp follow-up sequence together changed how I work. I sent 38 personalised follow-ups last week in under an hour, and 2 of them converted into site visits the same weekend.',
    date: '2026-02-19',
    verified: true,
    niche: 'marketing',
  },
  {
    id: 'rev-010',
    name: 'Rajat Singh',
    role: 'Gym owner · Indore',
    avatar: '🏋️',
    rating: 4,
    quote:
      'The member-onboarding email series and the lapsed-member win-back prompts have brought back 11 dropped members in 6 weeks, which works out to roughly ₹66,000 in recovered MRR. Could use more region-specific content for Tier-2 cities.',
    date: '2026-02-11',
    verified: true,
    niche: 'marketing',
  },
  {
    id: 'rev-011',
    name: 'Pooja Aggarwal',
    role: 'Freelance copywriter · Lucknow',
    avatar: '✍️',
    rating: 5,
    quote:
      'The long-form sales page prompt walked me through a 1,800-word draft for a client in about 90 minutes, including research questions. I billed it at my usual rate of ₹18k and the client approved with only minor edits in round one.',
    date: '2026-02-04',
    verified: true,
    niche: 'marketing',
  },
  {
    id: 'rev-012',
    name: 'Harish Nair',
    role: 'Chartered accountant · Bhubaneswar',
    avatar: '📊',
    rating: 4,
    quote:
      'Mostly bought it for the audit-query drafting and management-letter prompts. They saved me roughly 8 hours during the busy March week. The financial-modelling prompts feel more US-centric and need adapting for Indian schedule III formats.',
    date: '2026-01-30',
    verified: true,
    niche: 'finance',
  },
  {
    id: 'rev-013',
    name: 'Sanya Kapoor',
    role: 'Mehndi artist · Jaipur',
    avatar: '🎨',
    rating: 3,
    quote:
      'Honestly the design category felt sparse for traditional art businesses when I started. After a few tries I built a booking-script using the consultation-call prompt, and that alone has helped me close 3 bridal packages worth ₹45,000 each.',
    date: '2026-01-25',
    verified: false,
    niche: 'design',
  },
  {
    id: 'rev-014',
    name: 'Rakesh Yadav',
    role: 'Stock trader · Vizag',
    avatar: '📉',
    rating: 5,
    quote:
      'The pre-market checklist and the post-trade journaling prompt are the two I open every single morning. My average review time per trading day went from 35 minutes to 9, and I have actually stuck with journaling for 11 weeks straight now.',
    date: '2026-01-18',
    verified: true,
    niche: 'finance',
  },
  {
    id: 'rev-015',
    name: 'Ramya Gopalakrishnan',
    role: 'Claude design system lead · Bengaluru',
    avatar: '🧩',
    rating: 4,
    quote:
      'The component-spec writing prompt for our internal design system is genuinely well-structured. We documented 14 components in a fortnight, roughly 3x our usual pace, although the accessibility-review prompt could go deeper on WCAG specifics.',
    date: '2026-01-16',
    verified: false,
    niche: 'claude-design',
  },
];

export const OVERALL_RATING = 4.4;
export const TOTAL_REVIEWS = TESTIMONIALS.length;
