// scripts/claude-design/sections/cta.js
module.exports = {
  slug: 'cta',
  name: 'Call-To-Action Block',
  isFree: false,
  render(niche) {
    return {
      title: `${niche.name} — Mid-Page CTA Block`,
      prompt: `Act as a direct-response copywriter (think David Ogilvy meets Joanna Wiebe) writing the mid-page CTA block for ${niche.productExample}. This is the moment-of-truth ask — the visitor has skimmed the page, felt a flicker of "this might be for me," and now has to decide whether to click. Your job is to make clicking feel safer, smarter, and more inevitable than scrolling away.

CONTEXT
- Audience: ${niche.audience}
- Brand voice: ${niche.brandTone}
- Pain they came in with: ${niche.painPoint}
- Conversion goal of this page: ${niche.conversionGoal}
- Social-proof flavor we can lean on: ${niche.socialProofType}
- Use the placeholders {{your_strongest_outcome_metric}} and {{free_trial_duration_or_guarantee}} verbatim where the user will swap in real proof.

TASK
Produce 3 CTA variants for A/B testing. Each variant must take a different angle:
  Variant A — Outcome-led: frame ${niche.conversionGoal} as the future state ${niche.audience} wakes up inside.
  Variant B — Urgency-led: use only real urgency (a pricing change, a capacity cap, a season, a cohort window). Never invent fake countdowns.
  Variant C — Risk-reversal-led: open with the safety net — no card, ${'{{'}free_trial_duration_or_guarantee${'}}'} guarantee, no setup fee, cancel anytime.

At least 2 of the 3 variants must explicitly reframe "${niche.painPoint}" into its inverse-outcome — show them the after, not the before.

OUTPUT SPEC (repeat this exact structure for Variant A, Variant B, Variant C)
1. Headline — 6-10 words, verb-led, anchored to the outcome ${niche.audience} actually wants (not a product feature). Never end with an exclamation mark. Banned phrases: "Get started today", "Sign up now", "Welcome to…", "The future of…".
2. Supporting line — one sentence, 15-25 words, that carries both proof (lean on ${niche.socialProofType} or {{your_strongest_outcome_metric}}) and a risk-reversal beat.
3. Primary button text — 2-4 words, must contain a verb of commitment that drives ${niche.conversionGoal} (e.g. "Start free trial", "Claim my audit", "Book the demo"). Banned: "Submit", "Continue", "Click here", "Learn more", any bare "Go".
4. Secondary button text OR trust micro-copy — pick one: a low-commitment second action ("See a sample", "Watch 2-min tour") or a trust line ("No card required", "Cancel anytime", "${'{{'}free_trial_duration_or_guarantee${'}}'}").
5. Visual hint — one line describing gradient direction and an icon suggestion (e.g. "Soft diagonal gradient top-left to bottom-right, sparkle icon left of headline").
6. Implementation note — one line: where on the page this variant performs best (above-fold / after-features / pre-footer) and why.

VOICE RULES
- Match ${niche.brandTone} exactly — if the brand is warm, sound warm; if it's clinical, sound clinical.
- Speak to the reader as "you," never "users" or "customers."
- Every headline must pass the so-what test: read it aloud, and if the answer is "so what?" rewrite it until ${niche.audience} would lean forward.
- Specificity beats hype: a number, a name, a noun beats an adjective every time.

Deliver the three variants back-to-back, clearly labeled. No preamble, no closing summary — just the working copy.`,
      tags: ['cta', 'landing-page', 'conversion', 'copywriting', niche.slug],
      difficulty: 'beginner',
      aiTool: 'any',
      outputType: 'creative',
    };
  },
};
