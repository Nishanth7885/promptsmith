// scripts/claude-design/sections/seo.js
module.exports = {
  slug: 'seo',
  name: 'SEO + OG + Schema',
  isFree: false,
  render(niche) {
    return {
      title: `${niche.name} — SEO Meta + OpenGraph Pack`,
      prompt: `Act as a senior technical SEO specialist (think Aleyda Solis) for ${niche.productExample}. You are writing the complete on-page SEO + OpenGraph + Schema layer for a high-intent landing page targeting ${niche.audience}, whose biggest unsolved frustration is: "${niche.painPoint}". The page's commercial job is to drive ${niche.conversionGoal}, and the brand voice should read as ${niche.brandTone}. Treat search intent as B2B vs B2C accordingly — match the literal phrasing your audience types into Google, not the phrasing a marketer wishes they typed. Every artefact below must be production-ready and copy-paste compatible with the Next.js 14+ \`metadata\` export (App Router) and a JSON-LD <script type="application/ld+json"> tag.

Use these placeholders verbatim where real values aren't known yet: \`{{your_brand_name}}\`, \`{{primary_country_or_region}}\`, \`{{date_or_year}}\`. Do NOT invent a brand name.

Produce EXACTLY this numbered SEO pack — no extras, no skipped items, no preamble:

1. URL slug — give 3 options. All kebab-case, 4-7 words, primary keyword first, no stopwords-only filler. Note which one you'd ship and why (one short line).

2. Title tag — 50-60 characters total, pixel-width-aware (avoid wide glyphs like W/M stacking past ~580px). Primary keyword must appear by character 25. Include a number or {{date_or_year}} for CTR lift. Do NOT start with the brand name. No all-caps. No clickbait ("You won't believe…", "Shocking…", etc.). Show the character count in brackets after.

3. Meta description — 150-158 characters. Must contain the primary keyword AND a CTA verb (Get, Build, Launch, Start, Book, Try, Download, Compare). End with a punchy fragment, not a full sentence. Do NOT repeat the brand name if it already appears in the title tag — pick one. Show character count in brackets.

4. H1 — matches the title tag's intent but reads more conversationally and human. Must be different wording from the title tag (not just punctuation swaps). Speak directly to ${niche.audience}.

5. OpenGraph block:
   - og:title (can mirror or improve on the title tag, up to 70 chars)
   - og:description (up to 200 chars, more benefit-led than meta description)
   - og:image alt text — TWO versions, one for the LinkedIn/B2B audience and one for the Twitter/X/casual audience, each describing the visual + value prop in <125 chars
   - og:type (article, website, product — pick correctly for ${niche.productExample})
   - og:locale (default en_US, but recommend a swap if {{primary_country_or_region}} suggests otherwise)

6. Twitter card:
   - twitter:card type recommendation (summary vs summary_large_image — justify in 1 line)
   - twitter:title — 70-character hard limit, optimised for the feed scroll
   - twitter:description — 200-char max but punchier than og:description

7. JSON-LD schema — pick the SINGLE most appropriate schema type for ${niche.productExample} from: Product, Service, Organization, FAQPage, SoftwareApplication, LocalBusiness, Course, Event, Article. Justify the pick in one sentence, then output a complete, valid JSON-LD block inside a \`\`\`json code fence. The JSON MUST be valid: double quotes only, no trailing commas, no comments, @context and @type set correctly, and use the placeholders above for unknown values. Include aggregateRating only if defensible for ${niche.socialProofType}.

8. 5 primary keywords — head + body terms, intent-matched to ${niche.conversionGoal}. Tag each with [Informational | Commercial | Transactional | Navigational].

9. 7 long-tail keywords — 4-6 words each, question-based or bottom-funnel. AT LEAST 3 of them must capture problem-aware intent tied to "${niche.painPoint}" (i.e. the searcher knows the pain but not the solution category yet).

10. 3 internal-link anchors — exact-match anchor text other pages on the site should use to link INTO this page. Keep anchors natural; avoid over-optimised exact-match stuffing.

11. Indexing directive — recommend "index, follow" for the canonical landing page; flag any variant (UTM, paginated, gated PDF, thank-you page) that should be \`noindex, nofollow\` and explain in one line. If nothing applies, write: "index, follow — no exceptions."

Hard constraints (auto-reject if violated): no clickbait phrasing, no ALL-CAPS in any title or H1, brand name never appears in BOTH title and meta description, JSON-LD must parse with \`JSON.parse\` cleanly, titles must not lead with the brand name, every keyword must reflect how ${niche.audience} genuinely searches.

Final note: format the OG/Twitter block so it can be dropped straight into a Next.js \`export const metadata = { … }\` object — use the official Next metadata API key names (\`title\`, \`description\`, \`openGraph\`, \`twitter\`, \`alternates\`, \`robots\`).`,
      tags: ['seo', 'opengraph', 'meta-tags', 'schema', 'landing-page', niche.slug],
      difficulty: 'intermediate',
      aiTool: 'any',
      outputType: 'text',
    };
  },
};
