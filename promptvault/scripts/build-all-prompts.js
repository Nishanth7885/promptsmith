// Concatenates all per-subcategory JSON files into a single src/data/prompts/all-prompts.json.
// Run before `next build` (or as part of a `prebuild` npm script).
const fs = require('fs');
const path = require('path');

const PROMPTS_DIR = path.join(__dirname, '..', 'src', 'data', 'prompts');
const OUT_FILE = path.join(PROMPTS_DIR, 'all-prompts.json');

const all = [];
const ids = new Set();
let dupes = 0;
let files = 0;

for (const cat of fs.readdirSync(PROMPTS_DIR)) {
  const catDir = path.join(PROMPTS_DIR, cat);
  if (!fs.statSync(catDir).isDirectory()) continue;
  for (const f of fs.readdirSync(catDir)) {
    if (!f.endsWith('.json') || f === 'all-prompts.json') continue;
    files++;
    const data = JSON.parse(fs.readFileSync(path.join(catDir, f), 'utf8'));
    for (const p of data.prompts) {
      if (ids.has(p.id)) { dupes++; continue; }
      ids.add(p.id);
      all.push(p);
    }
  }
}

fs.writeFileSync(OUT_FILE, JSON.stringify(all, null, 0));
console.log(`built ${OUT_FILE}: ${all.length} prompts from ${files} files (${dupes} duplicates skipped)`);
