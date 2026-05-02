// SERVER-ONLY SQLite connection. Singleton across hot reloads in dev.
import 'server-only';
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { existsSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import * as schema from './schema';

type DrizzleDb = ReturnType<typeof drizzle<typeof schema>>;

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

// Reuse the connection across Next dev hot reloads.
const globalForDb = globalThis as unknown as {
  __ps_sqlite?: Database.Database;
  __ps_drizzle?: DrizzleDb;
};

function openSqlite(): Database.Database {
  if (globalForDb.__ps_sqlite) return globalForDb.__ps_sqlite;
  const dbPath = resolveDbPath();
  const dbDir = path.dirname(dbPath);
  if (!existsSync(dbDir)) mkdirSync(dbDir, { recursive: true });
  const sqlite = new Database(dbPath, { fileMustExist: false });
  // busy_timeout FIRST so the journal_mode pragma retries under contention
  // (e.g. parallel `next build` workers) instead of failing immediately.
  sqlite.pragma('busy_timeout = 5000');
  sqlite.pragma('journal_mode = WAL');
  sqlite.pragma('foreign_keys = ON');
  sqlite.pragma('synchronous = NORMAL');
  globalForDb.__ps_sqlite = sqlite;
  return sqlite;
}

function getDb(): DrizzleDb {
  if (globalForDb.__ps_drizzle) return globalForDb.__ps_drizzle;
  const d = drizzle(openSqlite(), { schema });
  globalForDb.__ps_drizzle = d;
  return d;
}

// Lazy proxies: the connection only opens on first property access (i.e.
// inside a request handler / migration script), NOT at module load. This
// keeps `next build`'s page-data collection from opening the DB at all.
export const db: DrizzleDb = new Proxy({} as DrizzleDb, {
  get(_t, prop) {
    return (getDb() as any)[prop];
  },
});

export const sqliteHandle: Database.Database = new Proxy(
  {} as Database.Database,
  {
    get(_t, prop) {
      return (openSqlite() as any)[prop];
    },
  },
);

export { schema };
