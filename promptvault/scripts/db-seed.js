// Seed default settings (prices, product name). Idempotent — safe to re-run.
//
// Plain CommonJS, runs with `node` (no tsx needed in production).
const { loadEnvConfig } = require('@next/env');
loadEnvConfig(process.cwd());

const Database = require('better-sqlite3');
const { drizzle } = require('drizzle-orm/better-sqlite3');
const { sql } = require('drizzle-orm');
const path = require('node:path');

function resolveDbPath() {
  const url = process.env.DATABASE_URL || 'file:./data/promptsmith.db';
  const raw = url.slice('file:'.length);
  return path.isAbsolute(raw) ? raw : path.join(process.cwd(), raw);
}

const sqlite = new Database(resolveDbPath());
sqlite.pragma('foreign_keys = ON');
const db = drizzle(sqlite);

const defaults = [
  ['price_inr', String(process.env.DEFAULT_PRICE_INR || '299')],
  ['price_inr_category', String(process.env.DEFAULT_PRICE_INR_CATEGORY || '99')],
  ['price_usd', String(process.env.DEFAULT_PRICE_USD || '2.99')],
  ['product_name', 'Prompt Smith — 4,900+ Expert AI Prompts'],
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
