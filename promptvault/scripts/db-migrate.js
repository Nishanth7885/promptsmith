// Idempotent migration runner.
//
// Why custom: the project's `drizzle/meta/_journal.json` was historically
// out of sync with the .sql files in `drizzle/`, so prod ended up with raw
// SQL applied directly to the DB without rows in `__drizzle_migrations`.
// drizzle-orm's official `migrate()` would now try to re-apply those
// statements and fail with "duplicate column name" / "table exists".
//
// This runner:
//   1. Reads `_journal.json` for the canonical migration order.
//   2. For each entry, reads `<tag>.sql`, computes its sha256.
//   3. Skips if the hash is already in `__drizzle_migrations`.
//   4. Otherwise executes each statement (split on `--> statement-breakpoint`),
//      treating "already exists" errors as no-ops so partially-applied DBs
//      heal themselves on next run.
//   5. Records the hash in `__drizzle_migrations` so future runs skip cleanly.
//
// Hash format matches drizzle-orm's migrator (sha256 hex of file contents),
// so a DB migrated by this script is interchangeable with one migrated by
// `drizzle-kit migrate`.

const { loadEnvConfig } = require('@next/env');
loadEnvConfig(process.cwd());

const Database = require('better-sqlite3');
const { createHash } = require('node:crypto');
const { readFileSync, existsSync, mkdirSync } = require('node:fs');
const path = require('node:path');

function resolveDbPath() {
  const url = process.env.DATABASE_URL || 'file:./data/promptsmith.db';
  if (!url.startsWith('file:')) throw new Error('DATABASE_URL must start with file:');
  const raw = url.slice('file:'.length);
  return path.isAbsolute(raw) ? raw : path.join(process.cwd(), raw);
}

const IGNORABLE_ERRORS = [
  /duplicate column name/i,
  /already exists/i,
  /no such column/i, // happens when a DROP COLUMN runs against a column we never had
];

function isIgnorable(err) {
  return IGNORABLE_ERRORS.some((re) => re.test(err.message || ''));
}

const dbPath = resolveDbPath();
const dbDir = path.dirname(dbPath);
if (!existsSync(dbDir)) mkdirSync(dbDir, { recursive: true });

console.log(`[migrate] db: ${dbPath}`);
const db = new Database(dbPath);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS __drizzle_migrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    hash TEXT NOT NULL,
    created_at INTEGER
  )
`);

const journalPath = path.join(process.cwd(), 'drizzle', 'meta', '_journal.json');
if (!existsSync(journalPath)) {
  console.error(`[migrate] missing ${journalPath}`);
  process.exit(1);
}
const journal = JSON.parse(readFileSync(journalPath, 'utf8'));
const entries = Array.isArray(journal.entries) ? journal.entries : [];

const knownHashes = new Set(
  db.prepare('SELECT hash FROM __drizzle_migrations').all().map((r) => r.hash),
);

let applied = 0;
let healed = 0;
let skipped = 0;

for (const entry of entries) {
  const sqlPath = path.join(process.cwd(), 'drizzle', `${entry.tag}.sql`);
  if (!existsSync(sqlPath)) {
    console.error(`[migrate] missing SQL file for ${entry.tag} — abort`);
    process.exit(1);
  }
  const sql = readFileSync(sqlPath, 'utf8');
  const hash = createHash('sha256').update(sql).digest('hex');

  if (knownHashes.has(hash)) {
    skipped += 1;
    continue;
  }

  const statements = sql
    .split(/-->\s*statement-breakpoint/i)
    .map((s) => s.trim())
    .filter(Boolean);

  let healCount = 0;
  const tx = db.transaction(() => {
    for (const stmt of statements) {
      try {
        db.exec(stmt);
      } catch (err) {
        if (isIgnorable(err)) {
          healCount += 1;
          continue;
        }
        throw new Error(`[migrate] ${entry.tag} failed on:\n${stmt}\n→ ${err.message}`);
      }
    }
    db.prepare('INSERT INTO __drizzle_migrations (hash, created_at) VALUES (?, ?)').run(
      hash,
      Date.now(),
    );
  });
  tx();

  if (healCount > 0) {
    console.log(`[migrate] ${entry.tag} — healed (${healCount} statement(s) already applied)`);
    healed += 1;
  } else {
    console.log(`[migrate] ${entry.tag} — applied`);
    applied += 1;
  }
}

console.log(
  `[migrate] done — applied=${applied} healed=${healed} skipped=${skipped} total=${entries.length}`,
);
db.close();
