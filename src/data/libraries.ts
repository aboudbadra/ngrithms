/**
 * Single source of truth for library metadata shown across the site.
 *
 * Version fields are kept in sync with npm by running `npm run sync-versions`
 * — that script hits the npm registry and rewrites the `version` strings
 * below. Don't edit `version` by hand; everything else is hand-curated.
 */

export interface LibraryInfo {
  /** npm scope-qualified name, e.g. '@ngrithms/hotkeys'. */
  pkg: string;
  /** Path slug for the site route, e.g. 'hotkeys' (no leading slash). */
  slug: string;
  /** One-line marketing line on the home page card. */
  description: string;
  /** Latest published version from npm. Synced automatically. */
  version: string;
  /** GitHub repo URL. */
  github: string;
  /** Optional deployed demo URL (the full Features / Quick Start / API / Examples app). */
  demo?: string;
}

export const LIBRARIES: readonly LibraryInfo[] = [
  {
    pkg: '@ngrithms/cookie-consent',
    slug: 'cookie-consent',
    description:
      'Modern cookie-consent banner, modal, and badge — with Google Consent Mode v2.',
    version: '0.6.0',
    github: 'https://github.com/aboudbadra/ngrithms-cookie-consent',
  },
  {
    pkg: '@ngrithms/hotkeys',
    slug: 'hotkeys',
    description:
      'Signal-first keyboard shortcuts — directives, scopes, sequences, and a searchable cheatsheet.',
    version: '0.1.0',
    github: 'https://github.com/aboudbadra/ngrithms-hotkeys',
  },
  {
    pkg: '@ngrithms/idle',
    slug: 'idle',
    description:
      'Signal-first user-inactivity detector with multi-tab sync and a sleep watchdog.',
    version: '0.4.1',
    github: 'https://github.com/aboudbadra/ngrithms-idle',
  },
] as const;

/** Lookup a library by slug. Throws if missing — keeps page code honest. */
export function getLibrary(slug: string): LibraryInfo {
  const found = LIBRARIES.find((l) => l.slug === slug);
  if (!found) throw new Error(`No library registered for slug "${slug}"`);
  return found;
}

/** npm package URL for a library. */
export function npmUrl(lib: LibraryInfo): string {
  return `https://www.npmjs.com/package/${lib.pkg}`;
}

/** Changelog URL on GitHub for a library. */
export function changelogUrl(lib: LibraryInfo): string {
  return `${lib.github}/blob/master/CHANGELOG.md`;
}
