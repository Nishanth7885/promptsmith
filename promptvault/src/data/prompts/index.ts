// Master prompt data export.
// All-prompts JSON is built by `scripts/build-all-prompts.js` before `next build`.
// Run `node scripts/build-all-prompts.js` after editing any per-subcategory JSON.

import type { Prompt } from '@/types';
import allPromptsData from './all-prompts.json';

export {
  categories,
  getCategoryBySlug,
  totalPromptCount,
  totalSubcategoryCount,
} from './metadata';

export const allPrompts: Prompt[] = allPromptsData as Prompt[];

export const getPromptsByCategory = (categorySlug: string): Prompt[] =>
  allPrompts.filter((p) => p.category === categorySlug);

export const getPromptsBySubcategory = (
  categorySlug: string,
  subcategorySlug: string,
): Prompt[] =>
  allPrompts.filter(
    (p) => p.category === categorySlug && p.subcategory === subcategorySlug,
  );

export const getFreePrompts = (): Prompt[] => allPrompts.filter((p) => p.isFree);

export const getPromptById = (id: string): Prompt | undefined =>
  allPrompts.find((p) => p.id === id);
