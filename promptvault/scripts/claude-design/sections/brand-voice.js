// scripts/claude-design/sections/brand-voice.js
// Brand Voice & Style Guide template for the "Claude Design" 500-prompt pack.
// Produces a 1-page voice doc a designer or copywriter pastes into Claude
// before drafting any copy on the site.

module.exports = {
  slug: 'brand-voice',
  name: 'Brand Voice & Style Guide',
  isFree: false,
  render(niche) {
    const prompt = `Act as a brand strategist (think Marty Neumeier x Dave Trott) writing the voice & style one-pager for ${niche.productExample}. You have built voice systems for category-defining brands and you believe a voice doc is worthless if it could apply to two different companies. Specificity is the whole job.

CONTEXT
- Product: ${niche.productExample}
- Reader / buyer: ${niche.audience}
- Stated brand tone: ${niche.brandTone}
- The pain we keep coming back to: ${niche.painPoint}
- Conversion goal of the site: ${niche.conversionGoal}
- Three brands the founder admires (paste below — triangulate against these): {{paste_3_brands_you_admire}}

TASK
Produce a 1-page brand voice & style guide that a designer, a freelance copywriter, or Claude itself can paste in BEFORE drafting any copy on the marketing site. It must be opinionated. If a competitor could lift it, rewrite it. Calibrate every line to how ${niche.audience} actually talk in Slack, on calls, and in their own tweets — not how marketers imagine they talk.

OUTPUT SPEC (return exactly these 10 sections, numbered, in this order, on one page):

1. VOICE DESCRIPTORS — pick exactly 3 adjectives, derived from "${niche.brandTone}". Each adjective gets a 1-line "what this means in practice" gloss so a junior writer can act on it. No fluffy synonyms (no "innovative", "passionate", "dynamic").

2. VOICE SPECTRUM — rate the brand on these 4 axes, 1 to 5, and justify each rating in 1 sentence tied to ${niche.audience}:
   - Formal (1) <-> Casual (5)
   - Serious (1) <-> Playful (5)
   - Reserved (1) <-> Bold (5)
   - Plain (1) <-> Decorated (5)
   The 4 ratings must be internally consistent. A 5 on Casual cannot coexist with a 1 on Playful without a clear reason.

3. SENTENCE-LENGTH RULE — give a target average words/sentence, a max sentence length, the % of sentences that should run under 8 words, and the one situation where we are allowed to break the rule.

4. THREE "ALWAYS" RULES — three specific writing moves we always make. Not values, moves. Example shape: "Always lead with the number, then the verb." Each rule must be testable — a reviewer could circle a sentence and say yes/no.

5. THREE "NEVER" RULES — three specific things we never do. Be opinionated and slightly uncomfortable. "Never use rhetorical questions in headlines" beats "never sound corporate".

6. SEVEN PROHIBITED WORDS / PHRASES — concrete words, with the substitute we use instead, in the format: \`leverage -> use\`. At least 4 of the 7 must be words that genuinely show up in lazy AI marketing copy (candidates to consider: leverage, synergy, best-in-class, robust, seamlessly, cutting-edge, unlock, empower, revolutionize, game-changer, in today's fast-paced world, journey, ecosystem, solution). The remaining slots should be words specifically over-used in the ${niche.name} category.

7. FIVE SIGNATURE PHRASES / TICS — 5 short phrases unique to this brand that we will repeat across the site so it sounds like one human wrote it. They must feel ownable, not generic. "Ship on Friday" is ownable. "We love our customers" is not. Tie at least 2 of them to ${niche.painPoint} or ${niche.conversionGoal}.

8. EMOJI POLICY — exactly 1 line: never / sparingly / freely. If sparingly or freely, name the 2-3 emojis allowed and the 2-3 that are banned (no smileys in headlines, etc.).

9. CAPITALIZATION & PUNCTUATION RULES — ship a short rule block covering: Title Case vs sentence case for headings, em-dash vs en-dash usage, serial (Oxford) comma yes/no, ampersand usage, ellipsis usage, and how we render numbers (12 vs twelve, 1,200 vs 1.2k). Pick a side on each — no "it depends".

10. ON-BRAND vs OFF-BRAND EXAMPLE — a two-column pair on the topic of "${niche.painPoint}". Same idea, written two ways, 1 sentence each:
    | ON-BRAND | OFF-BRAND |
    The off-brand version should sound like a generic SaaS landing page. The on-brand version should obey every rule above.

CONSTRAINTS
- The voice must be internally coherent. The 4 spectrum ratings cannot contradict the always/never rules. If you rate Playful at 5, "never use humor" is illegal.
- The prohibited list must include at least 4 words that genuinely appear in lazy AI copy.
- Signature phrases must feel ownable — if a competitor in the ${niche.name} space could paste them onto their own site, throw them out and try again.
- Calibrate to how ${niche.audience} actually speak. If they say "stack", do not write "tech ecosystem". If they say "ship", do not write "deliver value".
- Triangulate the whole doc against {{paste_3_brands_you_admire}} — but do not copy them. Borrow posture, not phrases.
- Do not mention AI, Claude, GPT, or that this doc was generated. The doc should read like it was written by a human strategist who has met the founder.
- Fit on one page. Cut anything that is decoration.

PRESSURE-TEST PROMPT (include verbatim at the bottom of the doc, on its own line)
> Pressure-test prompt: "Paste any draft of website copy below this voice doc and ask Claude — 'Does this copy obey every rule above? List every violation by section number, then rewrite the worst offender.'"

DELIVERY
Return clean Markdown. Use the numbered headings 1-10 exactly as specified. Use a real Markdown table for section 10. No preamble, no "Here is your brand voice guide", no closing pleasantries. Start at "1. VOICE DESCRIPTORS".`;

    return {
      title: `${niche.name} — Brand Voice One-Pager`,
      prompt,
      tags: ['brand-voice', 'landing-page', 'tone', 'style-guide', niche.slug],
      difficulty: 'advanced',
      aiTool: 'any',
      outputType: 'creative',
    };
  },
};
