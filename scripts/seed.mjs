// Run with: DATABASE_URL="postgresql://..." node scripts/seed.mjs
// Applies schema.sql then seed.sql to the Neon database.
import { neon } from '@neondatabase/serverless';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const url = process.env.DATABASE_URL;
if (!url) {
  console.error('Missing DATABASE_URL env var');
  process.exit(1);
}

const sql = neon(url);

function splitStatements(text) {
  return text
    .split(/;\s*(?:\r?\n|$)/)
    .map((s) => s.trim())
    .filter(Boolean);
}

async function run(file) {
  const text = readFileSync(join(__dirname, '..', file), 'utf-8');
  const statements = splitStatements(text);
  for (const stmt of statements) {
    await sql.query(stmt);
  }
  console.log(`Applied ${file} (${statements.length} statements)`);
}

await run('schema.sql');
await run('seed.sql');
console.log('Done.');
