// Generates the 500-prompt "Claude Design" pack from niches × section templates.
//   Niches:   scripts/claude-design/niches.js                 (50 niches)
//   Sections: scripts/claude-design/sections/<slug>.js        (10 sections, fixed order)
// Writes one JSON file per niche to src/data/prompts/claude-design/<niche>.json
// in the same shape the rest of the prompt library uses, so build-all-prompts.js
// picks it up automatically.
//
//   node scripts/generate-claude-design.js
//
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const NICHES = require(path.join(__dirname, 'claude-design', 'niches.js'));
const OUT_DIR = path.join(ROOT, 'src', 'data', 'prompts', 'claude-design');

// Canonical section order — also the prompt-numbering order within each niche.
const SECTION_ORDER = [
  'hero',
  'features',
  'pricing',
  'faq',
  'testimonials',
  'cta',
  'brand-voice',
  'seo',
  'how-it-works',
  'footer',
];
const SECTIONS = SECTION_ORDER.map((slug) => {
  const mod = require(path.join(__dirname, 'claude-design', 'sections', `${slug}.js`));
  if (mod.slug !== slug) {
    throw new Error(`Section file ${slug}.js declares slug='${mod.slug}' — must match filename`);
  }
  if (typeof mod.render !== 'function') {
    throw new Error(`Section ${slug} has no render() function`);
  }
  return mod;
});

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

// Free-preview allowlist. Exactly 3 prompts in the entire pack are free —
// just enough to taste the format across very different niches; everything
// else nudges the buyer to upgrade.
const FREE_PREVIEW = new Set([
  'saas-b2b/hero',
  'edtech-app/hero',
  'restaurant/hero',
]);

const allIds = new Set();
let totalPrompts = 0;
let totalFiles = 0;
let totalFree = 0;

for (const niche of NICHES) {
  const prompts = SECTIONS.map((section, idx) => {
    const rendered = section.render(niche);
    const num = String(idx + 1).padStart(3, '0');
    const id = `claude-design-${niche.slug}-${num}`;
    if (allIds.has(id)) {
      throw new Error(`Duplicate prompt id: ${id}`);
    }
    allIds.add(id);
    const isFree = FREE_PREVIEW.has(`${niche.slug}/${section.slug}`);
    if (isFree) totalFree++;
    return {
      id,
      title: rendered.title,
      prompt: rendered.prompt,
      category: 'claude-design',
      subcategory: niche.slug,
      tags: rendered.tags,
      difficulty: rendered.difficulty,
      aiTool: rendered.aiTool,
      outputType: rendered.outputType,
      isFree,
    };
  });

  const file = {
    category: 'claude-design',
    subcategory: niche.slug,
    count: prompts.length,
    prompts,
  };

  const outPath = path.join(OUT_DIR, `${niche.slug}.json`);
  fs.writeFileSync(outPath, JSON.stringify(file, null, 2));
  totalFiles++;
  totalPrompts += prompts.length;
}

console.log(
  `[claude-design] wrote ${totalFiles} files / ${totalPrompts} prompts → ${path.relative(ROOT, OUT_DIR)}`,
);
console.log(
  `[claude-design] niches: ${NICHES.length}, sections per niche: ${SECTIONS.length}, free preview: ${totalFree}`,
);
