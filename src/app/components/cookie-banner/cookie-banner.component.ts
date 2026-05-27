import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CookieConsentService } from '../../services/cookie-consent.service';

@Component({
  selector: 'app-cookie-banner',
  imports: [RouterLink],
  templateUrl: './cookie-banner.component.html',
  styleUrl: './cookie-banner.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CookieBannerComponent {
  private readonly cookieConsent = inject(CookieConsentService);

  readonly show = this.cookieConsent.consentGiven;

  accept(): void {
    this.cookieConsent.accept();
  }

  reject(): void {
    this.cookieConsent.reject();
  }
}
