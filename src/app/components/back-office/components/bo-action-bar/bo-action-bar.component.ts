import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

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
  /** Whether a publish request is currently in flight. */
  readonly isSubmitting = input.required<boolean>();
  /** Whether the parent form is currently valid. */
  readonly isFormValid = input.required<boolean>();
  /** True after a successful publish. */
  readonly submitSuccess = input.required<boolean>();
  /** Error message from the last failed publish attempt, or `null`. */
  readonly submitError = input.required<string | null>();

  /** Emitted when the user clicks the Preview button. */
  readonly previewClick = output<void>();
  /** Emitted when the user clicks the Publish button. */
  readonly publishClick = output<void>();
}
