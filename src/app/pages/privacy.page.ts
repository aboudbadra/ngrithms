import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { type RouteMeta } from '@analogjs/router';

export const routeMeta: RouteMeta = {
  title: 'Privacy — @ngrithms',
  meta: [
    { name: 'description', content: 'Privacy disclosure for the @ngrithms site.' },
  ],
};

@Component({
  selector: 'app-privacy',
  imports: [RouterLink],
  template: `
    <header class="site-header">
      <a routerLink="/" class="brand">&#64;ngrithms</a>
      <nav>
        <a routerLink="/">Home</a>
      </nav>
    </header>

    <main>
      <h1>Privacy</h1>

      <p>
        This site is the project home for the open-source
        <a routerLink="/cookie-consent">&#64;ngrithms/cookie-consent</a> library and the rest of
        the &#64;ngrithms family.
      </p>

      <h2>Cookies</h2>
      <p>
        This site does not set any analytics, advertising, or tracking cookies. The cookie
        consent banner visible on every page is a live demo of the
        <a routerLink="/cookie-consent">cookie-consent library</a> itself.
      </p>
      <p>
        When you interact with the demo banner, a single first-party cookie (named
        <code>ngrithms_consent_state</code>) is stored in your browser to remember your
        demo choices. It contains no personal data. You can clear it at any time using
        the &ldquo;Reset&rdquo; button on the demo page, or via your browser&rsquo;s cookie
        settings.
      </p>

      <h2>Hosting</h2>
      <p>
        The site is hosted on Cloudflare. Cloudflare may collect standard request metadata
        (IP address, user agent, timing) for security and performance, as described in
        <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener">Cloudflare&rsquo;s privacy policy</a>.
        No request logs are retained by &#64;ngrithms.
      </p>

      <h2>Contact</h2>
      <p>
        Questions or issues: open a discussion at
        <a href="https://github.com/aboudbadra/ngrithms" target="_blank" rel="noopener">github.com/aboudbadra/ngrithms</a>.
      </p>
    </main>
  `,
  styles: `
    :host { display: block; text-align: left; }
    .site-header {
      display: flex; justify-content: space-between; align-items: center;
      padding-bottom: 2rem; border-bottom: 1px solid var(--ngr-border);
    }
    .site-header .brand { font-weight: 600; font-size: 1.1rem; color: var(--ngr-fg); text-decoration: none; }
    .site-header nav a { color: var(--ngr-muted); text-decoration: none; font-size: 0.95rem; }
    .site-header nav a:hover { color: var(--ngr-fg); }
    main { padding: 3rem 0 6rem; max-width: 38rem; }
    h1 { margin: 0 0 1.5rem; }
    h2 { font-size: 1.1rem; margin: 2rem 0 0.75rem; }
    p { line-height: 1.7; color: var(--ngr-fg); }
    a { color: var(--ngr-accent); }
  `,
})
export default class PrivacyPage {}
