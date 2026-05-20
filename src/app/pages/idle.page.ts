import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { type RouteMeta } from '@analogjs/router';
import { IdleService, IfIdleDirective } from '@ngrithms/idle';
import { getLibrary } from '../../data/libraries';
import { SiteShellComponent } from '../shell/site-shell.component';

const lib = getLibrary('idle');

export const routeMeta: RouteMeta = {
  title: '@ngrithms/idle — Modern Angular user-inactivity detector',
  meta: [
    {
      name: 'description',
      content:
        'Signal-first user-inactivity detector for Angular. Multi-tab sync, sleep watchdog, optional keepalive companion. Standalone, SSR-safe, zero dependencies.',
    },
  ],
};

@Component({
  selector: 'app-idle',
  imports: [SiteShellComponent, IfIdleDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-site-shell [lib]="lib">
      <h1 class="page-title">&#64;ngrithms/idle</h1>
      <p class="tagline">Signal-first user-inactivity detector for Angular &mdash; standalone, SSR-safe, zero deps.</p>
      <p class="install"><code>npm install &#64;ngrithms/idle</code></p>

      <p class="intro">
        This page runs &#64;ngrithms/idle v{{ lib.version }} with intentionally-short demo timings:
        <strong>5 s</strong> to <code>idle</code>, then <strong>10 s more</strong> to <code>timedOut</code>.
        Stop interacting and watch the state below shift. Move your mouse, type, or click
        to revive. Open the page in a second tab to see <code>multiTabSync</code> in action &mdash;
        activity in either tab keeps both alive.
      </p>

      <section class="section">
        <h2>Current state</h2>
        <div class="state-badge" [attr.data-state]="idle.state()">
          <div class="state-value">{{ idle.state() }}</div>
          @if (idle.state() === 'idle') {
            <div class="countdown">{{ idle.countdown() }}s to timeout</div>
          } @else if (idle.state() === 'timedOut') {
            <div class="countdown">Session ended</div>
          } @else {
            <div class="countdown">Watching for {{ idle.countdown() }}s of activity quiet</div>
          }
        </div>
      </section>

      <section class="section">
        <h2>Conditional rendering with <code>*ngrIfIdle</code></h2>
        <p class="section-intro">Three cards &mdash; only the one matching the current state mounts:</p>
        <div class="if-cards">
          <div class="if-card if-card--active" *ngrIfIdle="'active'">
            <div class="if-card__title">ACTIVE</div>
            <p>The user is interacting normally. Render features that depend on a live session here.</p>
          </div>
          <div class="if-card if-card--idle" *ngrIfIdle>
            <div class="if-card__title">IDLE</div>
            <p>The user has been quiet for the configured <code>idleAfter</code>. Classic spot for an &ldquo;Are you still there?&rdquo; modal with a countdown.</p>
          </div>
          <div class="if-card if-card--timedOut" *ngrIfIdle="'timedOut'">
            <div class="if-card__title">TIMED OUT</div>
            <p>The full quiet window elapsed. Render the &ldquo;session expired&rdquo; UI here, or call a logout endpoint via <code>onTimeout$</code>.</p>
          </div>
        </div>
      </section>

      <section class="section">
        <h2>Quick controls</h2>
        <div class="watch-status" [attr.data-on]="watching()">
          <span class="watch-dot" aria-hidden="true"></span>
          {{ watching() ? 'Watching for activity' : 'Watching paused' }}
        </div>
        <div class="buttons">
          <button type="button" class="btn btn--primary" (click)="idle.reset()">Reset to active</button>
          <button type="button" class="btn" [disabled]="!watching()" (click)="idle.stop()">Stop watching</button>
          <button type="button" class="btn" [disabled]="watching()" (click)="idle.watch()">Resume watching</button>
        </div>
      </section>

      <section class="section">
        <h2>Inside the library</h2>
        <p class="section-intro">
          The live signals exposed by <code>IdleService</code>. Updates push reactively as the state
          machine transitions and as you interact with the page.
        </p>
        <div class="grid">
          <div class="panel">
            <h3>Setup</h3>
            <pre><code>{{ setupSnippet }}</code></pre>
          </div>
          <div class="panel">
            <h3>Live signals</h3>
            <pre><code>{{ stateJson() }}</code></pre>
          </div>
        </div>
      </section>

      <section class="section">
        <h2>Quick start</h2>
        <pre class="code"><code>{{ quickStart }}</code></pre>
        <p class="footnote">
          See the <a [href]="readmeHref" target="_blank" rel="noopener">full README</a> for multi-tab sync flags, the sleep watchdog, the <code>onSystemSleep</code> option, and the <code>&#64;ngrithms/idle/keepalive</code> secondary entry point for server-side session syncing.
        </p>
      </section>

      <section class="section">
        <h2>Learn more</h2>
        <ul class="links">
          <li>
            <a class="pill" [href]="lib.github" target="_blank" rel="noopener">
              <svg class="pill-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
              <span>GitHub</span>
              <svg class="pill-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>
            </a>
          </li>
          <li>
            <a class="pill" [href]="npmHref" target="_blank" rel="noopener">
              <svg class="pill-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
              <span>npm</span>
              <svg class="pill-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>
            </a>
          </li>
          <li>
            <a class="pill" [href]="changelogHref" target="_blank" rel="noopener">
              <svg class="pill-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>
              <span>Changelog</span>
              <svg class="pill-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>
            </a>
          </li>
        </ul>
      </section>
    </app-site-shell>
  `,
  styles: `
    .state-badge {
      border: 1px solid var(--ngr-border);
      border-radius: 12px;
      padding: 1.5rem;
      text-align: center;
      background: var(--ngr-bg);
      transition: border-color 200ms ease, background 200ms ease;
    }
    .state-badge[data-state='active'] {
      border-color: #10b981;
      background: color-mix(in srgb, #10b981 8%, transparent);
    }
    .state-badge[data-state='idle'] {
      border-color: #f59e0b;
      background: color-mix(in srgb, #f59e0b 10%, transparent);
    }
    .state-badge[data-state='timedOut'] {
      border-color: #ef4444;
      background: color-mix(in srgb, #ef4444 10%, transparent);
    }
    .state-value {
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      font-size: 1.5rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      margin-bottom: 0.25rem;
    }
    .countdown { color: var(--ngr-muted); font-size: 0.95rem; }

    .if-cards { display: grid; gap: 0.75rem; }
    .if-card {
      border: 1px solid var(--ngr-border);
      border-radius: 8px;
      padding: 1rem 1.25rem;
    }
    .if-card__title {
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      font-weight: 600;
      font-size: 0.85rem;
      letter-spacing: 0.06em;
      margin-bottom: 0.5rem;
    }
    .if-card p { margin: 0; color: var(--ngr-muted); line-height: 1.6; }
    .if-card--active { border-color: #10b981; }
    .if-card--idle { border-color: #f59e0b; }
    .if-card--timedOut { border-color: #ef4444; }

    .watch-status {
      display: inline-flex; align-items: center; gap: 0.5rem;
      padding: 0.35rem 0.7rem; margin-bottom: 0.75rem;
      border: 1px solid var(--ngr-border); border-radius: 999px;
      font-size: 0.85rem; color: var(--ngr-muted);
      transition: border-color 200ms ease, color 200ms ease;
    }
    .watch-status[data-on='true'] {
      border-color: #10b981;
      color: var(--ngr-fg);
    }
    .watch-dot {
      width: 0.55rem; height: 0.55rem; border-radius: 50%;
      background: var(--ngr-muted);
      transition: background 200ms ease, box-shadow 200ms ease;
    }
    .watch-status[data-on='true'] .watch-dot {
      background: #10b981;
      box-shadow: 0 0 0 3px color-mix(in srgb, #10b981 25%, transparent);
    }
  `,
})
export default class IdlePage {
  protected readonly idle = inject(IdleService);

  protected readonly lib = lib;
  protected readonly watching = computed(() => this.idle.interrupts().length > 0);

  protected readonly npmHref = `https://www.npmjs.com/package/${lib.pkg}`;
  protected readonly changelogHref = `${lib.github}/blob/master/CHANGELOG.md`;
  protected readonly readmeHref = `${lib.github}#readme`;

  protected stateJson(): string {
    return JSON.stringify(
      {
        state: this.idle.state(),
        countdown: this.idle.countdown(),
        lastActivity: this.idle.lastActivity(),
        interrupts: this.idle.interrupts(),
      },
      null,
      2,
    );
  }

  protected readonly setupSnippet = `provideIdle({
  idleAfter: 5_000,   // short for the demo;
  timeout: 10_000,    // real apps use minutes
  pauseWhenHidden: true,
  multiTabSync: true,
  autoStart: true,
});`;

  protected readonly quickStart = `// src/app/app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideIdle } from '@ngrithms/idle';

export const appConfig: ApplicationConfig = {
  providers: [
    provideIdle({
      idleAfter: 5 * 60_000,   // 5 minutes to idle
      timeout: 30_000,         // 30 s warning window
      multiTabSync: true,
    }),
  ],
};

// In any component
import { Component, inject } from '@angular/core';
import { IdleService, IfIdleDirective } from '@ngrithms/idle';

@Component({
  imports: [IfIdleDirective],
  template: \`
    <div *ngrIfIdle>
      Are you still there? Logging out in {{ idle.countdown() }}s...
      <button (click)="idle.reset()">Stay signed in</button>
    </div>
    <div *ngrIfIdle="'timedOut'">
      Session expired. <a routerLink="/login">Sign in again</a>.
    </div>
  \`,
})
export class SessionGuard {
  protected readonly idle = inject(IdleService);
}`;
}
