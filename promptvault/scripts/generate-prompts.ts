// Phase 3 prompt generation script.
// Reads src/data/prompts/metadata.ts, iterates subcategories, calls Claude
// (or similar) with the meta-prompt from spec section PHASE 3, and writes
// the resulting JSON to src/data/prompts/<category>/<subcategory>.json.
//
// Phase 1: placeholder only. Implement in Phase 3.

import { categories } from '../src/data/prompts/metadata';

async function main() {
  console.log(
    `Would generate prompts for ${categories.length} categories, ` +
      `${categories.reduce((n, c) => n + c.subcategories.length, 0)} subcategories.`,
  );
  // TODO (Phase 3): loop -> call LLM -> validate -> write JSON.
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
