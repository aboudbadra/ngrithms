#!/usr/bin/env node
/**
 * Sync `version` fields in src/data/libraries.ts with the latest published
 * versions on npm. Run with: `npm run sync-versions`.
 *
 * Hits https://registry.npmjs.org/<pkg>/latest for each library, then
 * rewrites the file in place. Reports what changed (or nothing if up to date).
 */

import { readFile, writeFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_FILE = resolve(__dirname, '..', 'src', 'data', 'libraries.ts');

const REGISTRY = 'https://registry.npmjs.org';

async function fetchLatestVersion(pkg) {
  const res = await fetch(`${REGISTRY}/${pkg.replace('/', '%2F')}/latest`);
  if (!res.ok) {
    throw new Error(`Failed to fetch ${pkg}: ${res.status} ${res.statusText}`);
  }
  const body = await res.json();
  if (typeof body.version !== 'string') {
    throw new Error(`Unexpected registry response for ${pkg}: no version`);
  }
  return body.version;
}

async function main() {
  const source = await readFile(DATA_FILE, 'utf8');

  // Find every {pkg: '<scope/name>', ..., version: '<x.y.z>', ...} block.
  // The pkg field comes first per the convention in libraries.ts, so we
  // anchor each replacement on a (pkg, version) pair inside the same object.
  const entryRegex = /pkg:\s*['"]([^'"]+)['"][\s\S]*?version:\s*['"]([^'"]+)['"]/g;
  const matches = [...source.matchAll(entryRegex)];

  if (matches.length === 0) {
    throw new Error(
      'No pkg/version pairs found in libraries.ts — has its shape changed?',
    );
  }

  const updates = [];
  for (const match of matches) {
    const pkg = match[1];
    const current = match[2];
    const latest = await fetchLatestVersion(pkg);
    if (latest !== current) {
      updates.push({ pkg, current, latest, match });
    } else {
      console.log(`  ✓ ${pkg.padEnd(32)} ${current} (up to date)`);
    }
  }

  if (updates.length === 0) {
    console.log('\nAll versions in sync. Nothing to write.');
    return;
  }

  let next = source;
  for (const { pkg, current, latest, match } of updates) {
    // Replace this specific entry's version field. We rebuild the full
    // matched substring with the new version interpolated.
    const original = match[0];
    const replaced = original.replace(
      /version:\s*['"][^'"]+['"]/,
      `version: '${latest}'`,
    );
    next = next.replace(original, replaced);
    console.log(`  ↑ ${pkg.padEnd(32)} ${current} → ${latest}`);
  }

  await writeFile(DATA_FILE, next, 'utf8');
  console.log(`\nUpdated ${updates.length} version(s) in src/data/libraries.ts`);
}

main().catch((err) => {
  console.error('\nsync-lib-versions failed:', err.message);
  process.exit(1);
});
