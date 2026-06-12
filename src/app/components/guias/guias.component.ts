import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { GuideDownloadModalComponent } from '../guide-download-modal/guide-download-modal.component';
import { SeoService } from '../../services/seo.service';

interface GuideItem {
  readonly image: string;
  readonly title: string;
  readonly description: string;
  readonly pdfUrl: string;
  readonly index: number;
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
      image: 'https://ik.imagekit.io/i6kjq7mb2/Guias/entradilla_gui%CC%81as_ss.jpg',
      title: 'Guía de Semana Santa',
      description:
        'Especial Londres y recomendaciones en Amsterdam, y París más algunas sorpresas',
      pdfUrl: '/assets/agenda/PICH-guia_semana_santa.pdf',
      index: 1,
    },
    {
      image: 'https://ik.imagekit.io/i6kjq7mb2/Guias/entradilla_gui%CC%81as_campamentos.jpg',
      title: 'Guía de campamentos de Madrid',
      description:
        'Nuestras recomendaciones de los mejores campamentos para niños en Madrid',
      pdfUrl: '/assets/agenda/guia_campamentos_2026.pdf',
      index: 2,
    },
    {
      image: '/assets/images/portada_rastro.jpg',
      title: 'Guía Rastro de Madrid en Familia',
      description:
        'Nuestras recomendaciones de los mejores planes para familias en el Rastro de Madrid',
      pdfUrl: '/assets/agenda/guia_rastro_familias.pdf',
      index: 3,
    },
    {
      image: '/assets/images/portada_festivales_verano.jpg',
      title: 'Guía Festivales de Verano',
      description:
        'Nuestras recomendaciones de los mejores Festivales de verano para disfrutar en familia',
      pdfUrl: '/assets/agenda/guia_festivales_verano.pdf',
      index: 4,
    },
  ].sort((a, b) => b.index - a.index));

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
