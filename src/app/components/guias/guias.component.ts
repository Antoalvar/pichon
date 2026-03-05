import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { GuideDownloadModalComponent } from '../guide-download-modal/guide-download-modal.component';

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

  openModal(guide: GuideItem): void {
    this.selectedGuide.set(guide);
  }

  closeModal(): void {
    this.selectedGuide.set(null);
  }
}

