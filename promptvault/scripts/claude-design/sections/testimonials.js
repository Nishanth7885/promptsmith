// scripts/claude-design/sections/testimonials.js
module.exports = {
  slug: 'testimonials',
  name: 'Testimonials Block',
  isFree: false,
  render(niche) {
    return {
      title: `${niche.name} — Believable Testimonials`,
      prompt: `Act as a customer-marketing lead at ${niche.productExample}. I'll paste my raw customer interview notes between {{interview_notes}} tags. Convert them into 6 testimonials that read like real human beings actually said them — not marketing fluff, not LinkedIn posturing. Every quote must sound like someone who genuinely uses the product and has a specific story to tell.

Niche context: ${niche.name} — ${niche.description}
Audience: ${niche.audience}
Pain we solve: ${niche.painPoint}
Conversion goal of this section: ${niche.conversionGoal}
Voice / brand tone to match: ${niche.brandTone}
Social proof style this brand leans on: ${niche.socialProofType} — every testimonial you write must feel consistent with that proof style (if it's "enterprise logos", the speakers should sound like enterprise buyers; if it's "indie creators", they should sound like solo operators, etc.).

Raw input from founder:
{{interview_notes}}

================================
PRODUCE EXACTLY 6 TESTIMONIALS
================================
For each of the 6, output the following 5 fields, numbered, in this order:

  1. Quote — 35 to 65 words. Use a two-beat structure: "before-state → after-state". The before-state must echo the customer's lived version of "${niche.painPoint}". The after-state must include ONE specific, concrete number (a %, hrs/week saved, ₹ saved, or "Nx faster"). No vague wins.
  2. Attribution — Full name, role, company, city. Use realistic Indian names where the audience fits (Aarav Mehta, Priya Krishnan, Rohan Iyer, Sneha Reddy, Vikram Shah, Ananya Bose) and mix with international names (Maya Okonkwo, Daniel Brandt, Lucia Romero) so the wall feels global, not staged.
  3. Avatar hint — a 3-word style descriptor for the founder to brief their photographer or illustrator (e.g. "warm-lit home-office", "studio-portrait navy-blazer", "candid-cafe natural-light").
  4. Logo placement — "yes" or "no". Only "yes" if the company is a name a casual visitor would actually recognize. Default to "no" for indie shops, agencies, and unknown SMBs.
  5. Length tag — one of: HERO-WIDE, MID-SCROLL, TIGHT-PROOF.

Distribution across the 6:
- 1 × HERO-WIDE (longest, leads the section, fullest narrative arc)
- 3 × MID-SCROLL (standard length, varied angles)
- 2 × TIGHT-PROOF (under 25 words, single punchy sentence — these still need a number)

================================
HARD CONSTRAINTS
================================
- No exclamation marks anywhere.
- Banned vocabulary: amazing, love, awesome. Replace with a specific behaviour change ("I stopped opening the spreadsheet on weekends", "our standup got 12 minutes shorter").
- Every quote names exactly ONE concrete metric (%, hrs/week, ₹ saved, x faster, $ MRR, signups/week, etc.). Spread the metric types — don't repeat the same unit twice in a row.
- The phrase or paraphrase of "${niche.painPoint}" must appear in the customer's own words in at least 2 of the 6 quotes. Make it sound like venting, not a brochure.
- Vary sentence openings. No more than 2 of the 6 may begin with "I" or "We". Lead others with a time marker, a number, a feeling, or a quoted phrase.
- At least ONE quote must name a specific competitor or prior tool the customer dropped to switch (e.g. "We were duct-taping Airtable + Zapier before this").
- Match ${niche.brandTone} throughout — if tone is playful, allow dry wit; if tone is clinical, stay measured.

================================
ANTI-PATTERN CHECK (run before you output)
================================
The AI MUST NEVER use these phrases. If any draft contains them, rewrite the quote:
  - "game-changer"
  - "next-level"
  - "love this product"
  - "best in class"
  - "10x" (as a generic adjective — actual "10x faster" with a measured baseline is fine)

Return only the 6 numbered testimonials. No preamble, no closing summary.`,
      tags: ['testimonials', 'landing-page', 'social-proof', 'copywriting', niche.slug],
      difficulty: 'intermediate',
      aiTool: 'any',
      outputType: 'creative',
    };
  },
};
