import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  PLATFORM_ID,
  signal,
  computed,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Editor, NgxEditorModule, Toolbar } from 'ngx-editor';
import {
  BLOCK_TYPE_OPTIONS,
  ContentBlockType,
  ContentBlockTypeOption,
} from './back-office.model';
import { PostsFacade } from '../../facades/posts.facade';
import { PostsService } from '../../services/posts.service';

@Component({
  selector: 'app-back-office',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, NgxEditorModule],
  templateUrl: './back-office.component.html',
  styleUrl: './back-office.component.scss',
})
export class BackOfficeComponent implements OnDestroy {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly postsFacade = inject(PostsFacade);
  private readonly postsService = inject(PostsService);

  readonly isSubmitting = signal(false);
  readonly submitError = signal<string | null>(null);
  readonly submitSuccess = signal(false);

  readonly availableCategories = this.postsFacade.categories;

  private readonly _selectedCategories = signal<string[]>([]);
  readonly selectedCategories = this._selectedCategories.asReadonly();

  readonly isCategorySelected = computed(
    () => (slug: string) => this._selectedCategories().includes(slug)
  );

  toggleCategory(slug: string): void {
    this._selectedCategories.update((current) =>
      current.includes(slug)
        ? current.filter((s) => s !== slug)
        : [...current, slug]
    );
  }

  readonly blockTypeOptions: readonly ContentBlockTypeOption[] =
    BLOCK_TYPE_OPTIONS;

  readonly paragraphToolbar: Toolbar = [
    ['bold', 'italic', 'underline'],
    ['bullet_list', 'ordered_list'],
    ['link'],
  ];

  /** Parallel array to `blocks` FormArray — null for non-paragraph blocks. */
  editors: (Editor | null)[] = [];

  readonly form = new FormGroup({
    title: new FormControl('', {
      nonNullable: true,
      validators: Validators.required,
    }),
    abstract: new FormControl('', {
      nonNullable: true,
      validators: Validators.required,
    }),
    thumbnail_url: new FormControl('', {
      nonNullable: true,
      validators: Validators.required,
    }),
    blocks: new FormArray<FormGroup>([]),
  });

  get blocks(): FormArray<FormGroup> {
    return this.form.get('blocks') as FormArray<FormGroup>;
  }

  asFormGroup(control: AbstractControl): FormGroup {
    return control as FormGroup;
  }

  getTypeValue(block: AbstractControl): ContentBlockType {
    return (block as FormGroup).get('type')?.value as ContentBlockType;
  }

  addBlock(type: ContentBlockType): void {
    const editor = this.isBrowser && type === 'paragraph' ? new Editor() : null;
    this.editors.push(editor);
    this.blocks.push(
      new FormGroup({
        type: new FormControl<ContentBlockType>(type, { nonNullable: true }),
        content: new FormControl('', { nonNullable: true }),
      })
    );
  }

  removeBlock(index: number): void {
    this.editors[index]?.destroy();
    this.editors.splice(index, 1);
    this.blocks.removeAt(index);
  }

  preview(): void {
    if (!this.isBrowser) return;
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(this.buildPreviewHtml());
    win.document.close();
  }

  submit(): void {
    if (this.form.invalid || this.isSubmitting()) return;
    this.isSubmitting.set(true);
    this.submitError.set(null);
    this.submitSuccess.set(false);
    this.postsService.createPost(this.buildPayload()).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.submitSuccess.set(true);
        this.resetForm();
      },
      error: (err: unknown) => {
        this.isSubmitting.set(false);
        this.submitError.set(
          err instanceof Error ? err.message : 'Error al publicar el post'
        );
      },
    });
  }

  private resetForm(): void {
    this.form.reset();
    this.blocks.clear();
    this.editors.forEach((e) => e?.destroy());
    this.editors = [];
    this._selectedCategories.set([]);
  }

  private buildPayload() {
    const { title, abstract, thumbnail_url } = this.form.getRawValue();
    const titleDiv = `<div class='title'>${title.toUpperCase()}</div>`;
    const abstractDiv = `<div class='abstract'>${abstract}</div>`;
    const imgHeader = `<img src='${thumbnail_url}' alt='' />`;
    const content = titleDiv + abstractDiv + imgHeader + this.buildContent();
    return {
      title,
      abstract,
      img: thumbnail_url,
      categories: this._selectedCategories(),
      prod: true,
      content,
    };
  }

  private stripHtml(html: string): string {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    doc.body.querySelectorAll<HTMLElement>('*').forEach((el) => {
      el.style.removeProperty('color');
      el.style.removeProperty('background-color');
      if (!el.style.length) el.removeAttribute('style');
    });
    return doc.body.innerHTML;
  }

  private buildContent(): string {
    return this.blocks.controls
      .map((block) => {
        const type = this.getTypeValue(block);
        const raw = (block as FormGroup).get('content')?.value ?? '';
        if (type === 'image') {
          return `<img src='${raw}' alt='' />`;
        }
        const content = type === 'paragraph' ? this.stripHtml(raw) : raw;
        return `<div class='${type}'>${content}</div>`;
      })
      .join('');
  }

  private buildPreviewHtml(): string {
    const title = this.form.getRawValue().title;
    const abstract = this.form.getRawValue().abstract;
    return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>${title}</title>
  <style>
    @font-face {
      font-family: "Alte_haas_bold";
      src: url("/assets/fonts/Alte_haas/AlteHaasGroteskBold.ttf") format("opentype");
    }
    @font-face {
      font-family: "Alte_haas_regular";
      src: url("/assets/fonts/Alte_haas/AlteHaasGroteskRegular.ttf") format("opentype");
    }
    @font-face {
      font-family: "Exposure_var";
      src: url("/assets/fonts/Exposure_var/Exposure_VAR-VF.ttf") format("opentype");
    }
    *, *::before, *::after { box-sizing: border-box; }
    body {
      margin: 0;
      background-color: rgb(231, 65, 30);
      display: flex;
      justify-content: center;
      font-family: "Alte_haas_bold", sans-serif;
    }
    .wrap {
      padding: 3rem 0;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      max-width: 75%;
    }
    .title  { font-family: "Alte_haas_bold"; }
    .abstract { font-family: "Alte_haas_bold"; font-style: oblique; padding-bottom: 1rem; }
    .subtitle { font-family: "Alte_haas_bold"; }
    .paragraph { font-family: "Exposure_var"; }
    .paragraph p { margin: 0; }
    img { max-width: 100%; }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="title">${title.toUpperCase()}</div>
    <div class="abstract">${abstract}</div>
    ${this.buildContent()}
  </div>
</body>
</html>`;
  }

  ngOnDestroy(): void {
    this.editors.forEach((e) => e?.destroy());
  }
}
