// Fuzzy search over the lightweight search index.
import Fuse from 'fuse.js';
import searchIndexData from '@/data/prompts/search-index.json';

export interface SearchEntry {
  id: string;
  title: string;
  category: string;
  subcategory: string;
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  outputType: 'text' | 'code' | 'analysis' | 'creative' | 'data';
  isFree: boolean;
  snippet: string;
}

export const searchEntries: SearchEntry[] = searchIndexData as SearchEntry[];

const fuse = new Fuse(searchEntries, {
  keys: [
    { name: 'title', weight: 0.5 },
    { name: 'tags', weight: 0.25 },
    { name: 'snippet', weight: 0.15 },
    { name: 'category', weight: 0.05 },
    { name: 'subcategory', weight: 0.05 },
  ],
  threshold: 0.34,
  ignoreLocation: true,
  minMatchCharLength: 2,
  includeScore: true,
});

export function searchPrompts(query: string, limit = 80): SearchEntry[] {
  const q = query.trim();
  if (!q) return [];
  return fuse
    .search(q, { limit })
    .map((r) => r.item);
}
