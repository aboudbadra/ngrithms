import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection
} from '@angular/core';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideFileRouter, requestContextInterceptor } from '@analogjs/router';
import {
  provideCookieConsent,
  makeCategory,
  GOOGLE_ANALYTICS,
  HOTJAR,
  GOOGLE_ADS,
  META_PIXEL,
  YOUTUBE,
} from '@ngrithms/cookie-consent';
import { provideHotkeys } from '@ngrithms/hotkeys';
import { provideIdle } from '@ngrithms/idle';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideFileRouter(),
    provideHttpClient(
      withFetch(),
      withInterceptors([requestContextInterceptor])
    ),
    provideClientHydration(withEventReplay()),
    provideCookieConsent({
      privacyPolicyUrl: '/privacy',
      defaultLanguage: 'en',
      position: 'bottom-bar',
      theme: 'default',
      categories: [
        makeCategory({
          key: 'analytics',
          name: { en: 'Analytics' },
          description: { en: 'Helps us understand how visitors use the site.' },
          items: [GOOGLE_ANALYTICS, HOTJAR],
        }),
        makeCategory({
          key: 'tracking',
          name: { en: 'Tracking & Ads' },
          description: { en: 'Conversion tracking and ad measurement.' },
          items: [GOOGLE_ADS, META_PIXEL],
        }),
        makeCategory({
          key: 'embeds',
          name: { en: 'Third-party embeds' },
          description: { en: 'Allows YouTube and other social embeds to load.' },
          items: [YOUTUBE],
        }),
      ],
    }),
    // Short demo timings so visitors don't wait around to see the state shift.
    // Real apps typically use idleAfter: 5 min, timeout: 30 s.
    provideIdle({
      idleAfter: 5_000,
      timeout: 10_000,
      pauseWhenHidden: true,
      multiTabSync: true,
      autoStart: true,
    }),
    provideHotkeys(),
  ],
};