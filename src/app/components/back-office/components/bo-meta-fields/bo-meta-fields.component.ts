import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import {
  ControlContainer,
  FormGroupDirective,
  ReactiveFormsModule,
} from '@angular/forms';
import { Category } from '../../../../models/category.model';

/**
 * Presentational meta-fields panel (title, abstract, categories, thumbnail).
 *
 * Uses `viewProviders` ControlContainer forwarding so `formControlName`
 * directives participate in the ancestor `[formGroup]` context provided by
 * the root {@link BackOfficeComponent}, without this component needing to
 * own or re-declare the form.
 */
@Component({
  selector: 'app-bo-meta-fields',
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
  imports: [ReactiveFormsModule],
  templateUrl: './bo-meta-fields.component.html',
})
export class BoMetaFieldsComponent {
  /** Full list of available categories to display as chip selectors. */
  readonly availableCategories = input.required<Category[]>();
  /** Slugs of currently selected categories. */
  readonly selectedCategories = input.required<readonly string[]>();
  /** Current thumbnail URL value — used for the live preview image. */
  readonly thumbnailUrl = input.required<string>();

  /** Emits the slug of the category chip the user toggled. */
  readonly categoryToggle = output<string>();

  /**
   * Returns `true` if the given category slug is in the selected list.
   */
  isSelected(slug: string): boolean {
    return this.selectedCategories().includes(slug);
  }
}
