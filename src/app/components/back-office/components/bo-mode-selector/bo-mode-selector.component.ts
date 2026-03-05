import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { BackOfficeMode, BoModeOption } from '../../back-office.model';

/**
 * Tab-bar that lets the admin switch between Create / Edit / Delete modes.
 */
@Component({
  selector: 'app-bo-mode-selector',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav class="bo-mode-selector" role="tablist" aria-label="Modo del backoffice">
      @for (opt of options(); track opt.value) {
        <button
          role="tab"
          type="button"
          class="bo-mode-tab"
          [class.bo-mode-tab--active]="opt.value === activeMode()"
          [attr.aria-selected]="opt.value === activeMode()"
          (click)="modeChange.emit(opt.value)"
          (keydown.enter)="modeChange.emit(opt.value)"
          (keydown.space)="modeChange.emit(opt.value)"
        >
          <span class="material-symbols-outlined">{{ opt.icon }}</span>
          {{ opt.label }}
        </button>
      }
    </nav>
  `,
})
export class BoModeSelectorComponent {
  readonly activeMode = input.required<BackOfficeMode>();
  readonly options = input.required<readonly BoModeOption[]>();

  readonly modeChange = output<BackOfficeMode>();
}
