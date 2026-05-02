// scripts/claude-design/sections/pricing.js
module.exports = {
  slug: 'pricing',
  name: 'Pricing Tiers',
  isFree: false,
  render(niche) {
    return {
      title: `${niche.name} — Pricing Tiers That Convert`,
      prompt: `Act as a SaaS pricing strategist (think Patrick Campbell at ProfitWell) for ${niche.productExample}. You are designing the public pricing section of a ${niche.name} landing page targeted at ${niche.audience}. Your job is to package value so that visitors who came in skeptical leave with a tier already chosen — and so that ${niche.conversionGoal} happens before they close the tab.

Voice: ${niche.brandTone}. Write like a product marketer who has watched 10,000 checkout sessions, not a copywriter guessing.

Context you must internalize before writing:
- Primary pain point: ${niche.painPoint}
- Conversion goal: ${niche.conversionGoal}
- Social proof signal already on page: ${niche.socialProofType}
- Competitor benchmark price (use as anchor, do not copy): {{your_main_competitor_price}}
- Annual ARR target this pricing must support: {{your_annual_target_arr}}

Output spec — produce EXACTLY 3 tiers, in this numbered structure per tier:

1. Tier name — 2 words max. Do NOT use "Basic / Pro / Enterprise / Starter / Premium". Invent something on-brand for ${niche.slug} (e.g. "Solo Spark", "Studio Loop", "Atlas Scale").
2. One-line audience descriptor — format: "For [who] [doing what at what stage]" (e.g. "For solo founders shipping their first MVP").
3. Monthly price — INR first, USD parenthetical, IDR equivalent only if your audience map suggests SEA traffic. Format: "₹1,499/mo ($18 / Rp 285k)".
4. Yearly price — show the saving in plain words. Format: "₹14,990/yr — save 17% vs monthly".
5. 5-7 bullet points — anchor on OUTCOMES, not features. "Ship 3x faster" beats "AI editor included". Each bullet must finish the sentence "so you can ___".
6. CTA button text — must differ across tiers. Tier 1 = "Start free" / "Try free for 7 days" (and that CTA must obviously drive ${niche.conversionGoal}). Tier 2 = "Start 14-day trial" or "Start with [tier name]". Tier 3 = "Talk to sales" or "Book a scoping call".
7. Disclaimer line — taxes, what is and is not included, GST treatment.

Tier 2 is the most-popular anchor. Visually mark it ("Most Popular" ribbon) AND add a one-sentence rationale below the grid explaining WHY it is the popular pick — that sentence must obviously solve ${niche.painPoint}.

Constraints (hard rules — do not violate):
- Tier 1 must remove a real purchase risk: either a true free tier, a 14-day no-card trial, or a 30-day money-back line. State it inside the bullets.
- Tier 3 must reference scale signals relevant to ${niche.audience} enterprise needs: SSO/SAML, dedicated CSM, custom DPA, audit logs, volume seats, on-prem or VPC, SLA. Pick what fits ${niche.slug}, not all of them.
- Prices must reflect Indian market reality: ₹ first, $ parenthetical, no rounding errors, no $99 disguised as ₹99. Tier 1 should sit in a believable Indian SMB band.
- Price-anchoring rule: tier 2 monthly price must sit in the Goldilocks zone of 2.5×–3× tier 1. Tier 3 may be flat-rate or "from ₹X" but never just "Contact us for pricing" — only tier 3 may use a "talk to sales" CTA, and even then show a starting price.
- Mention GST inclusivity once (e.g. "All prices exclude 18% GST" or "GST included for India billing").
- No fake urgency ("only 3 seats left"), no countdown timers, no dark patterns.
- Bullets in tier 2 must obviously dismantle ${niche.painPoint} — at least 2 of the 5-7 bullets should map directly to it.

Format the final answer as clean markdown: one H3 per tier, the 7 numbered fields under each, then the rationale sentence for tier 2, then a short FAQ-style "Pricing notes" block (3 lines: GST, refunds, currency) under the grid. Keep total length tight — this is a pricing section, not a manifesto.

Before you write, silently sanity-check: does tier 2 cost 2.5–3× tier 1? Does tier 1's CTA drive ${niche.conversionGoal}? Would a ${niche.audience} buyer feel respected, not tricked? If any answer is no, rewrite that tier before returning.`,
      tags: ['pricing', 'landing-page', 'tiers', 'monetization', niche.slug],
      difficulty: 'intermediate',
      aiTool: 'any',
      outputType: 'creative',
    };
  },
};
