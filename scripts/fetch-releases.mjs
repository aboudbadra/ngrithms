#!/usr/bin/env node
/**
 * Fetch the latest GitHub releases for each library and write them to
 * src/data/releases.json. Run with `npm run fetch-releases`.
 *
 * Release bodies are parsed for Keep-a-Changelog sections (`### Added`,
 * `### Changed`, `### Fixed`, `### Removed`, `### Deprecated`, `### Security`).
 * Bullets under each heading are collected; anything outside a recognized
 * heading falls into `notes`. The /changelog page consumes the JSON directly
 * so the build doesn't need a runtime fetch.
 *
 * No GitHub token needed for public repos within the unauthenticated rate
 * limit (60 requests / hour / IP). Set GITHUB_TOKEN if you hit a 403.
 */

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const DATA_FILE = resolve(ROOT, 'src', 'data', 'libraries.ts');
const OUTPUT_FILE = resolve(ROOT, 'src', 'data', 'releases.json');

const RELEASES_PER_LIB = 10;
const RECOGNIZED_SECTIONS = [
  'added',
  'changed',
  'fixed',
  'removed',
  'deprecated',
  'security',
];

/** Parse pkg/slug/github trios from libraries.ts. */
async function readLibraries() {
  const src = await readFile(DATA_FILE, 'utf8');
  // Each entry has pkg, slug, and github fields. Anchor on pkg and capture
  // until we hit the closing brace of that entry — `[\s\S]*?` keeps it lazy.
  const re = /pkg:\s*['"]([^'"]+)['"][\s\S]*?slug:\s*['"]([^'"]+)['"][\s\S]*?github:\s*['"]([^'"]+)['"]/g;
  const libs = [...src.matchAll(re)].map((m) => ({
    pkg: m[1],
    slug: m[2],
    github: m[3],
  }));
  if (libs.length === 0) {
    throw new Error('No libraries parsed from libraries.ts');
  }
  return libs;
}

/** Extract owner/repo from a GitHub URL. */
function parseGitHubUrl(url) {
  const match = url.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (!match) throw new Error(`Not a GitHub URL: ${url}`);
  return { owner: match[1], repo: match[2].replace(/\.git$/, '') };
}

/** GitHub API fetch with optional auth. */
async function ghFetch(url) {
  const headers = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  const res = await fetch(url, { headers });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`GitHub ${res.status}: ${url}\n${body.slice(0, 200)}`);
  }
  return res.json();
}

/**
 * Parse a release body into structured sections.
 * Tolerant of missing or unrecognized headings.
 */
function parseReleaseBody(body) {
  if (!body || body.trim() === '') return { sections: {}, notes: '' };

  const sections = {};
  let currentSection = null;
  const notesLines = [];

  for (const rawLine of body.split('\n')) {
    const line = rawLine.trim();
    const heading = line.match(/^#{1,3}\s+(.+)$/);
    if (heading) {
      const name = heading[1].toLowerCase().trim();
      if (RECOGNIZED_SECTIONS.includes(name)) {
        currentSection = name;
        sections[name] = sections[name] ?? [];
        continue;
      }
      // Unrecognized heading — stop accumulating under prior section.
      currentSection = null;
      notesLines.push(rawLine);
      continue;
    }

    const bullet = line.match(/^[-*]\s+(.+)$/);
    if (bullet && currentSection) {
      sections[currentSection].push(bullet[1]);
      continue;
    }

    if (!currentSection && line !== '') {
      notesLines.push(rawLine);
    }
  }

  return { sections, notes: notesLines.join('\n').trim() };
}

async function fetchReleasesFor(lib) {
  const { owner, repo } = parseGitHubUrl(lib.github);
  const url = `https://api.github.com/repos/${owner}/${repo}/releases?per_page=${RELEASES_PER_LIB}`;
  console.log(`  Fetching ${owner}/${repo}…`);
  const releases = await ghFetch(url);

  return releases
    .filter((r) => !r.draft)
    .map((r) => ({
      tag: r.tag_name,
      name: r.name ?? r.tag_name,
      publishedAt: r.published_at,
      url: r.html_url,
      prerelease: r.prerelease,
      ...parseReleaseBody(r.body ?? ''),
    }));
}

async function main() {
  const libs = await readLibraries();
  console.log(`\nFetching releases for ${libs.length} libraries…`);

  const data = {};
  for (const lib of libs) {
    try {
      data[lib.slug] = await fetchReleasesFor(lib);
      console.log(`    → ${data[lib.slug].length} release(s)`);
    } catch (err) {
      console.warn(`    ! Skipping ${lib.slug}: ${err.message}`);
      data[lib.slug] = [];
    }
  }

  const output = {
    fetchedAt: new Date().toISOString(),
    releases: data,
  };

  await mkdir(dirname(OUTPUT_FILE), { recursive: true });
  await writeFile(OUTPUT_FILE, JSON.stringify(output, null, 2) + '\n', 'utf8');

  const total = Object.values(data).reduce((sum, list) => sum + list.length, 0);
  console.log(`\nWrote ${total} release(s) → src/data/releases.json`);
}

main().catch((err) => {
  console.error('\nfetch-releases failed:', err.message);
  process.exit(1);
});
