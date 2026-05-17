import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ConsentBannerComponent, ConsentBadgeComponent } from '@ngrithms/cookie-consent';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ConsentBannerComponent, ConsentBadgeComponent],
  template: `
    <router-outlet />
    <ngr-consent-banner />
    <ngr-consent-badge />
  `,
  styles: `
    :host {
      display: block;
      max-width: 960px;
      margin: 0 auto;
      padding: 2rem 1.5rem;
    }
  `,
})
export class App {}
