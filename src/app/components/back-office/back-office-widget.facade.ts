import { Injectable, inject, signal, computed, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { Editor, Toolbar } from 'ngx-editor';
import { PostsFacade } from '../../facades/posts.facade';
import { PostsService } from '../../services/posts.service';
import {
  BlockId,
  ContentBlockFormValue,
  ContentBlockType,
  ContentBlockTypeOption,
  PostFormValue,
  BLOCK_TYPE_OPTIONS,
} from './back-office.model';
import { buildPayload, buildPreviewHtml } from './back-office.util';

/**
 * Widget-scoped facade for the Back-Office feature.
 * Provided in {@link BackOfficeComponent}'s `providers` array — never globally.
 * Owns all mutable state, form definition, and interaction logic.
 */
@Injectable()
export class BackOfficeWidgetFacade {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly postsFacade = inject(PostsFacade);
  private readonly postsService = inject(PostsService);

  // ── Stable block ID counter (never decremented) ────────────────────────────
  private _blockIdCounter = 0;

  // ── Mutable internal signals ───────────────────────────────────────────────
  private readonly _blockVersion = signal(0);
  private readonly _editorMap = signal<Map<BlockId, Editor>>(new Map());
  private readonly _selectedCategories = signal<readonly string[]>([]);
  private readonly _isSubmitting = signal(false);
  private readonly _submitError = signal<string | null>(null);
  private readonly _submitSuccess = signal(false);

  // ── Public read-only signal surfaces ──────────────────────────────────────
  readonly editorMap = this._editorMap.asReadonly();
  readonly selectedCategories = this._selectedCategories.asReadonly();
  readonly isSubmitting = this._isSubmitting.asReadonly();
  readonly submitError = this._submitError.asReadonly();
  readonly submitSuccess = this._submitSuccess.asReadonly();

  // ── Form (public so root widget can bind [formGroup]="facade.form") ────────
  readonly form = new FormGroup({
    title: new FormControl('', { nonNullable: true, validators: Validators.required }),
    abstract: new FormControl('', { nonNullable: true, validators: Validators.required }),
    thumbnail_url: new FormControl('', { nonNullable: true, validators: Validators.required }),
    blocks: new FormArray<FormGroup>([]),
  });

  // ── Computed / bridged signals ─────────────────────────────────────────────

  /** All categories from the global PostsFacade. */
  readonly availableCategories = this.postsFacade.categories;

  /**
   * Whether the form is currently valid.
   * Bridged from `statusChanges` so the template stays signal-only.
   */
  readonly isFormValid = toSignal(
    this.form.statusChanges.pipe(map(() => this.form.valid)),
    { initialValue: this.form.valid }
  );

  /**
   * Current thumbnail URL value.
   * Bridged for reactive template binding without direct control reads.
   */
  readonly thumbnailUrl = toSignal(
    this.form.controls.thumbnail_url.valueChanges,
    { initialValue: '' }
  );

  /**
   * Reactive slice of `blocks` FormArray controls.
   * Re-derives when `_blockVersion` changes (on add/remove).
   */
  readonly blockGroups = computed<readonly FormGroup[]>(() => {
    this._blockVersion(); // reactive dependency — bump re-derives this slice
    return [...this.blocksArray.controls] as FormGroup[];
  });

  /** Returns a predicate function that checks if a category slug is selected. */
  readonly isCategorySelected = computed(
    () => (slug: string) => this._selectedCategories().includes(slug)
  );

  // ── Constants exposed to the template ─────────────────────────────────────
  readonly blockTypeOptions: readonly ContentBlockTypeOption[] = BLOCK_TYPE_OPTIONS;

  readonly paragraphToolbar: Toolbar = [
    ['bold', 'italic', 'underline'],
    ['bullet_list', 'ordered_list'],
    ['link'],
  ];

  // ── Private convenience getter ─────────────────────────────────────────────
  private get blocksArray(): FormArray<FormGroup> {
    return this.form.controls.blocks;
  }

  // ── Public mutation methods ────────────────────────────────────────────────

  /**
   * Adds a new content block of the given type.
   * Creates an `Editor` instance for `paragraph` blocks when running in a browser.
   */
  addBlock(type: ContentBlockType): void {
    const id = ++this._blockIdCounter;
    const editor = this.isBrowser && type === 'paragraph' ? new Editor() : null;
    if (editor) {
      this._editorMap.update((prev) => new Map([...prev, [id, editor]]));
    }
    this.blocksArray.push(
      new FormGroup({
        id: new FormControl<BlockId>(id, { nonNullable: true }),
        type: new FormControl<ContentBlockType>(type, { nonNullable: true }),
        content: new FormControl('', { nonNullable: true }),
      })
    );
    this._blockVersion.update((v) => v + 1);
  }

  /**
   * Removes the block identified by `blockId`, destroying its editor if any.
   * No-op if the ID is not found.
   */
  removeBlock(blockId: BlockId): void {
    const index = this.blocksArray.controls.findIndex(
      (g) => (g as FormGroup).get('id')?.value === blockId
    );
    if (index === -1) return;
    this._editorMap().get(blockId)?.destroy();
    this._editorMap.update((prev) => {
      const next = new Map(prev);
      next.delete(blockId);
      return next;
    });
    this.blocksArray.removeAt(index);
    this._blockVersion.update((v) => v + 1);
  }

  /** Toggles a category slug in/out of the selected list. */
  toggleCategory(slug: string): void {
    this._selectedCategories.update((current) =>
      current.includes(slug)
        ? current.filter((s) => s !== slug)
        : [...current, slug]
    );
  }

  /** Opens a browser preview window with the fully-rendered post HTML. */
  preview(): void {
    if (!this.isBrowser) return;
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(buildPreviewHtml(this.currentFormValue()));
    win.document.close();
  }

  /**
   * Submits the post to the API.
   * Guards against invalid form state and concurrent in-flight requests.
   */
  submit(): void {
    if (this.form.invalid || this._isSubmitting()) return;
    this._isSubmitting.set(true);
    this._submitError.set(null);
    this._submitSuccess.set(false);
    this.postsService
      .createPost(buildPayload(this.currentFormValue(), this._selectedCategories()))
      .subscribe({
        next: () => {
          this._isSubmitting.set(false);
          this._submitSuccess.set(true);
          this.resetForm();
        },
        error: (err: unknown) => {
          this._isSubmitting.set(false);
          this._submitError.set(
            err instanceof Error ? err.message : 'Error al publicar el post'
          );
        },
      });
  }

  /** Destroys all active editor instances. Called from the root widget's `ngOnDestroy`. */
  destroyEditors(): void {
    this._editorMap().forEach((editor) => editor.destroy());
  }

  // ── Private helpers ────────────────────────────────────────────────────────

  private resetForm(): void {
    this._editorMap().forEach((editor) => editor.destroy());
    this._editorMap.set(new Map());
    this.blocksArray.clear();
    this._blockVersion.set(0);
    this.form.reset();
    this._selectedCategories.set([]);
  }

  private currentFormValue(): PostFormValue {
    const raw = this.form.getRawValue();
    return {
      title: raw.title,
      abstract: raw.abstract,
      thumbnail_url: raw.thumbnail_url,
      blocks: raw.blocks as ContentBlockFormValue[],
    };
  }
}
