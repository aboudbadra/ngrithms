#!/usr/bin/env node
/**
 * Generate sitemap.xml from the prerendered routes after `vite build`.
 *
 * Routes come from two sources:
 *   1. Static routes hardcoded below (/, /privacy, /changelog, etc.)
 *   2. One route per library, derived from src/data/libraries.ts
 *
 * The output is written to dist/analog/public/sitemap.xml so it ships with
 * the static deploy. Run via `npm run build` (chained after vite build).
 */

import { readFile, writeFile, stat } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const DATA_FILE = resolve(ROOT, 'src', 'data', 'libraries.ts');
const OUTPUT_DIR = resolve(ROOT, 'dist', 'analog', 'public');
const OUTPUT_FILE = resolve(OUTPUT_DIR, 'sitemap.xml');

const SITE_URL = 'https://ngrithms.aalbadra.workers.dev';

const STATIC_ROUTES = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/changelog', priority: '0.7', changefreq: 'weekly' },
  { path: '/privacy', priority: '0.3', changefreq: 'yearly' },
];

/** Parse slug values from libraries.ts without importing the TS module. */
async function readLibrarySlugs() {
  const src = await readFile(DATA_FILE, 'utf8');
  const matches = [...src.matchAll(/slug:\s*['"]([^'"]+)['"]/g)];
  if (matches.length === 0) {
    throw new Error('No library slugs found in libraries.ts');
  }
  return matches.map((m) => m[1]);
}

function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function buildSitemap(routes, lastmod) {
  const urls = routes
    .map(({ path, priority, changefreq }) => {
      const loc = escapeXml(`${SITE_URL}${path}`);
      return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

async function main() {
  // Confirm output dir exists — vite build should have created it.
  try {
    await stat(OUTPUT_DIR);
  } catch {
    throw new Error(
      `Output dir not found: ${OUTPUT_DIR}\nRun 'vite build' first.`,
    );
  }

  const slugs = await readLibrarySlugs();
  const libraryRoutes = slugs.map((slug) => ({
    path: `/${slug}`,
    priority: '0.9',
    changefreq: 'weekly',
  }));

  const routes = [...STATIC_ROUTES, ...libraryRoutes].sort((a, b) =>
    a.path.localeCompare(b.path),
  );

  const today = new Date().toISOString().slice(0, 10);
  const xml = buildSitemap(routes, today);

  await writeFile(OUTPUT_FILE, xml, 'utf8');
  console.log(
    `\nWrote sitemap.xml with ${routes.length} URLs → ${OUTPUT_FILE.replace(ROOT + '/', '')}`,
  );
  for (const r of routes) {
    console.log(`  ${r.path.padEnd(20)} priority=${r.priority}`);
  }
}

main().catch((err) => {
  console.error('\nbuild-sitemap failed:', err.message);
  process.exit(1);
});
