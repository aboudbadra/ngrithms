import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { type RouteMeta } from '@analogjs/router';
import { LIBRARIES } from '../../data/libraries';
import { SiteShellComponent } from '../shell/site-shell.component';

export const routeMeta: RouteMeta = {
  title: '@ngrithms — Modern Angular utilities',
  meta: [
    {
      name: 'description',
      content:
        'A family of small, focused Angular libraries. Standalone, signal-first, SSR-safe, zero runtime dependencies.',
    },
  ],
};

@Component({
  selector: 'app-home',
  imports: [RouterLink, SiteShellComponent],
  template: `
    <app-site-shell>
      <section class="hero">
        <h1>Modern Angular utilities.</h1>
        <p class="tagline">
          Small, focused libraries built for Angular 17+.
          Standalone, signal-first, SSR-safe, zero runtime dependencies.
        </p>
      </section>

      <section class="section libs">
        <h2>Libraries</h2>
        <ul class="lib-list">
          @for (lib of libraries; track lib.pkg) {
            <li>
              <a [routerLink]="['/', lib.slug]" class="lib-card">
                <div class="lib-name">{{ lib.pkg }}</div>
                <div class="lib-desc">{{ lib.description }}</div>
                <div class="lib-status">v{{ lib.version }} &middot; live demo</div>
              </a>
            </li>
          }
        </ul>
        <p class="more-soon">
          Follow <a href="https://github.com/aboudbadra" target="_blank" rel="noopener">GitHub</a>
          for new libraries as they land.
        </p>
      </section>
    </app-site-shell>
  `,
  styles: `
    .hero { padding: 4rem 0 3rem; text-align: center; }
    .hero h1 {
      font-size: clamp(2rem, 5vw, 3rem);
      margin: 0 0 1rem;
      letter-spacing: -0.02em;
    }
    .hero .tagline {
      font-size: 1.1rem;
      max-width: 36rem;
      margin: 0 auto;
    }

    .lib-list {
      list-style: none;
      padding: 0;
      margin: 0 0 2rem;
      display: grid;
      gap: 1rem;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    }
    .lib-card {
      display: block;
      text-align: left;
      padding: 1.25rem;
      border: 1px solid var(--ngr-border);
      border-radius: 8px;
      text-decoration: none;
      color: inherit;
      transition: border-color 120ms ease;
    }
    .lib-card:hover { border-color: var(--ngr-accent); }
    .lib-name {
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      font-size: 0.95rem;
      margin-bottom: 0.25rem;
    }
    .lib-desc {
      color: var(--ngr-muted);
      font-size: 0.9rem;
      margin-bottom: 0.5rem;
    }
    .lib-status { font-size: 0.8rem; color: var(--ngr-muted); }

    .more-soon { font-size: 0.85rem; color: var(--ngr-muted); }
    .more-soon a { color: inherit; text-decoration: underline; }
  `,
})
export default class Home {
  protected readonly libraries = LIBRARIES;
}
