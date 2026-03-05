import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { GuideDownloadModalComponent } from '../guide-download-modal/guide-download-modal.component';
import { SeoService } from '../../services/seo.service';

interface GuideItem {
  readonly image: string;
  readonly title: string;
  readonly description: string;
  readonly journeyId: number;
  readonly stepId: number;
}

@Component({
  selector: 'app-guias',
  imports: [GuideDownloadModalComponent],
  templateUrl: './guias.component.html',
  styleUrl: './guias.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GuiasComponent {
  private readonly seoService = inject(SeoService);

  readonly guides = signal<ReadonlyArray<GuideItem>>([
    {
      image: 'https://ik.imagekit.io/i6kjq7mb2/Guias/PICH-post%20guia.png',
      title: 'Guía semana santa',
      description:
        'Especial Londres y recomendaciones en Amsterdam, y París más algunas sorpresas',
      journeyId: 38,
      stepId: 147,
    },
  ]);

  readonly selectedGuide = signal<GuideItem | null>(null);

  constructor() {
    this.seoService.setPage({
      title: 'Guías',
      description:
        'Descarga nuestras guías culturales para familias. Recomendaciones especiales para viajes y planes.',
      url: 'https://revistapichon.es/guias',
    });
  }

  openModal(guide: GuideItem): void {
    this.selectedGuide.set(guide);
  }

  closeModal(): void {
    this.selectedGuide.set(null);
  }
}

