// scripts/claude-design/sections/how-it-works.js
module.exports = {
  slug: 'how-it-works',
  name: 'How It Works',
  isFree: false,
  render(niche) {
    return {
      title: `${niche.name} — 3-Step "How It Works"`,
      prompt: `Act as a product-marketing lead at ${niche.productExample} writing the "How it works" section for the homepage. Your reader is ${niche.audience}. They already trust the offer — they are scrolling because they want to believe they personally can pull this off without setting aside a weekend. Your job is to make the path from signup to first real result feel small, concrete, and finishable today.

Write this section in a ${niche.brandTone} voice. Use second person throughout — speak to the reader as "you", in present tense. Do not use "we", "our team", or marketing fluff like "seamlessly", "effortlessly", "powerful", or "revolutionary". Plain, specific verbs only.

The pain point you are quietly defusing is: "${niche.painPoint}". At least one step's micro-trust signal must directly counter that exact friction.

Produce the output in this numbered structure:

1. Section heading (max 6 words, plain — e.g. "How it works", "Get set up in minutes")
2. Sub-heading (one sentence, under 18 words, names the outcome the reader gets at the end)
3. Three steps. Exactly three — never two, never four. For each step, output every field below:
   a. Step number (1, 2, or 3)
   b. Step label — 3 to 5 words, verb-led, action-first. Examples of the right shape: "Connect your inbox", "Pick a niche", "Hit publish". No gerunds, no nouns-only.
   c. Body copy — 20 to 35 words, second person, speaks directly to ${niche.audience}. Must end the step with a tangible artefact the reader now has on screen (a connected account, a saved draft, a shareable link) — not a feeling.
   d. Time estimate — realistic. "30 seconds", "2 minutes", "instant", "about 5 minutes". Do not lie. The sum of the three steps must match the wrap line below.
   e. Visual hint — one line describing a specific screenshot or illustration for this step. Be concrete: name the actual UI element, modal, or artefact shown. Never write "product UI" or "dashboard screenshot" — say which screen, which button, which row.
   f. Micro-trust signal — one short line (under 10 words) that removes the friction at this exact step. Examples: "no credit card", "imports preserved", "your data stays in {{integration_or_tool_we_connect_to}}", "undo any time".

4. Wrap line — one sentence under the three steps stating the outcome plus total time-to-value. Pattern: "Your first {{outcome_in_buyers_words}} live in under [honest total]." The total must equal the sum of the three step times.

Hard constraints on the steps themselves:
- Step 1 must remove the "this requires too much from me" objection. The reader should not need to prep data, write copy, or invite teammates before they can click. Whatever Step 1 asks for must be available in the reader's browser tab right now.
- Step 2 must be the moment the product does the heavy lifting on their behalf — the reader makes one decision, the tool produces the draft / match / asset.
- Step 3 must produce an outcome adjacent to ${niche.conversionGoal} — a result the reader can show, ship, share, or measure. Not "explore the dashboard". A real artefact tied to why they signed up.
- Each step ends in a tangible artefact, never a vague state.
- Use the placeholders {{outcome_in_buyers_words}} and {{integration_or_tool_we_connect_to}} verbatim where they belong — leave them un-filled so the founder can swap in their language.

After the 3-step version, output a second block titled:

"If 3 steps is too few — the 5-step version"

In this block, expand the same flow into 5 steps using the same field structure (label, body, time, visual hint, micro-trust signal). Keep the artefact-per-step rule. Keep the honest total time. The 5-step version is for founders whose onboarding genuinely has more surface area (data import, team invite, customisation) — do not pad with fake steps.

Tone reminder: ${niche.brandTone}. Voice = direct, specific, calm. Numbers over adjectives. Verbs over nouns. The reader should finish this section thinking "okay, I could actually do that today" — not "wow, what a platform."`,
      tags: ['how-it-works', 'landing-page', 'onboarding', 'process', niche.slug],
      difficulty: 'beginner',
      aiTool: 'any',
      outputType: 'creative',
    };
  },
};
