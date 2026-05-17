import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `<router-outlet />`,
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
