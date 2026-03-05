import { Injectable, inject, signal, computed, PLATFORM_ID, effect, untracked } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { toSignal, rxResource } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { Editor, Toolbar } from 'ngx-editor';
import { PostsFacade } from '../../facades/posts.facade';
import { PostsService } from '../../services/posts.service';
import {
  BackOfficeMode,
  BlockId,
  BoModeOption,
  BO_MODE_OPTIONS,
  ContentBlockFormValue,
  ContentBlockType,
  ContentBlockTypeOption,
  PostFormValue,
  BLOCK_TYPE_OPTIONS,
} from './back-office.model';
import { buildPayload, buildPreviewHtml, buildUpdatePayload } from './back-office.util';
import { PostDetail } from '../../models/post.model';

/**
 * Widget-scoped facade for the Back-Office feature.
 * Provided in {@link BackOfficeComponent}'s `providers` array — never globally.
 * Owns all mutable state, form definition, and interaction logic for
 * create, edit, and delete modes.
 */
@Injectable()
export class BackOfficeWidgetFacade {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly postsFacade = inject(PostsFacade);
  private readonly postsService = inject(PostsService);

  // ── Stable block ID counter (never decremented) ────────────────────────────
  private _blockIdCounter = 0;

  // ── Mutable internal signals ───────────────────────────────────────────────
  private readonly _mode = signal<BackOfficeMode>('create');
  private readonly _selectedPostId = signal<string | undefined>(undefined);
  private readonly _editLoadTrigger = signal<string | undefined>(undefined);
  private readonly _blockVersion = signal(0);
  private readonly _editorMap = signal<Map<BlockId, Editor>>(new Map());
  private readonly _selectedCategories = signal<readonly string[]>([]);
  private readonly _isSubmitting = signal(false);
  private readonly _submitError = signal<string | null>(null);
  private readonly _submitSuccess = signal(false);
  private readonly _isDeleting = signal(false);
  private readonly _deleteError = signal<string | null>(null);
  private readonly _deleteSuccess = signal(false);

  // ── rxResource for loading a single post detail (edit mode) ───────────────
  private readonly _postDetailResource = rxResource({
    request: () => this._editLoadTrigger(),
    loader: ({ request: id }) => this.postsService.getPostById(id as string),
  });

  // ── Effect: pre-fill form when post detail loads ───────────────────────────
  private readonly _prefillEffect = effect(() => {
    const detail = this._postDetailResource.value();
    if (detail !== undefined) {
      // Run in untracked so none of the signal writes below create a
      // reactive dependency that re-triggers this effect.
      untracked(() => this._prefillFormWithPost(detail));
    }
  });

  // ── Public read-only signal surfaces ──────────────────────────────────────
  readonly mode = this._mode.asReadonly();
  readonly selectedPostId = this._selectedPostId.asReadonly();
  readonly editorMap = this._editorMap.asReadonly();
  readonly selectedCategories = this._selectedCategories.asReadonly();
  readonly isSubmitting = this._isSubmitting.asReadonly();
  readonly submitError = this._submitError.asReadonly();
  readonly submitSuccess = this._submitSuccess.asReadonly();
  readonly isDeleting = this._isDeleting.asReadonly();
  readonly deleteError = this._deleteError.asReadonly();
  readonly deleteSuccess = this._deleteSuccess.asReadonly();

  /** Posts from the global facade — used for the post selector. */
  readonly posts = this.postsFacade.posts;

  /** The currently selected post object, or null if none selected. */
  readonly selectedPost = computed(
    () => this.postsFacade.posts().find((p) => p.id === this._selectedPostId()) ?? null
  );

  /** True while the post detail is being loaded for editing. */
  readonly postDetailLoading = computed(() => this._postDetailResource.isLoading());

  /** True once a post detail has been successfully loaded for editing. */
  readonly postDetailLoaded = computed(() => this._postDetailResource.value() !== undefined);

  /** Error from the post detail load, undefined if none. */
  readonly postDetailError = this._postDetailResource.error;

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
  readonly modeOptions: readonly BoModeOption[] = BO_MODE_OPTIONS;

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
   * Switches the active mode, resetting all transient state.
   * No-op if the incoming mode equals the current mode.
   */
  setMode(mode: BackOfficeMode): void {
    if (this._mode() === mode) return;
    this.resetForm();
    this._selectedPostId.set(undefined);
    this._editLoadTrigger.set(undefined);
    this._submitError.set(null);
    this._submitSuccess.set(false);
    this._deleteError.set(null);
    this._deleteSuccess.set(false);
    this._isDeleting.set(false);
    this._mode.set(mode);
  }

  /**
   * Selects a post by ID for edit/delete operations.
   * Does NOT trigger an HTTP request — only updates the selection.
   */
  selectPost(id: string): void {
    this._selectedPostId.set(id);
  }

  /**
   * Triggers loading the full post detail for the currently selected post.
   * No-op if no post is selected.
   */
  loadPostForEdit(): void {
    const id = this._selectedPostId();
    if (!id) return;
    this.resetForm();
    this._editLoadTrigger.set(id);
  }

  /**
   * Adds a new content block of the given type.
   * Creates an `Editor` instance for `paragraph` blocks when running in a browser.
   */
  addBlock(type: ContentBlockType): void {
    this.addBlockWithContent(type, '');
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
   * Submits a new post to the API (create mode).
   * Guards against invalid form state and concurrent in-flight requests.
   */
  submitCreate(): void {
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
          this.postsFacade.reloadPosts();
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

  /**
   * Submits edits to the currently-loaded post via PATCH (edit mode).
   * Content is only included in the payload when the user added new blocks —
   * the backend accepts partial PATCH bodies.
   * Guards against invalid form state, no loaded post, and concurrent requests.
   */
  submitEdit(): void {
    const id = this._editLoadTrigger();
    if (!id || this.form.invalid || this._isSubmitting()) return;
    this._isSubmitting.set(true);
    this._submitError.set(null);
    this._submitSuccess.set(false);
    const hasNewBlocks = this.blockGroups().length > 0;
    this.postsService
      .updatePost(id, buildUpdatePayload(this.currentFormValue(), this._selectedCategories(), hasNewBlocks))
      .subscribe({
        next: () => {
          this._isSubmitting.set(false);
          this._submitSuccess.set(true);
          this.postsFacade.reloadPosts();
        },
        error: (err: unknown) => {
          this._isSubmitting.set(false);
          this._submitError.set(
            err instanceof Error ? err.message : 'Error al actualizar el post'
          );
        },
      });
  }

  /**
   * Deletes the currently selected post (delete mode).
   * Guards against no selection and concurrent requests.
   */
  submitDelete(): void {
    const id = this._selectedPostId();
    if (!id || this._isDeleting()) return;
    this._isDeleting.set(true);
    this._deleteError.set(null);
    this._deleteSuccess.set(false);
    this.postsService.deletePost(id).subscribe({
      next: () => {
        this._isDeleting.set(false);
        this._deleteSuccess.set(true);
        this._selectedPostId.set(undefined);
        this.postsFacade.reloadPosts();
      },
      error: (err: unknown) => {
        this._isDeleting.set(false);
        this._deleteError.set(
          err instanceof Error ? err.message : 'Error al eliminar el post'
        );
      },
    });
  }

  /** Destroys all active editor instances. Called from the root widget's `ngOnDestroy`. */
  destroyEditors(): void {
    this._editorMap().forEach((editor) => editor.destroy());
  }

  // ── Private helpers ────────────────────────────────────────────────────────

  /**
   * Adds a block with a pre-supplied content value.
   * When `suppressVersionBump` is true, the `_blockVersion` signal is NOT
   * bumped — callers that add many blocks at once should do a single bump
   * at the end for performance.
   */
  private addBlockWithContent(
    type: ContentBlockType,
    content: string,
    opts: { suppressVersionBump?: boolean } = {}
  ): void {
    const id = ++this._blockIdCounter;
    const editor = this.isBrowser && type === 'paragraph' ? new Editor() : null;
    if (editor) {
      this._editorMap.update((prev) => new Map([...prev, [id, editor]]));
    }
    this.blocksArray.push(
      new FormGroup({
        id: new FormControl<BlockId>(id, { nonNullable: true }),
        type: new FormControl<ContentBlockType>(type, { nonNullable: true }),
        content: new FormControl(content, { nonNullable: true }),
      })
    );
    if (!opts.suppressVersionBump) {
      this._blockVersion.update((v) => v + 1);
    }
  }

  /**
   * Pre-fills the form with the loaded PostDetail's basic metadata.
   * Content blocks are intentionally NOT loaded here — the user can add
   * new blocks from scratch. Only new blocks will be included in the PATCH.
   * This avoids the complexity of round-tripping HTML through the editor.
   */
  private _prefillFormWithPost(detail: PostDetail): void {
    this.form.patchValue({
      title: detail.title,
      abstract: detail.abstract,
      thumbnail_url: detail.thumbnail_url,
    });

    this._selectedCategories.set(
      this._resolveCategoriesToSlugs(detail.category_name)
    );
  }

  /**
   * Maps raw category display names (from API) to slugs using
   * the global categories list.
   */
  private _resolveCategoriesToSlugs(categoryNames: readonly string[]): readonly string[] {
    const available = this.postsFacade.categories();
    return categoryNames
      .map((name) => available.find((c) => c.name === name)?.slug ?? name.toLowerCase())
      .filter(Boolean);
  }

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


