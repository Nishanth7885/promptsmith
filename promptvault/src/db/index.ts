// SERVER-ONLY SQLite connection. Singleton across hot reloads in dev.
import 'server-only';
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { existsSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import * as schema from './schema';

function resolveDbPath(): string {
  const url = process.env.DATABASE_URL ?? 'file:./data/promptsmith.db';
  if (!url.startsWith('file:')) {
    throw new Error(
      `DATABASE_URL must start with "file:" (got: ${url}). Prompt Smith uses SQLite.`,
    );
  }
  const raw = url.slice('file:'.length);
  return path.isAbsolute(raw) ? raw : path.join(process.cwd(), raw);
}

const dbPath = resolveDbPath();
const dbDir = path.dirname(dbPath);
if (!existsSync(dbDir)) mkdirSync(dbDir, { recursive: true });

// Reuse the connection across Next dev hot reloads.
const globalForDb = globalThis as unknown as {
  __ps_sqlite?: Database.Database;
};

const sqlite =
  globalForDb.__ps_sqlite ??
  new Database(dbPath, {
    fileMustExist: false,
  });

if (process.env.NODE_ENV !== 'production') {
  globalForDb.__ps_sqlite = sqlite;
}

// Sensible defaults for a single-VM web app.
sqlite.pragma('journal_mode = WAL');
sqlite.pragma('foreign_keys = ON');
sqlite.pragma('synchronous = NORMAL');
sqlite.pragma('busy_timeout = 5000');

export const db = drizzle(sqlite, { schema });
export { schema };
export const sqliteHandle = sqlite;
