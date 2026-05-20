import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { type RouteMeta } from '@analogjs/router';
import { LIBRARIES, type LibraryInfo } from '../../data/libraries';
import releasesData from '../../data/releases.json';
import { SiteShellComponent } from '../shell/site-shell.component';

export const routeMeta: RouteMeta = {
  title: "What's new — @ngrithms",
  meta: [
    {
      name: 'description',
      content:
        'Release history for every library in the @ngrithms family — cookie-consent, hotkeys, idle.',
    },
  ],
};

interface ReleaseEntry {
  tag: string;
  name: string;
  publishedAt: string;
  url: string;
  prerelease: boolean;
  sections: Record<string, string[]>;
  notes: string;
}

interface ReleasesJson {
  fetchedAt: string;
  releases: Record<string, readonly ReleaseEntry[]>;
}

interface RenderedRelease {
  lib: LibraryInfo;
  release: ReleaseEntry;
  publishedDate: string;
  hasSections: boolean;
  hasTitle: boolean;
  isLatest: boolean;
  sortKey: number;
}

type FilterValue = 'all' | string;

const SECTION_ORDER = [
  'added',
  'changed',
  'fixed',
  'deprecated',
  'removed',
  'security',
] as const;

const SECTION_TITLES: Record<string, string> = {
  added: 'Added',
  changed: 'Changed',
  fixed: 'Fixed',
  deprecated: 'Deprecated',
  removed: 'Removed',
  security: 'Security',
};

/**
 * Build the timeline. We compute "latest" per lib using the most recent
 * non-prerelease entry — pre-releases don't count as the canonical latest.
 */
function buildEntries(data: ReleasesJson): RenderedRelease[] {
  // Precompute the latest stable release URL per lib slug.
  const latestUrlBySlug = new Map<string, string>();
  for (const lib of LIBRARIES) {
    const stable = (data.releases[lib.slug] ?? [])
      .filter((r) => !r.prerelease)
      .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));
    if (stable.length > 0) {
      latestUrlBySlug.set(lib.slug, stable[0].url);
    }
  }

  const entries: RenderedRelease[] = [];
  for (const lib of LIBRARIES) {
    const list = data.releases[lib.slug] ?? [];
    for (const release of list) {
      entries.push({
        lib,
        release,
        publishedDate: release.publishedAt.slice(0, 10),
        hasSections: Object.keys(release.sections).length > 0,
        hasTitle: release.name !== '' && release.name !== release.tag,
        isLatest: latestUrlBySlug.get(lib.slug) === release.url,
        sortKey: Date.parse(release.publishedAt),
      });
    }
  }
  return entries.sort((a, b) => b.sortKey - a.sortKey);
}

@Component({
  selector: 'app-changelog',
  imports: [RouterLink, SiteShellComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-site-shell>
      <h1 class="page-title">What's new</h1>
      <p class="tagline">Release history across every library in the family.</p>

      @if (entries.length === 0) {
        <p class="muted" style="margin-top: 2rem;">No releases yet. Check back soon.</p>
      } @else {
        <div class="filters" role="group" aria-label="Filter releases by library">
          <button
            type="button"
            class="filter-chip"
            [class.filter-chip--active]="filter() === 'all'"
            (click)="setFilter('all')"
          >
            All
            <span class="filter-chip__count">{{ entries.length }}</span>
          </button>
          @for (lib of libraries; track lib.slug) {
            <button
              type="button"
              class="filter-chip"
              [class.filter-chip--active]="filter() === lib.slug"
              (click)="setFilter(lib.slug)"
            >
              {{ lib.slug }}
              <span class="filter-chip__count">{{ countFor(lib.slug) }}</span>
            </button>
          }
        </div>

        <ol class="timeline">
          @for (entry of visibleEntries(); track entry.release.url) {
            <li class="release">
              <header class="release__head">
                <a [routerLink]="['/', entry.lib.slug]" class="release__lib">
                  {{ entry.lib.pkg }}
                </a>
                <a
                  [href]="entry.release.url"
                  target="_blank"
                  rel="noopener"
                  class="release__tag"
                  [class.release__tag--prerelease]="entry.release.prerelease"
                >
                  {{ entry.release.tag }}
                  @if (entry.release.prerelease) {
                    <span class="release__prerelease">pre</span>
                  }
                </a>
                @if (entry.isLatest) {
                  <span class="release__latest" aria-label="Latest release">Latest</span>
                }
                <time class="release__date">{{ entry.publishedDate }}</time>
              </header>

              @if (entry.hasTitle) {
                <h2 class="release__title">{{ entry.release.name }}</h2>
              }

              @if (entry.hasSections) {
                @for (section of sectionOrder; track section) {
                  @if (entry.release.sections[section]; as bullets) {
                    @if (bullets.length > 0) {
                      <div class="release__section">
                        <h3
                          class="release__section-title"
                          [attr.data-kind]="section"
                        >
                          {{ sectionTitle(section) }}
                        </h3>
                        <ul class="release__bullets">
                          @for (b of bullets; track b) {
                            <li>{{ b }}</li>
                          }
                        </ul>
                      </div>
                    }
                  }
                }
              } @else if (entry.release.notes) {
                <pre class="release__notes">{{ entry.release.notes }}</pre>
              } @else {
                <p class="muted">No release notes.</p>
              }
            </li>
          }
        </ol>
      }

      <p class="footnote" style="margin-top: 2rem;">
        Last refreshed {{ fetchedAt }}. Release data is pulled from each library's
        <a href="https://github.com/aboudbadra" target="_blank" rel="noopener">GitHub Releases</a>
        at build time.
      </p>
    </app-site-shell>
  `,
  styles: `
    .filters {
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem;
      margin: 1.5rem 0 0;
    }

    .filter-chip {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      font: inherit;
      font-size: 0.85rem;
      padding: 0.35rem 0.7rem;
      border: 1px solid var(--ngr-border);
      border-radius: 999px;
      background: transparent;
      color: var(--ngr-muted);
      cursor: pointer;
      transition: border-color 120ms ease, color 120ms ease, background 120ms ease;
    }
    .filter-chip:hover {
      border-color: var(--ngr-accent);
      color: var(--ngr-fg);
    }
    .filter-chip--active {
      border-color: var(--ngr-fg);
      background: var(--ngr-fg);
      color: var(--ngr-bg);
    }
    .filter-chip__count {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 1.5em;
      padding: 0.05rem 0.4rem;
      border-radius: 999px;
      background: color-mix(in srgb, var(--ngr-muted) 18%, transparent);
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      font-size: 0.72rem;
      line-height: 1.2;
    }
    .filter-chip--active .filter-chip__count {
      background: color-mix(in srgb, var(--ngr-bg) 30%, transparent);
      color: var(--ngr-bg);
    }

    .timeline {
      list-style: none;
      padding: 0;
      margin: 1.5rem 0 0;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .release {
      border: 1px solid var(--ngr-border);
      border-radius: 8px;
      padding: 1.25rem 1.5rem;
      background: var(--ngr-bg);
    }

    .release__head {
      display: flex;
      align-items: baseline;
      flex-wrap: wrap;
      gap: 0.75rem;
      margin-bottom: 0.75rem;
    }

    .release__title {
      margin: 0 0 1rem;
      font-size: 1.05rem;
      font-weight: 600;
      line-height: 1.4;
      color: var(--ngr-fg);
      letter-spacing: -0.005em;
    }

    .release__lib {
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      font-size: 0.95rem;
      font-weight: 600;
      color: var(--ngr-fg);
      text-decoration: none;
    }
    .release__lib:hover {
      color: var(--ngr-accent);
    }

    .release__tag {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      font-size: 0.85rem;
      padding: 0.15rem 0.5rem;
      border: 1px solid var(--ngr-border);
      border-radius: 4px;
      color: var(--ngr-fg);
      text-decoration: none;
      transition: border-color 120ms ease;
    }
    .release__tag:hover {
      border-color: var(--ngr-accent);
      color: var(--ngr-accent);
    }
    .release__tag--prerelease {
      border-style: dashed;
      color: var(--ngr-muted);
    }
    .release__prerelease {
      font-size: 0.7rem;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--ngr-muted);
    }

    .release__latest {
      display: inline-flex;
      align-items: center;
      padding: 0.15rem 0.5rem;
      border-radius: 4px;
      background: color-mix(in srgb, #16a34a 12%, transparent);
      color: #16a34a;
      font-size: 0.7rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
    }
    @media (prefers-color-scheme: dark) {
      .release__latest {
        background: color-mix(in srgb, #4ade80 18%, transparent);
        color: #4ade80;
      }
    }

    .release__date {
      margin-left: auto;
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      font-size: 0.8rem;
      color: var(--ngr-muted);
    }

    .release__section {
      margin-top: 1rem;
    }
    .release__section:first-of-type {
      margin-top: 0;
    }

    .release__section-title {
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      margin: 0 0 0.5rem;
      color: var(--ngr-muted);
    }
    .release__section-title[data-kind='added'] { color: #16a34a; }
    .release__section-title[data-kind='changed'] { color: #2563eb; }
    .release__section-title[data-kind='fixed'] { color: #ca8a04; }
    .release__section-title[data-kind='deprecated'] { color: #c2410c; }
    .release__section-title[data-kind='removed'] { color: #dc2626; }
    .release__section-title[data-kind='security'] { color: #9333ea; }
    @media (prefers-color-scheme: dark) {
      .release__section-title[data-kind='added'] { color: #4ade80; }
      .release__section-title[data-kind='changed'] { color: #60a5fa; }
      .release__section-title[data-kind='fixed'] { color: #fbbf24; }
      .release__section-title[data-kind='deprecated'] { color: #fb923c; }
      .release__section-title[data-kind='removed'] { color: #f87171; }
      .release__section-title[data-kind='security'] { color: #c084fc; }
    }

    .release__bullets {
      margin: 0;
      padding-left: 1.25rem;
      color: var(--ngr-fg);
      line-height: 1.65;
    }
    .release__bullets li {
      margin: 0.15rem 0;
    }

    .release__notes {
      margin: 0;
      padding: 0;
      background: transparent;
      color: var(--ngr-fg);
      font-family: inherit;
      font-size: inherit;
      line-height: 1.65;
      white-space: pre-wrap;
      max-height: none;
      overflow: visible;
    }
  `,
})
export default class ChangelogPage {
  private readonly data = releasesData as ReleasesJson;

  protected readonly libraries = LIBRARIES;
  protected readonly entries = buildEntries(this.data);
  protected readonly sectionOrder = SECTION_ORDER;
  protected readonly fetchedAt = this.data.fetchedAt.slice(0, 10);

  protected readonly filter = signal<FilterValue>('all');

  protected readonly visibleEntries = computed(() => {
    const f = this.filter();
    if (f === 'all') return this.entries;
    return this.entries.filter((e) => e.lib.slug === f);
  });

  protected setFilter(value: FilterValue): void {
    this.filter.set(value);
  }

  protected countFor(slug: string): number {
    return this.entries.filter((e) => e.lib.slug === slug).length;
  }

  protected sectionTitle(key: string): string {
    return SECTION_TITLES[key] ?? key;
  }
}
