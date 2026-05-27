import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { signal } from '@angular/core';

const COOKIE_CONSENT_KEY = 'pichon_cookie_consent';

export type CookieConsent = 'accepted' | 'rejected' | null;

@Injectable({
  providedIn: 'root',
})
export class CookieConsentService {
  private readonly platformId = inject(PLATFORM_ID);

  readonly consentGiven = signal<CookieConsent>(this.getStoredConsent());

  accept(): void {
    this.setConsent('accepted');
    this.loadAnalytics();
  }

  reject(): void {
    this.setConsent('rejected');
    this.removeAnalyticsCookies();
  }

  /** Returns true if consent has been decided (either way) */
  hasDecided(): boolean {
    return this.consentGiven() !== null;
  }

  /** Call on app init to load analytics if previously accepted */
  initializeFromStoredConsent(): void {
    if (this.consentGiven() === 'accepted') {
      this.loadAnalytics();
    }
  }

  private getStoredConsent(): CookieConsent {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }
    const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (stored === 'accepted' || stored === 'rejected') {
      return stored;
    }
    return null;
  }

  private setConsent(value: 'accepted' | 'rejected'): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(COOKIE_CONSENT_KEY, value);
    }
    this.consentGiven.set(value);
  }

  private loadAnalytics(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    // Enable GA consent mode
    const w = window as unknown as Record<string, unknown>;
    if (typeof w['gtag'] === 'function') {
      (w['gtag'] as (...args: unknown[]) => void)('consent', 'update', {
        analytics_storage: 'granted',
      });
    }
  }

  private removeAnalyticsCookies(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    // Remove GA cookies
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const name = cookie.split('=')[0].trim();
      if (name.startsWith('_ga')) {
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.${location.hostname}`;
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
      }
    }
  }
}
