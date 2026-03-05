import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { BackOfficeMode } from '../../back-office.model';

/**
 * Presentational header bar for the Back-Office page.
 * Renders the page title, Preview / Publish action buttons, and
 * success / error feedback banners.
 */
@Component({
  selector: 'app-bo-action-bar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './bo-action-bar.component.html',
})
export class BoActionBarComponent {
  /** Active back-office mode — controls title and button labels. */
  readonly mode = input.required<BackOfficeMode>();
  /** Whether a submit request is currently in flight. */
  readonly isSubmitting = input.required<boolean>();
  /** Whether the parent form is currently valid. */
  readonly isFormValid = input.required<boolean>();
  /** True after a successful submit. */
  readonly submitSuccess = input.required<boolean>();
  /** Error message from the last failed submit attempt, or `null`. */
  readonly submitError = input.required<string | null>();

  /** Emitted when the user clicks the Preview button. */
  readonly previewClick = output<void>();
  /** Emitted when the user clicks the Publish/Save button. */
  readonly publishClick = output<void>();

  protected readonly pageTitle = computed(() =>
    this.mode() === 'edit' ? 'Editar post' : 'Nuevo post'
  );

  protected readonly submitLabel = computed(() =>
    this.isSubmitting()
      ? this.mode() === 'edit' ? 'Guardando…' : 'Publicando…'
      : this.mode() === 'edit' ? 'Guardar cambios' : 'Publicar'
  );

  protected readonly successMessage = computed(() =>
    this.mode() === 'edit'
      ? 'Post actualizado correctamente.'
      : 'Post publicado correctamente.'
  );
}

