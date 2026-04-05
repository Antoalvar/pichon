import { Component, DOCUMENT, PLATFORM_ID, effect, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { SubscribeComponent } from './components/subscribe-component/subscribe.component';
import { NavbarComponent } from './components/app-navbar/app-navbar.component';
import { GuideDownloadModalComponent } from './components/guide-download-modal/guide-download-modal.component';
import { PostsFacade } from './facades/posts.facade';
import { SeoService } from './services/seo.service';

declare function gtag(...args: unknown[]): void;

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SubscribeComponent, NavbarComponent, GuideDownloadModalComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private router = inject(Router);
  private readonly _postsFacade = inject(PostsFacade);
  private readonly seoService = inject(SeoService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly document = inject(DOCUMENT);

  readonly showAgendaModal = signal<boolean>(false);

  isSubscribeModalVisible: boolean = true;
  isSubscribeButtonVisible = signal<boolean>(true);

  constructor() {
    this.seoService.setJsonLd({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Organization',
          name: 'Pichón',
          url: 'https://revistapichon.es',
          logo: 'https://revistapichon.es/assets/images/og-default.jpg',
          sameAs: ['https://www.instagram.com/pichonrevista'],
        },
        {
          '@type': 'WebSite',
          name: 'Pichón',
          url: 'https://revistapichon.es',
          description: 'Guía cultural pensada para familias.',
        },
      ],
    });

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((val) => {
        const segment = val.url.split('/')[1];
        const hideSubscribe =
          segment === 'subscribe' || segment === 'backOffice_101';
        this.isSubscribeButtonVisible.set(!hideSubscribe);
        if (hideSubscribe) {
          this.isSubscribeModalVisible = false;
        }

        if (isPlatformBrowser(this.platformId)) {
          gtag('event', 'page_view', {
            page_path: val.urlAfterRedirects,
            page_title: this.document.title,
          });
        }
      });
  }

  hideModal() {
    this.isSubscribeModalVisible = false;
  }

  showModal() {
    this.isSubscribeModalVisible = true;
  }

  openInstagram() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    window.open(
      'https://www.instagram.com/pichonrevista?igsh=MTJlNWY5ejU4ajg1Mg%3D%3D&utm_source=qr',
      '_blank'
    );
  }
}
