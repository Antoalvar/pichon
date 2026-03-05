import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Post } from '../../../../models/post.model';

/**
 * Presentational post selector — a native `<select>` + an action button.
 */
@Component({
  selector: 'app-bo-post-selector',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bo-post-selector">
      <label for="bo-post-select" class="bo-post-selector__label">
        Selecciona un post
      </label>
      <div class="bo-post-selector__row">
        <select
          id="bo-post-select"
          class="bo-post-selector__select"
          [value]="selectedPostId() ?? ''"
          (change)="postSelect.emit($any($event.target).value)"
        >
          <option value="" disabled selected>— Elige un post —</option>
          @for (post of posts(); track post.id) {
            <option [value]="post.id">{{ post.title }}</option>
          }
        </select>

        <button
          type="button"
          class="btn btn--primary"
          [disabled]="!selectedPostId() || isLoading()"
          (click)="actionClick.emit()"
        >
          @if (isLoading()) {
            <span class="material-symbols-outlined spin">progress_activity</span>
          }
          {{ actionLabel() }}
        </button>
      </div>
    </div>
  `,
})
export class BoPostSelectorComponent {
  readonly posts = input.required<readonly Post[]>();
  readonly selectedPostId = input<string | null>(null);
  readonly isLoading = input(false);
  readonly actionLabel = input.required<string>();

  readonly postSelect = output<string>();
  readonly actionClick = output<void>();
}
