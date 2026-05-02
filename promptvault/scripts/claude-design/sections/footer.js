// scripts/claude-design/sections/footer.js
module.exports = {
  slug: 'footer',
  name: 'Footer + Final CTA',
  isFree: false,
  render(niche) {
    return {
      title: `${niche.name} — Footer + Final CTA Pack`,
      prompt: `Act as a senior conversion designer + SEO writer producing the entire footer block for ${niche.productExample}, a ${niche.name.toLowerCase()} business serving ${niche.audience}. The footer is the last conversion shot AND the home of every legal, SEO and trust signal — write it like a 2-5% lift depends on it, because it does.

Voice: ${niche.brandTone}. Restate the conversion goal one final time: "${niche.conversionGoal}". The newsletter value-prop must be calibrated to what ${niche.audience} actually want — not generic "updates."

Pain point to keep front-of-mind: "${niche.painPoint}". Social proof flavour available: ${niche.socialProofType}.

Produce the following deliverables in order. Use markdown headings for each section. Be specific to ${niche.productExample} — never invent links or badges that this niche doesn't actually need.

1. PRE-FOOTER FINAL CTA BAND
   - Headline: 8-12 words, last-chance angle, restating "${niche.conversionGoal}" in plain language.
   - Supporting line: exactly one sentence, must include risk reversal (free trial / money-back / no credit card / cancel anytime — pick what's TRUE for this niche).
   - Primary button text: 2-4 words, action verb, matches the conversion goal.
   - Optional 1-line trust strip beneath the button: a real review rating, customer count or media mention format calibrated to ${niche.socialProofType} (e.g. "Rated 4.8 on G2 by 1,200+ teams" or "Trusted by 40k+ readers").

2. NEWSLETTER SIGNUP MODULE
   - Tagline: 8-15 words, value-led — promise a specific deliverable ${niche.audience} actually wants (a weekly teardown, a checklist PDF, early-bird drops, market intel — match the niche). Never "Subscribe to our newsletter."
   - Email input placeholder text (e.g. "you@company.com" or niche-flavoured equivalent).
   - Submit button text: 2-3 words, benefit-led not "Subscribe."
   - Post-submit micro-confirmation copy: 1 short sentence telling them what happens next + the cadence.

3. FOOTER COLUMNS — exactly 4 columns, 4-7 links each. Adjust link slugs to what ${niche.productExample} actually ships.
   - PRODUCT: features, pricing, integrations, changelog, what's new, roadmap (pick the 4-7 that fit).
   - COMPANY: about, careers, blog, contact, press, partners.
   - RESOURCES: docs, help center, support, system status, community, FAQ, guides, templates.
   - LEGAL: privacy policy, terms of service, refund/cancellation, security, DPDP/GDPR, cookie policy, acceptable use.
   Skip links that don't apply to this niche. Don't invent "/manifesto" unless it genuinely fits ${niche.brandTone}.

4. BOTTOM BAR
   - Copyright line: "© {{current_year}} {{your_company_name}}. All rights reserved." (use the {{current_year}} placeholder, never hardcode).
   - Tax/registration line: include {{your_gst_or_company_id}} and CIN format if Indian Pvt Ltd applies.
   - India address line (if applicable to this niche): "Registered office: [street], {{your_registered_city}}, India".
   - Social link icon list: list ONLY the platforms ${niche.audience} actually use for this niche (e.g. LinkedIn + X for B2B SaaS; Instagram + YouTube + Pinterest for D2C; GitHub + X + Discord for devtools). Provide the exact @handle format per platform (LinkedIn = /company/handle, X = @handle, Instagram = @handle, YouTube = @handle, GitHub = /org, Discord = invite link).

5. TRUST BADGES ROW — 3-5 badges, only ones TRUE for ${niche.productExample}.
   Pick from: PCI-DSS, RBI-licensed PA, ISO 27001, SOC 2 Type II, DPDP-compliant, GDPR-ready, HIPAA, FSSAI, BIS, Startup India recognised, Razorpay/Stripe verified, Shopify Plus partner, Google Cloud partner, etc. Match the badge to the niche — don't slap HIPAA on a fashion brand.

6. SITEMAP REMINDER
   - One line stating the primary canonical URL (https://{{your_company_name}}.com or .in) and a note about hreflang if this niche serves multiple regions (en-IN / en-US / etc.). If single-region, say so explicitly.

CONSTRAINTS
- Never write "Subscribe to our newsletter" — every newsletter line promises specific value.
- Footer links must exist on most real sites of this niche; don't pad.
- Social handles must follow each platform's @-rules.
- Copyright year MUST use {{current_year}} placeholder.
- Never end with vague filler like "Made with love" or "Made with ❤️".
- Use placeholders: {{your_company_name}}, {{your_gst_or_company_id}}, {{your_registered_city}}, {{current_year}}.
- Every line must read like a real ${niche.name} brand wrote it, not a generic SaaS template.`,
      tags: ['footer', 'landing-page', 'final-cta', 'newsletter', niche.slug],
      difficulty: 'intermediate',
      aiTool: 'any',
      outputType: 'creative',
    };
  },
};
