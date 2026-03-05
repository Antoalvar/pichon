import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Editor, NgxEditorModule, Toolbar } from 'ngx-editor';
import { ContentBlockType } from '../../back-office.model';

/**
 * Presentational editor for a single content block.
 *
 * Receives the block's `FormGroup` as a signal input and binds it directly
 * with `[formGroup]` — no ControlContainer forwarding needed because the
 * binding creates a scoped context for the block's own controls while the
 * FormGroup itself remains wired into the parent form's `blocks` FormArray.
 */
@Component({
  selector: 'app-bo-block-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, NgxEditorModule],
  templateUrl: './bo-block-item.component.html',
})
export class BoBlockItemComponent {
  /** The FormGroup for this block (child of the facade's `blocks` FormArray). */
  readonly blockGroup = input.required<FormGroup>();
  /** The block type; controls which editor widget is rendered. */
  readonly blockType = input.required<ContentBlockType>();
  /** The `ngx-editor` instance for paragraph blocks; `null` otherwise. */
  readonly editor = input.required<Editor | null>();
  /** Toolbar configuration for paragraph editors. */
  readonly paragraphToolbar = input.required<Toolbar>();

  /** Emitted when the user clicks the delete button for this block. */
  readonly remove = output<void>();

  /**
   * Returns the current string value of the block's `content` form control.
   * Typed explicitly to satisfy strict template checks on `[src]` bindings.
   */
  blockContentValue(): string {
    return (this.blockGroup().get('content')?.value as string | null | undefined) ?? '';
  }
}
