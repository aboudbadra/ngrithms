import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { type RouteMeta } from '@analogjs/router';
import { HotkeyDirective, HotkeysService } from '@ngrithms/hotkeys';
import { HotkeyCheatsheetComponent } from '@ngrithms/hotkeys/cheatsheet';
import { getLibrary } from '../../data/libraries';
import { SiteShellComponent } from '../shell/site-shell.component';

const lib = getLibrary('hotkeys');

export const routeMeta: RouteMeta = {
  title: '@ngrithms/hotkeys — Modern Angular keyboard shortcuts',
  meta: [
    {
      name: 'description',
      content:
        'Signal-first keyboard shortcuts for Angular. Auto-cleaning directives, modal scopes, multi-key sequences, multi-combo bindings, and a searchable cheatsheet. Standalone, SSR-safe, zero dependencies.',
    },
  ],
};

interface DemoEvent {
  combo: string;
  description: string;
  at: string;
}

@Component({
  selector: 'app-hotkeys',
  imports: [SiteShellComponent, HotkeyDirective, HotkeyCheatsheetComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-site-shell [lib]="lib">
      <h1 class="page-title">&#64;ngrithms/hotkeys</h1>
      <p class="tagline">
        Signal-first keyboard shortcuts for Angular &mdash; auto-cleaning directives, modal
        scopes, multi-key sequences, multi-combo bindings, and a searchable cheatsheet.
      </p>
      <p class="install"><code>npm install &#64;ngrithms/hotkeys</code></p>

      <p class="intro">
        This page runs &#64;ngrithms/hotkeys v{{ lib.version }} live. Press
        <kbd>?</kbd> right now to open the searchable cheatsheet &mdash; every binding declared
        below registers itself with the service on mount and unregisters on unmount, so the
        cheatsheet always reflects the current page.
      </p>

      <section class="section">
        <h2>Live bindings on this page</h2>
        <p class="section-intro">
          Press any of these. The button is just the registration site &mdash; you don&rsquo;t
          need to click or focus it. Matching happens at the document level.
        </p>

        <div class="bindings">
          <button
            type="button"
            class="binding"
            (ngrHotkey)="recordEvent('c', 'Increment counter')"
            hotkey="c"
            hotkeyCategory="Demo"
            hotkeyDescription="Increment counter"
          >
            <kbd>c</kbd>
            <span class="binding__label">Increment counter</span>
            <span class="binding__count">{{ counter() }}</span>
          </button>

          <button
            type="button"
            class="binding"
            (ngrHotkey)="recordEvent('g h', 'Go home (sequence)')"
            hotkey="g h"
            hotkeyCategory="Navigation"
            hotkeyDescription="Go home (sequence)"
          >
            <kbd>g</kbd> <kbd>h</kbd>
            <span class="binding__label">Sequence demo</span>
          </button>

          <button
            type="button"
            class="binding"
            (ngrHotkey)="toggleHelp()"
            hotkey="i"
            hotkeyCategory="Help"
            hotkeyDescription="Toggle the help panel"
          >
            <kbd>i</kbd>
            <span class="binding__label">Help panel</span>
            <span class="binding__count" [class.binding__count--on]="helpOpen()">
              {{ helpOpen() ? 'open' : 'off' }}
            </span>
          </button>

          <button
            type="button"
            class="binding"
            [hotkey]="['k', 'mod+k']"
            (ngrHotkey)="recordEvent($event.key, 'Multi-combo (k or ⌘+K)')"
            hotkeyCategory="Demo"
            hotkeyDescription="Multi-combo: bare k or modifier+k"
          >
            <kbd>k</kbd> <span class="binding__sep">/</span> <kbd>⌘</kbd>+<kbd>k</kbd>
            <span class="binding__label">Multi-combo</span>
          </button>
        </div>

        @if (helpOpen()) {
          <div class="help-panel">
            <strong>Help panel:</strong> opened via <kbd>i</kbd>. Press <kbd>i</kbd> again to
            close it. This is a separate binding from <kbd>?</kbd> &mdash; that one toggles the
            cheatsheet below.
          </div>
        }

        <p class="section-intro" style="margin-top: 1rem;">
          The cheatsheet at <kbd>?</kbd> ships from the separate
          <code>&#64;ngrithms/hotkeys/cheatsheet</code> entry point &mdash; opt-in, so apps that
          don&rsquo;t need it pay nothing.
        </p>
      </section>

      <section class="section">
        <h2>Recent triggers</h2>
        @if (events().length === 0) {
          <p class="muted">Press any of the bindings above to see them recorded here.</p>
        } @else {
          <ul class="event-log">
            @for (e of events(); track e.at) {
              <li>
                <code>{{ e.combo }}</code>
                <span class="event-desc">{{ e.description }}</span>
                <span class="event-at">{{ e.at }}</span>
              </li>
            }
          </ul>
        }
      </section>

      <section class="section">
        <h2>Inside the library</h2>
        <p class="section-intro">
          <code>HotkeysService.registered</code> is a signal of every binding currently mounted.
          That&rsquo;s how the cheatsheet stays in sync &mdash; no observers, no manual refresh.
        </p>
        <div class="grid">
          <div class="panel">
            <h3>Setup</h3>
            <pre><code>{{ setupSnippet }}</code></pre>
          </div>
          <div class="panel">
            <h3>Currently registered</h3>
            <pre><code>{{ registeredJson() }}</code></pre>
          </div>
        </div>
      </section>

      <section class="section">
        <h2>Quick start</h2>
        <pre class="code"><code>{{ quickStart }}</code></pre>
        <p class="footnote">
          See the <a [href]="readmeHref" target="_blank" rel="noopener">full README</a> for
          scopes, sequence configuration, dev-mode conflict warnings, multi-combo bindings,
          and the cheatsheet entry point. The
          <a [href]="demoHref" target="_blank" rel="noopener">demo app</a> (Features / Quick Start
          / API / Examples) is the full reference.
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

    <ngr-hotkey-cheatsheet [searchable]="true" />
  `,
  styles: `
    .bindings {
      display: grid;
      gap: 0.75rem;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    }
    .binding {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.85rem 1rem;
      border: 1px solid var(--ngr-border);
      border-radius: 8px;
      background: transparent;
      color: inherit;
      font: inherit;
      cursor: pointer;
      text-align: left;
      transition: border-color 120ms ease;
    }
    .binding:hover { border-color: var(--ngr-accent); }
    .binding__label {
      flex: 1;
      font-size: 0.88rem;
      color: var(--ngr-muted);
    }
    .binding__sep { color: var(--ngr-muted); font-size: 0.8rem; }
    .binding__count {
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      font-size: 0.85rem;
      color: var(--ngr-muted);
      min-width: 1.5rem;
      text-align: right;
    }
    .binding__count--on {
      color: var(--ngr-accent);
      font-weight: 600;
    }

    .help-panel {
      margin-top: 1rem;
      padding: 1rem 1.25rem;
      border: 1px solid var(--ngr-accent);
      border-radius: 8px;
      background: color-mix(in srgb, var(--ngr-accent) 8%, transparent);
      line-height: 1.6;
    }

    .event-log {
      list-style: none;
      padding: 0;
      margin: 0;
      border: 1px solid var(--ngr-border);
      border-radius: 8px;
      overflow: hidden;
    }
    .event-log li {
      display: grid;
      grid-template-columns: minmax(80px, auto) 1fr auto;
      align-items: center;
      gap: 0.75rem;
      padding: 0.6rem 0.9rem;
      border-top: 1px solid var(--ngr-border);
      font-size: 0.88rem;
    }
    .event-log li:first-child { border-top: 0; }
    .event-log code { background: transparent; padding: 0; font-size: 0.85rem; }
    .event-desc { color: var(--ngr-muted); }
    .event-at {
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      font-size: 0.78rem;
      color: var(--ngr-muted);
    }
  `,
})
export default class HotkeysPage {
  protected readonly hotkeys = inject(HotkeysService);
  protected readonly lib = lib;

  protected readonly npmHref = `https://www.npmjs.com/package/${lib.pkg}`;
  protected readonly changelogHref = `${lib.github}/blob/master/CHANGELOG.md`;
  protected readonly readmeHref = `${lib.github}#readme`;
  protected readonly demoHref = `${lib.github}/tree/master/projects/demo`;

  private readonly counterSignal = signal(0);
  private readonly helpOpenSignal = signal(false);
  private readonly eventsSignal = signal<readonly DemoEvent[]>([]);

  protected readonly counter = this.counterSignal.asReadonly();
  protected readonly helpOpen = this.helpOpenSignal.asReadonly();
  protected readonly events = this.eventsSignal.asReadonly();

  protected readonly registeredJson = computed(() => {
    const list = this.hotkeys.registered().map((b) => ({
      keys: b.keys,
      scope: b.scope,
      description: b.description,
    }));
    return JSON.stringify(list, null, 2);
  });

  protected recordEvent(combo: string, description: string): void {
    if (combo === 'c') {
      this.counterSignal.update((n) => n + 1);
    }
    const now = new Date();
    const at = now.toLocaleTimeString([], { hour12: false });
    this.eventsSignal.update((events) =>
      [{ combo, description, at }, ...events].slice(0, 8),
    );
  }

  protected toggleHelp(): void {
    this.helpOpenSignal.update((open) => !open);
    this.recordEvent('i', 'Toggle the help panel');
  }

  protected readonly setupSnippet = `provideHotkeys({
  // Defaults — explicit here for clarity.
  cheatsheetHotkey: '?',
  allowInInputs: false,
  sequenceTimeoutMs: 1000,
  preventDefault: true,
});`;

  protected readonly quickStart = `// src/app/app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideHotkeys } from '@ngrithms/hotkeys';

export const appConfig: ApplicationConfig = {
  providers: [provideHotkeys()],
};

// In any component
import { Component } from '@angular/core';
import { HotkeyDirective } from '@ngrithms/hotkeys';

@Component({
  standalone: true,
  imports: [HotkeyDirective],
  template: \`
    <button
      (ngrHotkey)="save()"
      hotkey="mod+s"
      hotkeyDescription="Save"
    >
      Save
    </button>
  \`,
})
export class Toolbar {
  save() { /* ... */ }
}

// Optional: drop the cheatsheet at your app shell
import { HotkeyCheatsheetComponent } from '@ngrithms/hotkeys/cheatsheet';

@Component({
  imports: [HotkeyCheatsheetComponent],
  template: \`
    <router-outlet />
    <ngr-hotkey-cheatsheet [searchable]="true" />
  \`,
})
export class App {}`;
}
