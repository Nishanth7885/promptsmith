// scripts/claude-design/sections/features.js
module.exports = {
  slug: 'features',
  name: 'Features Grid',
  isFree: true,
  render(niche) {
    return {
      title: `${niche.name} — Features Grid Copy`,
      prompt: `Act as a senior product marketer for ${niche.productExample}. You are writing the FEATURES GRID section that sits under the hero on a high-conversion landing page. Your reader is ${niche.audience}. The business pain you are fighting is: "${niche.painPoint}". Translate the product into six tight benefit cards that make this exact buyer nod and scroll deeper — not impress your own design team.

Voice: ${niche.brandTone}. Every card body must read like a tweet — punchy, zero warmup. Lead with the buyer's job, not the product's mechanics.

Produce EXACTLY 6 feature cards. Each card MUST map to a different buyer concern, in this order:
1. SPEED — how fast they get value or ship work
2. COST — money saved, headcount avoided, tools replaced
3. QUALITY — output is more accurate, more polished, fewer errors
4. TRUST — security, reliability, or social proof of safety
5. EASE — onboarding, learning curve, day-to-day friction removed
6. INTEGRATION — how it slots into the stack they already run

For each card, output these four fields, in this exact format:

Card N — [CONCERN]
1. Icon hint: <one emoji> + <2-word descriptor>
2. Headline: <3-5 words, benefit-led, never feature-led>
3. Body: <15-25 words, references a concrete real workflow this buyer actually runs, includes one proof signal (a number, a named tool, a named role, or a named step)>
4. Metric (optional): <e.g., "Saves 4 hrs/week" or "Cuts onboarding from 2 weeks to 2 days" — include only if it is genuinely plausible, otherwise write "—">

Hard rules for the 6 cards as a set:
- At least 2 of the 6 cards must obviously address this pain: "${niche.painPoint}". Make the link visible to a skim-reader.
- Exactly 1 card must position against the market using the placeholder {{your_top_competitor}} inside its body — written so the user can paste in a real competitor name later.
- Every body must reference a real workflow (e.g., "weekly pipeline review", "Friday changelog", "QBR deck prep") — never a vague capability ("powerful analytics", "smart automation").
- Headlines describe the buyer's WIN, not the product's FEATURE. "Close the month in a day" beats "Automated reconciliation engine".

Constraints (a card is invalid if it breaks any of these):
- No jargon. Banned words: synergy, leverage, next-gen, seamless, robust, cutting-edge, world-class, holistic, empower, unlock, supercharge.
- No adjective stacking. "Fast, simple, beautiful" style triplets are forbidden in headlines and bodies.
- Every feature must reference a real workflow this buyer runs, not a vague capability.
- Maximum 1 metaphor across all 6 cards combined. Pick your strongest and use it once.
- Voice stays ${niche.brandTone} across all 6 cards — do not drift into hype, do not drift into corporate.
- Speak to ${niche.audience} and the job they are hired to do — not to internal product or design choices.
- No feature names invented out of thin air. If you reference a capability, it must be plausibly part of ${niche.productExample}.

Before the 6 cards, output one line:
SECTION INTENT: <12 words or fewer naming the single decision this grid is helping the reader make>

After the 6 cards, output a short QA block titled "Self-check" that confirms, in one line each: (a) which 2 cards address "${niche.painPoint}", (b) which card uses {{your_top_competitor}}, (c) the single metaphor used (or "none"), (d) that all 6 buyer concerns are covered with no overlap.

Do not output anything else. No intro, no outro, no explanation of your reasoning.`,
      tags: ['features', 'landing-page', 'value-props', 'copywriting', niche.slug],
      difficulty: 'intermediate',
      aiTool: 'any',
      outputType: 'creative',
    };
  },
};
