import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject, DOCUMENT } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

export interface SeoConfig {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
}

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly titleService = inject(Title);
  private readonly metaService = inject(Meta);
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);

  setPage(config: SeoConfig): void {
    const fullTitle = `${config.title} | Pichón`;
    const type = config.type ?? 'website';

    this.titleService.setTitle(fullTitle);

    this.metaService.updateTag({ name: 'description', content: config.description });
    this.metaService.updateTag({ name: 'robots', content: 'index,follow' });

    this.metaService.updateTag({ property: 'og:title', content: fullTitle });
    this.metaService.updateTag({ property: 'og:description', content: config.description });
    this.metaService.updateTag({ property: 'og:type', content: type });

    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: fullTitle });
    this.metaService.updateTag({ name: 'twitter:description', content: config.description });

    if (config.image !== undefined) {
      this.metaService.updateTag({ property: 'og:image', content: config.image });
      this.metaService.updateTag({ name: 'twitter:image', content: config.image });
    }

    if (config.url !== undefined) {
      this.metaService.updateTag({ property: 'og:url', content: config.url });
      this.updateCanonical(config.url);
    }
  }

  setJsonLd(schema: Record<string, unknown>): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    let script = this.document.getElementById('ld-json') as HTMLScriptElement | null;

    if (!script) {
      script = this.document.createElement('script') as HTMLScriptElement;
      script.type = 'application/ld+json';
      script.id = 'ld-json';
      this.document.head.appendChild(script);
    }

    script.textContent = JSON.stringify(schema);
  }

  removeJsonLd(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.document.getElementById('ld-json')?.remove();
  }

  private updateCanonical(url: string): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    let link = this.document.querySelector<HTMLLinkElement>('link[rel="canonical"]');

    if (!link) {
      link = this.document.createElement('link') as HTMLLinkElement;
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }

    link.setAttribute('href', url);
  }
}
