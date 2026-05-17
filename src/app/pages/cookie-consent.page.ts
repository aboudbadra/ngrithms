import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cookie-consent',
  imports: [RouterLink],
  template: `
    <header class="site-header">
      <a routerLink="/" class="brand">&#64;ngrithms</a>
      <nav>
        <a routerLink="/">Home</a>
        <a href="https://github.com/aboudbadra/ngrithms-cookie-consent" target="_blank" rel="noopener">GitHub</a>
        <a href="https://www.npmjs.com/package/@ngrithms/cookie-consent" target="_blank" rel="noopener">npm</a>
      </nav>
    </header>

    <main>
      <h1>&#64;ngrithms/cookie-consent</h1>
      <p class="tagline">Modern Angular cookie consent &mdash; standalone, signal-first, SSR-safe, zero runtime deps.</p>

      <p class="install"><code>npm install &#64;ngrithms/cookie-consent</code></p>

      <p>Live demo &amp; docs coming soon. In the meantime:</p>
      <ul>
        <li><a href="https://github.com/aboudbadra/ngrithms-cookie-consent" target="_blank" rel="noopener">README on GitHub</a></li>
        <li><a href="https://www.npmjs.com/package/@ngrithms/cookie-consent" target="_blank" rel="noopener">Package on npm</a></li>
      </ul>
    </main>
  `,
  styles: `
    :host { display: block; text-align: left; }
    .site-header {
      display: flex; justify-content: space-between; align-items: center;
      padding-bottom: 2rem; border-bottom: 1px solid var(--ngr-border);
    }
    .site-header .brand { font-weight: 600; font-size: 1.1rem; color: var(--ngr-fg); text-decoration: none; }
    .site-header nav { display: flex; gap: 1.5rem; }
    .site-header nav a { color: var(--ngr-muted); text-decoration: none; font-size: 0.95rem; }
    .site-header nav a:hover { color: var(--ngr-fg); }

    main { padding: 3rem 0; }
    h1 { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 1.75rem; margin: 0 0 1rem; }
    .tagline { color: var(--ngr-muted); margin-bottom: 2rem; }
    .install code { display: inline-block; padding: 0.5rem 0.75rem; background: var(--ngr-code-bg); border-radius: 6px; }
    ul { padding-left: 1.25rem; }
    a { color: var(--ngr-accent); }
  `,
})
export default class CookieConsentPage {}
