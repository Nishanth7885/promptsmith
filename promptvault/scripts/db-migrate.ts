// Apply Drizzle migrations to the SQLite DB.
//   npm run db:generate   # author migrations after editing schema.ts
//   npm run db:migrate    # apply them
import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());

import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { existsSync, mkdirSync } from 'node:fs';
import path from 'node:path';

function resolveDbPath(): string {
  const url = process.env.DATABASE_URL ?? 'file:./data/promptsmith.db';
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
