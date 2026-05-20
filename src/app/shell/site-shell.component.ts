import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { type LibraryInfo, npmUrl } from '../../data/libraries';

/**
 * Site-wide page chrome: brand mark + nav + footer. Page content goes in the
 * default `<ng-content>` slot.
 *
 * @example
 *   <app-site-shell [lib]="lib">
 *     <h1 class="page-title">@ngrithms/foo</h1>
 *     ...
 *   </app-site-shell>
 *
 * Three nav variants:
 * - With a `[lib]` input → "Home · GitHub · npm" (lib-specific URLs).
 * - With `simpleNav` flag → just "Home" (used by /privacy).
 * - Otherwise → org-level "GitHub · npm" (used by the index page).
 */
@Component({
  selector: 'app-site-shell',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="site-header">
      <a routerLink="/" class="brand">&#64;ngrithms</a>
      <nav>
        @if (lib(); as currentLib) {
          <a routerLink="/">Home</a>
          <a routerLink="/changelog" routerLinkActive="active">What's new</a>
          <a [href]="currentLib.github" target="_blank" rel="noopener">GitHub</a>
          <a [href]="npmHref()" target="_blank" rel="noopener">npm</a>
        } @else if (simpleNav()) {
          <a routerLink="/">Home</a>
          <a routerLink="/changelog" routerLinkActive="active">What's new</a>
        } @else {
          <a routerLink="/changelog" routerLinkActive="active">What's new</a>
          <a href="https://github.com/aboudbadra" target="_blank" rel="noopener">GitHub</a>
          <a href="https://www.npmjs.com/org/ngrithms" target="_blank" rel="noopener">npm</a>
        }
      </nav>
    </header>

    <main><ng-content /></main>

    <footer class="site-footer">
      MIT &middot; built by
      <a href="https://github.com/aboudbadra" target="_blank" rel="noopener">aboudbadra</a>
    </footer>
  `,
  styles: `
    :host {
      display: block;
    }
    .site-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 2rem;
      border-bottom: 1px solid var(--ngr-border);
    }
    .site-header .brand {
      font-weight: 600;
      font-size: 1.1rem;
      color: var(--ngr-fg);
      text-decoration: none;
    }
    .site-header nav {
      display: flex;
      gap: 1.5rem;
    }
    .site-header nav a {
      color: var(--ngr-muted);
      text-decoration: none;
      font-size: 0.95rem;
    }
    .site-header nav a:hover {
      color: var(--ngr-fg);
    }
    .site-header nav a.active {
      color: var(--ngr-fg);
    }

    main {
      padding: 3rem 0 6rem;
    }

    .site-footer {
      margin-top: 4rem;
      padding-top: 2rem;
      border-top: 1px solid var(--ngr-border);
      font-size: 0.85rem;
      color: var(--ngr-muted);
    }
    .site-footer a {
      color: inherit;
    }
  `,
})
export class SiteShellComponent {
  readonly lib = input<LibraryInfo | null>(null);
  readonly simpleNav = input(false);

  protected readonly npmHref = computed(() => {
    const currentLib = this.lib();
    return currentLib ? npmUrl(currentLib) : '';
  });
}
