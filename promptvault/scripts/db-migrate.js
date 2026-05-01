// Apply Drizzle migrations to the SQLite DB.
//   npm run db:migrate
//
// Plain CommonJS so production deploys can run it with `node` without needing
// `tsx` from devDependencies.
const { loadEnvConfig } = require('@next/env');
loadEnvConfig(process.cwd());

const Database = require('better-sqlite3');
const { drizzle } = require('drizzle-orm/better-sqlite3');
const { migrate } = require('drizzle-orm/better-sqlite3/migrator');
const { existsSync, mkdirSync } = require('node:fs');
const path = require('node:path');

function resolveDbPath() {
  const url = process.env.DATABASE_URL || 'file:./data/promptsmith.db';
  if (!url.startsWith('file:')) throw new Error('DATABASE_URL must start with file:');
  const raw = url.slice('file:'.length);
  return path.isAbsolute(raw) ? raw : path.join(process.cwd(), raw);
}

const dbPath = resolveDbPath();
const dbDir = path.dirname(dbPath);
if (!existsSync(dbDir)) mkdirSync(dbDir, { recursive: true });

console.log(`[migrate] db: ${dbPath}`);
const sqlite = new Database(dbPath);
sqlite.pragma('journal_mode = WAL');
sqlite.pragma('foreign_keys = ON');

const db = drizzle(sqlite);
migrate(db, { migrationsFolder: './drizzle' });
console.log('[migrate] done');
sqlite.close();
