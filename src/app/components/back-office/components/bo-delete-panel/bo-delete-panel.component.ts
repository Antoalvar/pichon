import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  output,
  viewChild,
} from '@angular/core';
import { Post } from '../../../../models/post.model';
import { BoPostSelectorComponent } from '../bo-post-selector/bo-post-selector.component';

/**
 * Delete-mode panel: post selector + confirmation dialog.
 */
@Component({
  selector: 'app-bo-delete-panel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BoPostSelectorComponent],
  template: `
    <section class="bo-delete-panel">
      <h2 class="bo-delete-panel__title">Eliminar post</h2>

      <app-bo-post-selector
        [posts]="posts()"
        [selectedPostId]="selectedPostId()"
        actionLabel="Eliminar"
        (postSelect)="postSelect.emit($event)"
        (actionClick)="openDialog()"
      />

      @if (deleteSuccess()) {
        <div class="bo-banner bo-banner--success" role="status" aria-live="polite">
          <span class="material-symbols-outlined">check_circle</span>
          Post eliminado correctamente.
        </div>
      }

      @if (deleteError()) {
        <div class="bo-banner bo-banner--error" role="alert" aria-live="assertive">
          <span class="material-symbols-outlined">error</span>
          {{ deleteError() }}
        </div>
      }
    </section>

    <!-- Confirmation dialog -->
    <dialog
      #confirmDialog
      class="bo-dialog"
      role="alertdialog"
      aria-labelledby="bo-dialog-title"
      aria-describedby="bo-dialog-desc"
      (close)="onDialogClose()"
    >
      <h3 id="bo-dialog-title" class="bo-dialog__title">¿Eliminar este post?</h3>
      <p id="bo-dialog-desc" class="bo-dialog__desc">
        Esta acción es irreversible. El post
        <strong>{{ selectedPostTitle() }}</strong>
        será eliminado permanentemente.
      </p>
      <div class="bo-dialog__actions">
        <button
          type="button"
          class="btn btn--secondary"
          (click)="confirmDialog.close('cancel')"
        >
          Cancelar
        </button>
        <button
          type="button"
          class="btn btn--danger"
          [disabled]="isDeleting()"
          [attr.aria-busy]="isDeleting()"
          (click)="confirmDelete()"
        >
          <span class="material-symbols-outlined">
            {{ isDeleting() ? 'hourglass_top' : 'delete_forever' }}
          </span>
          {{ isDeleting() ? 'Eliminando…' : 'Sí, eliminar' }}
        </button>
      </div>
    </dialog>
  `,
})
export class BoDeletePanelComponent {
  private readonly el = inject(ElementRef) as ElementRef<HTMLElement>;

  readonly posts = input.required<readonly Post[]>();
  readonly selectedPostId = input<string | null>(null);
  readonly selectedPostTitle = input<string | null>(null);
  readonly isDeleting = input(false);
  readonly deleteSuccess = input(false);
  readonly deleteError = input<string | null>(null);

  readonly postSelect = output<string>();
  readonly deleteConfirmed = output<void>();

  private readonly dialogRef = viewChild.required<ElementRef<HTMLDialogElement>>('confirmDialog');
  private _triggerButton: HTMLElement | null = null;

  openDialog(): void {
    this._triggerButton = document.activeElement as HTMLElement;
    this.dialogRef().nativeElement.showModal();
  }

  onDialogClose(): void {
    this._triggerButton?.focus();
    this._triggerButton = null;
  }

  confirmDelete(): void {
    this.deleteConfirmed.emit();
    this.dialogRef().nativeElement.close();
  }
}
