import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { type RouteMeta } from '@analogjs/router';
import { IdleService, IfIdleDirective } from '@ngrithms/idle';

export const routeMeta: RouteMeta = {
  title: '@ngrithms/idle — Modern Angular user-inactivity detector',
  meta: [
    { name: 'description', content: 'Signal-first user-inactivity detector for Angular. Multi-tab sync, sleep watchdog, optional keepalive companion. Standalone, SSR-safe, zero dependencies.' },
  ],
};

@Component({
  selector: 'app-idle',
  imports: [RouterLink, IfIdleDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="site-header">
      <a routerLink="/" class="brand">&#64;ngrithms</a>
      <nav>
        <a routerLink="/">Home</a>
        <a href="https://github.com/aboudbadra/ngrithms-idle" target="_blank" rel="noopener">GitHub</a>
        <a href="https://www.npmjs.com/package/@ngrithms/idle" target="_blank" rel="noopener">npm</a>
      </nav>
    </header>

    <main>
      <h1>&#64;ngrithms/idle</h1>
      <p class="tagline">Signal-first user-inactivity detector for Angular &mdash; standalone, SSR-safe, zero deps.</p>
      <p class="install"><code>npm install &#64;ngrithms/idle</code></p>

      <p class="intro">
        This page runs &#64;ngrithms/idle v0.4 with intentionally-short demo timings:
        <strong>5 s</strong> to <code>idle</code>, then <strong>10 s more</strong> to <code>timedOut</code>.
        Stop interacting and watch the state below shift. Move your mouse, type, or click
        to revive. Open the page in a second tab to see <code>multiTabSync</code> in action &mdash;
        activity in either tab keeps both alive.
      </p>

      <section>
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

      <section>
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

      <section>
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

      <section>
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

      <section>
        <h2>Quick start</h2>
        <pre class="code"><code>{{ quickStart }}</code></pre>
        <p class="footnote">
          See the <a href="https://github.com/aboudbadra/ngrithms-idle#readme" target="_blank" rel="noopener">full README</a> for multi-tab sync flags, the sleep watchdog, the <code>onSystemSleep</code> option, and the <code>&#64;ngrithms/idle/keepalive</code> secondary entry point for server-side session syncing.
        </p>
      </section>

      <section>
        <h2>Learn more</h2>
        <ul class="links">
          <li><a href="https://github.com/aboudbadra/ngrithms-idle" target="_blank" rel="noopener">README on GitHub</a></li>
          <li><a href="https://www.npmjs.com/package/@ngrithms/idle" target="_blank" rel="noopener">Package on npm</a></li>
          <li><a href="https://github.com/aboudbadra/ngrithms-idle/blob/master/CHANGELOG.md" target="_blank" rel="noopener">Changelog</a></li>
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

    .buttons { display: flex; flex-wrap: wrap; gap: 0.5rem; }
    .btn {
      padding: 0.55rem 0.9rem; border: 1px solid var(--ngr-border);
      background: transparent; color: var(--ngr-fg); border-radius: 6px;
      font: inherit; cursor: pointer;
      transition: opacity 150ms ease;
    }
    .btn:hover:not([disabled]) { border-color: var(--ngr-accent); }
    .btn[disabled] { opacity: 0.4; cursor: not-allowed; }
    .btn--primary { background: var(--ngr-accent); border-color: var(--ngr-accent); color: white; }
    .btn--primary:hover { opacity: 0.92; }

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

    .code {
      margin: 0; padding: 1rem; background: var(--ngr-code-bg);
      border-radius: 8px; font-size: 0.85rem; overflow: auto;
    }
    .footnote { color: var(--ngr-muted); font-size: 0.9rem; margin-top: 1rem; line-height: 1.6; }

    .links { padding-left: 1.25rem; }
    .links a { color: var(--ngr-accent); }
  `,
})
export default class IdlePage {
  protected readonly idle = inject(IdleService);

  protected readonly watching = computed(() => this.idle.interrupts().length > 0);

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
