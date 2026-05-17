import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { type RouteMeta } from '@analogjs/router';
import {
  ConsentService,
  IfConsentDirective,
  consentToGoogleConsentObject,
  type GoogleConsentMapping,
} from '@ngrithms/cookie-consent';

export const routeMeta: RouteMeta = {
  title: '@ngrithms/cookie-consent — Modern Angular cookie consent',
  meta: [
    { name: 'description', content: 'Standalone Angular cookie consent with Google Consent Mode v2. Signal-first, SSR-safe, zero runtime dependencies.' },
  ],
};

// Swap with any YouTube video ID — used only for the gated-embed demo.
const YOUTUBE_VIDEO_ID = 'FxzBvqY5PP0';

// gtag's consent signals only steer Google's own products (GA4, Google Ads, GTM).
const GA_MAPPING: GoogleConsentMapping = {
  google_analytics: 'analytics_storage',
  google_ads: ['ad_storage', 'ad_user_data', 'ad_personalization'],
};

const GATE_KEYS = ['google_analytics', 'hotjar', 'meta_pixel', 'youtube'] as const;

@Component({
  selector: 'app-cookie-consent',
  imports: [RouterLink, IfConsentDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
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

      <p class="intro">
        The banner at the bottom of the page and the floating badge in the corner are running &#64;ngrithms/cookie-consent v0.5 against this site.
        Try the banner first &mdash; then scroll down to see how the library lets you gate embeds, drive Google Consent Mode v2, and inspect state live.
      </p>

      <section>
        <h2>Conditional rendering with <code>*ngrIfConsent</code></h2>
        <p class="section-intro">
          The iframe below only mounts when you grant <code>youtube</code> consent (via the Social Media category).
          Click <strong>Reset</strong> below, then <strong>Accept all</strong> &mdash; the video appears in real time. No reload.
        </p>

        <div class="video-wrap">
          <ng-container *ngrIfConsent="'youtube'; else youtubeBlocked">
            <iframe
              class="video"
              [src]="youtubeEmbedUrl"
              title="YouTube embed gated by ngrIfConsent"
              frameborder="0"
              allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            ></iframe>
          </ng-container>
          <ng-template #youtubeBlocked>
            <div class="video-blocked">
              <div class="video-blocked__icon" aria-hidden="true">▶</div>
              <p class="video-blocked__title">YouTube embed blocked</p>
              <p class="video-blocked__msg">Accept Social Media cookies to load this video.</p>
              <button type="button" class="btn btn--primary" (click)="consent.acceptAll()">Accept all cookies</button>
            </div>
          </ng-template>
        </div>

        <pre class="code"><code>{{ embedSnippet }}</code></pre>
      </section>

      <section>
        <h2>Quick controls</h2>
        <div class="buttons">
          <button type="button" class="btn btn--primary" (click)="consent.acceptAll()">Accept all</button>
          <button type="button" class="btn" (click)="consent.denyAll()">Reject all</button>
          <button type="button" class="btn" (click)="consent.open()">Re-open banner</button>
          <button type="button" class="btn" (click)="consent.openModal()">Open customise modal</button>
          <button type="button" class="btn btn--danger" (click)="consent.reset()">Reset (clear cookie)</button>
        </div>
      </section>

      <section>
        <h2>Inside the library</h2>
        <p class="section-intro">
          Two reactive views into what the library is doing &mdash; each paired with the setup
          it came from, so you can trace the output back to the lines that produced it.
        </p>

        <div class="subsection">
          <h3>1. Consent state</h3>
          <p>
            <code>ConsentService</code> persists user decisions in a single first-party cookie
            (<code>ngrithms_consent_state</code>). The <code>granted</code> record below is
            keyed by every <code>CookieItem.key</code> across the categories you declared at
            setup. Each toggle in the banner flips one entry.
          </p>
          <p class="setup-label">Setup &mdash; what this site registers in <code>app.config.ts</code>:</p>
          <pre class="code"><code>{{ setupConsentSnippet }}</code></pre>
          <p class="setup-label">Live state:</p>
          <div class="panel">
            <pre><code>{{ stateJson() }}</code></pre>
          </div>
        </div>

        <div class="subsection">
          <h3>2. Google Consent Mode v2 payload</h3>
          <p>
            The GA adapter bridges consent decisions to Google&rsquo;s
            <code>gtag('consent', 'update', ...)</code> API. A mapping translates your
            <code>CookieItem.key</code> values into Google&rsquo;s consent signals. Only items for
            Google&rsquo;s own products (GA4, Google Ads, GTM) belong here &mdash; tools like
            Hotjar or Meta Pixel have their own consent APIs and stay out of it.
          </p>
          <p class="setup-label">Setup &mdash; the mapping used on this page:</p>
          <pre class="code"><code>{{ setupGaMappingSnippet }}</code></pre>
          <p>
            Two ways to use it: <code>consentToGoogleConsentObject(state, mapping)</code> is a
            pure transform &mdash; that&rsquo;s what this page calls below for inspection.
            In production you&rsquo;d typically use <code>applyGoogleConsentMode</code> instead,
            which subscribes to consent changes and fires <code>gtag</code> automatically:
          </p>
          <pre class="code"><code>{{ setupApplyGaSnippet }}</code></pre>
          <p class="setup-label">Live payload:</p>
          <div class="panel">
            <pre><code>{{ gaJson() }}</code></pre>
          </div>
        </div>
      </section>

      <section>
        <h2>Reactive <code>*ngrIfConsent</code> gates</h2>
        <p class="section-intro">These flip live as you accept or reject individual cookie items.</p>
        <div class="panel gates">
          @for (key of gateKeys; track key) {
            <div class="gate-row">
              <code>{{ key }}</code>
              <span>
                <ng-container *ngrIfConsent="key; else off">granted</ng-container>
                <ng-template #off>denied</ng-template>
              </span>
            </div>
          }
        </div>
      </section>

      <section>
        <h2>Quick start</h2>
        <pre class="code"><code>{{ quickStart }}</code></pre>
        <p class="footnote">
          See the <a href="https://github.com/aboudbadra/ngrithms-cookie-consent#readme" target="_blank" rel="noopener">full README</a> for theming, custom categories, headless mode, schema migration, and the <code>ScriptLoaderService</code> for SDK loading.
        </p>
      </section>

      <section>
        <h2>Learn more</h2>
        <ul class="links">
          <li><a href="https://github.com/aboudbadra/ngrithms-cookie-consent" target="_blank" rel="noopener">README on GitHub</a></li>
          <li><a href="https://www.npmjs.com/package/@ngrithms/cookie-consent" target="_blank" rel="noopener">Package on npm</a></li>
          <li><a href="https://github.com/aboudbadra/ngrithms-cookie-consent/blob/master/CHANGELOG.md" target="_blank" rel="noopener">Changelog</a></li>
        </ul>
      </section>
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

    main { padding: 3rem 0 6rem; }
    h1 { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 1.75rem; margin: 0 0 0.5rem; }
    .tagline { color: var(--ngr-muted); margin: 0 0 1rem; }
    .install code {
      display: inline-block; padding: 0.5rem 0.75rem;
      background: var(--ngr-code-bg); border-radius: 6px;
    }
    .intro { margin: 1.5rem 0 0; color: var(--ngr-muted); line-height: 1.7; }

    section { margin-top: 3rem; }
    section > h2 {
      font-size: 1rem; text-transform: uppercase; letter-spacing: 0.08em;
      color: var(--ngr-muted); margin: 0 0 0.75rem;
    }
    section > h2 code { font-size: 0.85em; }
    .section-intro { color: var(--ngr-muted); margin: 0 0 1rem; line-height: 1.6; }

    .video-wrap {
      aspect-ratio: 16 / 9;
      border-radius: 8px;
      overflow: hidden;
      border: 1px solid var(--ngr-border);
      background: var(--ngr-code-bg);
    }
    .video { width: 100%; height: 100%; display: block; }
    .video-blocked {
      width: 100%; height: 100%;
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      gap: 0.5rem; padding: 1.5rem; text-align: center;
    }
    .video-blocked__icon {
      font-size: 2.5rem; opacity: 0.4; line-height: 1;
      margin-bottom: 0.5rem;
    }
    .video-blocked__title { margin: 0; font-weight: 600; }
    .video-blocked__msg { margin: 0; color: var(--ngr-muted); font-size: 0.9rem; }
    .video-blocked .btn { margin-top: 0.5rem; }

    .buttons {
      display: flex; flex-wrap: wrap; gap: 0.5rem;
    }
    .btn {
      padding: 0.55rem 0.9rem; border: 1px solid var(--ngr-border);
      background: transparent; color: var(--ngr-fg); border-radius: 6px;
      font: inherit; cursor: pointer;
    }
    .btn:hover { border-color: var(--ngr-accent); }
    .btn--primary { background: var(--ngr-accent); border-color: var(--ngr-accent); color: white; }
    .btn--primary:hover { opacity: 0.92; }
    .btn--danger { color: #c2410c; }
    @media (prefers-color-scheme: dark) {
      .btn--danger { color: #fb923c; }
    }

    .subsection {
      border: 1px solid var(--ngr-border);
      border-radius: 8px;
      padding: 1.5rem;
      margin-top: 1.25rem;
    }
    .subsection h3 {
      font-size: 1.05rem;
      margin: 0 0 0.75rem;
    }
    .subsection p {
      color: var(--ngr-fg);
      line-height: 1.65;
      margin: 0 0 1rem;
    }
    .setup-label {
      font-size: 0.85rem;
      color: var(--ngr-muted);
      margin: 1.25rem 0 0.5rem !important;
    }
    .subsection .code { margin-bottom: 0; }
    .subsection .panel { margin-top: 0.5rem; }

    .grid {
      display: grid; gap: 1rem;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    }
    .panel {
      border: 1px solid var(--ngr-border); border-radius: 8px;
      padding: 1.25rem; background: var(--ngr-bg);
    }
    .panel h3 { margin: 0 0 0.75rem; font-size: 0.9rem; }
    .panel pre {
      margin: 0; padding: 0.75rem;
      background: var(--ngr-code-bg); border-radius: 6px;
      font-size: 0.8rem; overflow: auto; max-height: 14rem;
    }

    .gates { padding: 0.5rem 1.25rem; }
    .gate-row {
      display: flex; justify-content: space-between; align-items: center;
      padding: 0.65rem 0; border-top: 1px solid var(--ngr-border);
      font-size: 0.9rem;
    }
    .gate-row:first-of-type { border-top: 0; }
    .gate-row code { background: transparent; padding: 0; }

    .code {
      margin: 0; padding: 1rem; background: var(--ngr-code-bg);
      border-radius: 8px; font-size: 0.85rem; overflow: auto;
    }
    .footnote { color: var(--ngr-muted); font-size: 0.9rem; margin-top: 1rem; line-height: 1.6; }

    .links { padding-left: 1.25rem; }
    .links a { color: var(--ngr-accent); }
  `,
})
export default class CookieConsentPage {
  protected readonly consent = inject(ConsentService);
  private readonly sanitizer = inject(DomSanitizer);

  protected readonly gateKeys = GATE_KEYS;
  protected readonly youtubeEmbedUrl: SafeResourceUrl =
    this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}`,
    );

  protected stateJson(): string {
    return JSON.stringify(this.consent.state(), null, 2) || 'null';
  }

  protected gaJson(): string {
    return JSON.stringify(
      consentToGoogleConsentObject(this.consent.state(), GA_MAPPING),
      null,
      2,
    );
  }

  protected readonly embedSnippet = `<ng-container *ngrIfConsent="'youtube'; else blocked">
  <iframe src="https://www.youtube.com/embed/..."></iframe>
</ng-container>
<ng-template #blocked>
  <p>Accept Social Media cookies to load this video.</p>
</ng-template>`;

  protected readonly setupConsentSnippet = `import {
  provideCookieConsent, makeCategory,
  GOOGLE_ANALYTICS, HOTJAR,
  GOOGLE_ADS, META_PIXEL,
  YOUTUBE,
} from '@ngrithms/cookie-consent';

export const appConfig: ApplicationConfig = {
  providers: [
    provideCookieConsent({
      privacyPolicyUrl: '/privacy',
      defaultLanguage: 'en',
      position: 'bottom-bar',
      theme: 'default',
      categories: [
        // Pick the items you've integrated; group them however you want.
        makeCategory({
          key: 'analytics',
          name: { en: 'Analytics' },
          items: [GOOGLE_ANALYTICS, HOTJAR],
        }),
        makeCategory({
          key: 'tracking',
          name: { en: 'Tracking & Ads' },
          items: [GOOGLE_ADS, META_PIXEL],
        }),
        makeCategory({
          key: 'embeds',
          name: { en: 'Third-party embeds' },
          items: [YOUTUBE],
        }),
      ],
    }),
  ],
};`;

  protected readonly setupGaMappingSnippet = `import { type GoogleConsentMapping } from '@ngrithms/cookie-consent';

const GA_MAPPING: GoogleConsentMapping = {
  google_analytics: 'analytics_storage',
  google_ads: ['ad_storage', 'ad_user_data', 'ad_personalization'],
};`;

  protected readonly setupApplyGaSnippet = `import { applyGoogleConsentMode } from '@ngrithms/cookie-consent';

applyGoogleConsentMode(consentService, {
  mapping: GA_MAPPING,
  defaults: {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  },
});`;

  protected readonly quickStart = `// src/app/app.config.ts
import { ApplicationConfig } from '@angular/core';
import {
  provideCookieConsent, makeCategory,
  GOOGLE_ANALYTICS, GOOGLE_ADS, YOUTUBE,
} from '@ngrithms/cookie-consent';

export const appConfig: ApplicationConfig = {
  providers: [
    provideCookieConsent({
      privacyPolicyUrl: '/privacy',
      defaultLanguage: 'en',
      categories: [
        makeCategory({
          key: 'analytics',
          name: { en: 'Analytics' },
          items: [GOOGLE_ANALYTICS],
        }),
        makeCategory({
          key: 'tracking',
          name: { en: 'Tracking & Ads' },
          items: [GOOGLE_ADS],
        }),
      ],
      // Prefer the quick-start route? Drop in a preset instead:
      // categories: [ANALYTICS_PRESET, MARKETING_PRESET],
    }),
  ],
};

// src/app/app.component.ts
import { ConsentBannerComponent, ConsentBadgeComponent, IfConsentDirective } from '@ngrithms/cookie-consent';

@Component({
  imports: [ConsentBannerComponent, ConsentBadgeComponent, IfConsentDirective],
  template: \`
    <ngr-consent-banner />
    <ngr-consent-badge />

    <div *ngrIfConsent="'google_analytics'">
      <!-- only rendered after consent -->
    </div>
  \`,
})
export class AppComponent {}`;
}
