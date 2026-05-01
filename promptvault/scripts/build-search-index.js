// Builds a small client-side search index from all-prompts.json.
// Strips long prompt text, keeps fields useful for fuzzy matching.
const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, '..', 'src', 'data', 'prompts', 'all-prompts.json');
const OUT = path.join(__dirname, '..', 'src', 'data', 'prompts', 'search-index.json');

const all = JSON.parse(fs.readFileSync(SRC, 'utf8'));
const index = all.map((p) => ({
  id: p.id,
  title: p.title,
  category: p.category,
  subcategory: p.subcategory,
  tags: p.tags,
  difficulty: p.difficulty,
  outputType: p.outputType,
  isFree: p.isFree,
  // first 140 chars of prompt body for snippet preview + matching
  snippet: p.prompt.slice(0, 140),
}));

fs.writeFileSync(OUT, JSON.stringify(index));
console.log(`built ${OUT}: ${index.length} entries (${(fs.statSync(OUT).size / 1024).toFixed(0)} KB)`);
