import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Editor, Toolbar } from 'ngx-editor';
import {
  BlockId,
  ContentBlockType,
  ContentBlockTypeOption,
} from '../../back-office.model';
import { BoBlockItemComponent } from '../bo-block-item/bo-block-item.component';

/**
 * Presentational list of content blocks plus the "add block" toolbar.
 * Renders each block via {@link BoBlockItemComponent} using a stable ID
 * as the `@for` track key to prevent unnecessary DOM re-creation.
 */
@Component({
  selector: 'app-bo-block-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BoBlockItemComponent],
  templateUrl: './bo-block-list.component.html',
})
export class BoBlockListComponent {
  /** Ordered list of block FormGroups, re-derived when blocks are added/removed. */
  readonly blockGroups = input.required<readonly FormGroup[]>();
  /** Map of stable block IDs to their `Editor` instances (paragraphs only). */
  readonly editorMap = input.required<ReadonlyMap<BlockId, Editor>>();
  /** Available block-type options to display in the add-block toolbar. */
  readonly blockTypeOptions = input.required<readonly ContentBlockTypeOption[]>();
  /** Toolbar configuration forwarded to each paragraph editor. */
  readonly paragraphToolbar = input.required<Toolbar>();

  /** Emits the `ContentBlockType` chosen by the user from the add-block toolbar. */
  readonly addBlock = output<ContentBlockType>();
  /** Emits the stable {@link BlockId} of the block the user wants to remove. */
  readonly removeBlock = output<BlockId>();

  /**
   * Returns the stable `BlockId` stored in the given block FormGroup.
   * Used as the `@for` track expression.
   */
  getBlockId(group: FormGroup): BlockId {
    return group.get('id')!.value as BlockId;
  }

  /**
   * Returns the `ContentBlockType` stored in the given block FormGroup.
   */
  getBlockType(group: FormGroup): ContentBlockType {
    return group.get('type')!.value as ContentBlockType;
  }

  /**
   * Returns the `Editor` instance for the given block, or `null` for
   * non-paragraph blocks and SSR contexts.
   */
  getEditorForBlock(group: FormGroup): Editor | null {
    return this.editorMap().get(this.getBlockId(group)) ?? null;
  }
}
