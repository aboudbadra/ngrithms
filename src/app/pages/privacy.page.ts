import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { type RouteMeta } from '@analogjs/router';
import { SiteShellComponent } from '../shell/site-shell.component';

export const routeMeta: RouteMeta = {
  title: 'Privacy — @ngrithms',
  meta: [
    { name: 'description', content: 'Privacy disclosure for the @ngrithms site.' },
  ],
};

@Component({
  selector: 'app-privacy',
  imports: [RouterLink, SiteShellComponent],
  template: `
    <app-site-shell [simpleNav]="true">
      <div class="privacy">
        <h1 class="page-title">Privacy</h1>

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
      </div>
    </app-site-shell>
  `,
  styles: `
    .privacy { max-width: 38rem; }
    .privacy h1 { margin: 0 0 1.5rem; }
    .privacy h2 { font-size: 1.1rem; margin: 2rem 0 0.75rem; }
    .privacy p { line-height: 1.7; color: var(--ngr-fg); }
    .privacy a { color: var(--ngr-accent); }
  `,
})
export default class PrivacyPage {}
