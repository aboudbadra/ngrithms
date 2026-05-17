import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { type RouteMeta } from '@analogjs/router';

export const routeMeta: RouteMeta = {
  title: '@ngrithms — Modern Angular utilities',
  meta: [
    { name: 'description', content: 'A family of small, focused Angular libraries. Standalone, signal-first, SSR-safe, zero runtime dependencies.' },
  ],
};

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  template: `
    <header class="site-header">
      <a routerLink="/" class="brand">&#64;ngrithms</a>
      <nav>
        <a href="https://github.com/aboudbadra" target="_blank" rel="noopener">GitHub</a>
        <a href="https://www.npmjs.com/org/ngrithms" target="_blank" rel="noopener">npm</a>
      </nav>
    </header>

    <main>
      <section class="hero">
        <h1>Modern Angular utilities.</h1>
        <p class="tagline">
          Small, focused libraries built for Angular 17+.
          Standalone, signal-first, SSR-safe, zero runtime dependencies.
        </p>
      </section>

      <section class="libs">
        <h2>Libraries</h2>
        <ul class="lib-list">
          <li>
            <a routerLink="/cookie-consent" class="lib-card">
              <div class="lib-name">&#64;ngrithms/cookie-consent</div>
              <div class="lib-desc">Modern cookie-consent banner with Google Consent Mode v2.</div>
              <div class="lib-status">v0.4 &middot; approaching 1.0</div>
            </a>
          </li>
          <li class="lib-card lib-card--soon">
            <div class="lib-name">&#64;ngrithms/idle</div>
            <div class="lib-desc">Signal-first user-inactivity detector.</div>
            <div class="lib-status">in development</div>
          </li>
        </ul>
        <p class="more-soon">More on the way: <code>&#64;ngrithms/confirm</code>, <code>&#64;ngrithms/scroll-reveal</code>, <code>&#64;ngrithms/clipboard-toast</code>, <code>&#64;ngrithms/form-errors</code>, <code>&#64;ngrithms/storage</code>.</p>
      </section>
    </main>

    <footer class="site-footer">
      MIT &middot; built by <a href="https://github.com/aboudbadra" target="_blank" rel="noopener">aboudbadra</a>
    </footer>
  `,
  styles: `
    :host { display: block; }

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
    .site-header nav { display: flex; gap: 1.5rem; }
    .site-header nav a {
      color: var(--ngr-muted);
      text-decoration: none;
      font-size: 0.95rem;
    }
    .site-header nav a:hover { color: var(--ngr-fg); }

    .hero { padding: 4rem 0 3rem; }
    .hero h1 {
      font-size: clamp(2rem, 5vw, 3rem);
      margin: 0 0 1rem;
      letter-spacing: -0.02em;
    }
    .tagline {
      font-size: 1.1rem;
      color: var(--ngr-muted);
      max-width: 36rem;
      margin: 0 auto;
      line-height: 1.6;
    }

    .libs h2 {
      font-size: 1rem;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--ngr-muted);
      margin-bottom: 1.5rem;
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
    .lib-card--soon { opacity: 0.6; }
    .lib-name { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 0.95rem; margin-bottom: 0.25rem; }
    .lib-desc { color: var(--ngr-muted); font-size: 0.9rem; margin-bottom: 0.5rem; }
    .lib-status { font-size: 0.8rem; color: var(--ngr-muted); }

    .more-soon { font-size: 0.85rem; color: var(--ngr-muted); }
    .more-soon code { font-size: 0.85rem; }

    .site-footer {
      margin-top: 4rem;
      padding-top: 2rem;
      border-top: 1px solid var(--ngr-border);
      font-size: 0.85rem;
      color: var(--ngr-muted);
    }
    .site-footer a { color: inherit; }
  `,
})
export default class Home {}
