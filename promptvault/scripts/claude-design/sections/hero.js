// scripts/claude-design/sections/hero.js
// Hero Section template for the "Claude Design" 500-prompt pack.
// This is the free preview-bait section: 50 niches consume this one render().

module.exports = {
  slug: 'hero',
  name: 'Hero Section',
  isFree: true,
  render(niche) {
    const prompt = `Act as a senior conversion copywriter for a ${niche.name} startup. You have shipped hero sections for companies like Linear, Stripe, Razorpay and Superhuman. You write like Brian Clark on a deadline: short, declarative, opinionated. You do not write like an AI.

CONTEXT
- Product: ${niche.productExample}
- Target reader: ${niche.audience}
- Brand voice: ${niche.brandTone}
- Top pain point the reader is feeling RIGHT NOW: ${niche.painPoint}
- The single conversion goal of this hero: ${niche.conversionGoal}
- Social proof we can lean on: ${niche.socialProofType}
- Company name: {{your_company_name}}
- The headline metric we improve for customers: {{primary_metric_you_improve}}

TASK
Write the copy for the first 600px of the landing page — the hero block. Nothing else. No features section, no FAQ. Just the six elements below, in order, numbered, ready for a designer to drop into Figma.

OUTPUT SPEC (return exactly this structure, in this order):
1. Eyebrow tag — 3 to 5 words, ALL CAPS, no period. Names the category or the wedge (e.g. "FOR SERIES A FOUNDERS").
2. H1 — 8 to 12 words. Must speak directly to "${niche.painPoint}". Contrarian or specific, never generic. Forbidden openers: "Unlock", "Leverage", "Transform", "Empower", "Revolutionize", "Discover". Maximum 2 commas. No semicolons. No em-dashes inside the H1.
3. Subhead — exactly 1 sentence, 18 to 28 words. One concrete benefit plus one proof number (a percentage, a multiple, a dollar/INR figure, or a time saving). Must name what the product actually does, not what it "enables".
4. Primary CTA button text — 2 to 4 words, verb-led, designed to drive "${niche.conversionGoal}". No "Learn more", no "Get started" unless paired with an outcome.
5. Secondary CTA button text — low-friction, 2 to 4 words. Examples to RIFF on (do not copy): "See live demo", "Watch 90s tour", "Read the teardown".
6. Trust line — 1 sentence under the CTAs. Use the social-proof type "${niche.socialProofType}". Format like "Used by 1,200+ teams at Linear, Stripe and Notion" or "Rated 4.8 on G2 by 430 ${niche.audience.split(' ')[0]} teams". If the buyer is in India, you may use INR figures, GST-inclusive pricing, or names like Razorpay/Zerodha/CRED — but keep it readable globally.

Then output, separately, three alternative H1s labelled A / B / C — same rules, different angles (one emotional, one numeric, one contrarian). Mark the one you would ship and explain in 1 sentence why.

CONSTRAINTS (violating any of these = rewrite):
- Never use the phrases: "in today's fast-paced world", "leverage", "seamlessly", "robust", "cutting-edge", "game-changer", "unlock the power of", "take your X to the next level", "elevate".
- No rhetorical questions anywhere. No "Tired of X?" openers.
- No semicolons. No em-dashes in the H1. Maximum 2 commas per sentence in the H1.
- Subhead must contain a real number, not "many" or "tons of".
- Voice must match "${niche.brandTone}" — read every line aloud and cut anything that sounds like a press release.
- No adjective stacks ("powerful, intuitive, modern"). One adjective per noun, max.
- The primary CTA verb must map directly to "${niche.conversionGoal}" — if the goal is a free trial, do not write "Contact sales".
- Write at a 7th-grade reading level. Hemingway score 5 or lower.
- Every sentence under 20 words. If it runs longer, split it.
- Do not mention AI, Claude, GPT, or that this copy was generated.

DELIVERY
Return clean Markdown. Numbered list for the six elements. Then the A/B/C H1 variants. Then your one-sentence ship recommendation. No preamble, no "Here is your hero section", no closing pleasantries. Start at "1.".`;

    return {
      title: `${niche.name} — Hero Section That Converts`,
      prompt,
      tags: ['hero', 'landing-page', 'copywriting', 'conversion', niche.slug],
      difficulty: 'intermediate',
      aiTool: 'any',
      outputType: 'creative',
    };
  },
};
