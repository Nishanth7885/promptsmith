// Seed default settings (prices, product name). Idempotent — safe to re-run.
import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());

import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { sql } from 'drizzle-orm';
import path from 'node:path';
import * as schema from '../src/db/schema';

function resolveDbPath(): string {
  const url = process.env.DATABASE_URL ?? 'file:./data/promptsmith.db';
  const raw = url.slice('file:'.length);
  return path.isAbsolute(raw) ? raw : path.join(process.cwd(), raw);
}

const sqlite = new Database(resolveDbPath());
sqlite.pragma('foreign_keys = ON');
const db = drizzle(sqlite, { schema });

const defaults: Array<[string, string]> = [
  ['price_inr', String(process.env.DEFAULT_PRICE_INR ?? '249')],
  ['price_usd', String(process.env.DEFAULT_PRICE_USD ?? '2.99')],
  ['product_name', 'Prompt Smith — 4,000+ Expert AI Prompts'],
  ['cross_border_enabled', 'false'],
];

for (const [key, value] of defaults) {
  db.run(sql`
    INSERT INTO settings (key, value, updated_at)
    VALUES (${key}, ${value}, ${Date.now()})
    ON CONFLICT(key) DO NOTHING
  `);
}

console.log('[seed] settings seeded:', defaults.map(([k]) => k).join(', '));
sqlite.close();
