// scripts/claude-design/sections/faq.js
module.exports = {
  slug: 'faq',
  name: 'FAQ Section',
  isFree: false,
  render(niche) {
    return {
      title: `${niche.name} — Conversion-Killing FAQ`,
      prompt: `Act as a senior conversion strategist analyzing why ${niche.audience} hesitates to take ${niche.conversionGoal} on a landing page for ${niche.name} (example product: ${niche.productExample}). Your job is not to write generic FAQs — it is to surface the silent objections that are actually killing the click, and answer them the way a sharp founder would in a 1:1 sales call. Voice = ${niche.brandTone}, but plain English in the answers.

Before writing, mentally interview a skeptical ${niche.audience} who has the live pain of "${niche.painPoint}", has been burned before, has limited budget/time, and is one tab away from closing. Their inner monologue — not their polite question — is your input.

OUTPUT SPEC — produce EXACTLY 10 FAQs, ordered by predicted-likelihood-of-stopping-the-purchase (most lethal first):

1. Each Question: 8-15 words, written in the customer's actual voice. Not "What is your pricing model?" but "What happens to my price after the first year?" or "Will this break my existing workflow?".
2. Each Answer: 25-50 words. Direct. No marketing fluff. Every answer must reference at least one concrete fact, number, timeline, integration, certification, or safeguard. If the honest answer is "no", lead with "No." then explain in one sentence.
3. Tag each FAQ with ONE objection-type label in square brackets at the end of the question line: [PRICE] / [TRUST] / [FIT] / [IMPLEMENTATION] / [SUPPORT] / [SECURITY] / [SCALE] / [DATA] / [CANCELLATION] / [COMPETITION].
4. The TOP 3 FAQs must cover PRICE, TRUST, and FIT (in whichever order you predict is most lethal for ${niche.audience}).
5. At least ONE FAQ must directly handle the worry that this product will not actually fix "${niche.painPoint}" — answer it with a specific mechanism, not a promise.
6. At least ONE answer must cite a real proof type tied to ${niche.socialProofType} (e.g. customer logos, verified ratings, ROI numbers, case-study outcomes, audit reports) — use the placeholder {{your_strongest_proof_metric}} inside that answer.
7. At least ONE FAQ must address the India market: DPDP Act compliance, GST invoicing, INR pricing, or India data residency — pick whichever is most credible for ${niche.name}.
8. At least ONE FAQ must directly compare against {{competitor_being_compared}} under the [COMPETITION] tag, and must concede one thing the competitor does well before showing where this product wins.

HARD CONSTRAINTS — do not violate:
- Never open an answer with "Great question", "Absolutely", "Of course", or similar.
- Never repeat the question inside the answer.
- Never use "we believe", "we strive", "we are committed to", "world-class", "best-in-class", "seamless", or "robust".
- Never hedge a "no" — say "No." first, then the reason.
- Do not invent certifications, customer counts, or numbers — leave a clearly-named placeholder if a specific stat is required beyond the two given.

FORMAT (markdown):
**Q1. <customer-voice question> [TAG]**
<25-50 word answer>

...repeat through Q10.

After Q10, add a one-line "Still on the fence?" CTA pointing to ${niche.conversionGoal}, written in ${niche.brandTone}, max 18 words, no exclamation marks.`,
      tags: ['faq', 'landing-page', 'objections', 'copywriting', niche.slug],
      difficulty: 'intermediate',
      aiTool: 'any',
      outputType: 'creative',
    };
  },
};
