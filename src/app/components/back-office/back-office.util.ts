import { CreatePostRequest, UpdatePostRequest } from '../../models/post.model';
import { ContentBlockType, ContentBlockFormValue, ParsedBlock, PostFormValue } from './back-office.model';

/**
 * Strips inline `color` and `background-color` styles from an HTML string
 * via DOMParser. Returns the sanitised inner HTML.
 */
export function stripHtml(html: string): string {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  doc.body.querySelectorAll<HTMLElement>('*').forEach((el) => {
    el.style.removeProperty('color');
    el.style.removeProperty('background-color');
    if (!el.style.length) el.removeAttribute('style');
  });
  return doc.body.innerHTML;
}

/**
 * Maps an array of content blocks to their HTML string representations,
 * concatenated without separators.
 */
export function buildBlockContent(
  blocks: readonly ContentBlockFormValue[]
): string {
  return blocks
    .map((block) => {
      const { type, content } = block;
      if (type === 'image') return `<img src='${content}' alt='' />`;
      const inner = type === 'paragraph' ? stripHtml(content) : content;
      return `<div class='${type}'>${inner}</div>`;
    })
    .join('');
}

/** Shared body builder used by both create and update payloads. */
function buildPostBody(
  formValue: PostFormValue,
  selectedCategories: readonly string[]
): { title: string; abstract: string; img: string; categories: string[]; content: string } {
  const { title, abstract, thumbnail_url, blocks } = formValue;
  const titleDiv = `<div class='title'>${title.toUpperCase()}</div>`;
  const abstractDiv = `<div class='abstract'>${abstract}</div>`;
  const imgHeader = `<img src='${thumbnail_url}' alt='' />`;
  return {
    title,
    abstract,
    img: thumbnail_url,
    categories: [...selectedCategories],
    content: titleDiv + abstractDiv + imgHeader + buildBlockContent(blocks),
  };
}

/**
 * Assembles a {@link CreatePostRequest} from the current form value
 * and the selected category slugs.
 */
export function buildPayload(
  formValue: PostFormValue,
  selectedCategories: readonly string[]
): CreatePostRequest {
  return { ...buildPostBody(formValue, selectedCategories), prod: true };
}

/**
 * Assembles an {@link UpdatePostRequest} (PATCH body) from the current form
 * value and the selected category slugs.
 *
 * When `includeContent` is false (default), the `content` field is omitted so
 * the backend keeps the existing post body unchanged.
 */
export function buildUpdatePayload(
  formValue: PostFormValue,
  selectedCategories: readonly string[],
  includeContent = false
): UpdatePostRequest {
  const body = buildPostBody(formValue, selectedCategories);
  if (!includeContent) {
    return { title: body.title, abstract: body.abstract, img: body.img, categories: body.categories, prod: true };
  }
  return { ...body, prod: true };
}

/**
 * Parses stored post HTML content back into an array of {@link ParsedBlock}
 * objects — the inverse of `buildBlockContent`.
 *
 * The stored format is:
 * ```
 * <div class='title'>…</div>
 * <div class='abstract'>…</div>
 * <img src='thumbnail_url' alt='' />
 * [zero or more block elements]
 * ```
 */
export function htmlToBlocks(content: string): ParsedBlock[] {
  if (!content) return [];

  const doc = new DOMParser().parseFromString(content, 'text/html');
  const children = Array.from(doc.body.children);
  const blocks: ParsedBlock[] = [];
  let headerImgConsumed = false;

  for (const el of children) {
    const cls = el.className;

    // Skip title and abstract divs (reserved meta classes)
    if (cls === 'title' || cls === 'abstract') continue;

    if (el.tagName === 'IMG') {
      if (!headerImgConsumed) {
        // First <img> is the header thumbnail — skip it
        headerImgConsumed = true;
        continue;
      }
      // Subsequent <img> elements are image blocks
      blocks.push({ type: 'image', content: el.getAttribute('src') ?? '' });
      continue;
    }

    if (cls === 'paragraph') {
      blocks.push({ type: 'paragraph', content: el.innerHTML });
    } else if (cls === 'subtitle' || cls === 'caption') {
      blocks.push({ type: cls as ContentBlockType, content: el.textContent ?? '' });
    }
    // Unknown classes are ignored defensively
  }

  return blocks;
}

/**
 * Returns a complete HTML document string suitable for writing into a
 * `window.open()` preview tab.
 */
export function buildPreviewHtml(formValue: PostFormValue): string {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>${formValue.title}</title>
  <style>
    @font-face { font-family: "Alte_haas_bold"; src: url("/assets/fonts/Alte_haas/AlteHaasGroteskBold.ttf") format("opentype"); }
    @font-face { font-family: "Alte_haas_regular"; src: url("/assets/fonts/Alte_haas/AlteHaasGroteskRegular.ttf") format("opentype"); }
    @font-face { font-family: "Exposure_var"; src: url("/assets/fonts/Exposure_var/Exposure_VAR-VF.ttf") format("opentype"); }
    *, *::before, *::after { box-sizing: border-box; }
    body { margin: 0; background-color: rgb(231, 65, 30); display: flex; justify-content: center; font-family: "Alte_haas_bold", sans-serif; }
    .wrap { padding: 3rem 0; display: flex; flex-direction: column; gap: 1rem; max-width: 75%; }
    .title { font-family: "Alte_haas_bold"; }
    .abstract { font-family: "Alte_haas_bold"; font-style: oblique; padding-bottom: 1rem; }
    .subtitle { font-family: "Alte_haas_bold"; }
    .paragraph { font-family: "Exposure_var"; }
    .paragraph p { margin: 0; }
    img { max-width: 100%; }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="title">${formValue.title.toUpperCase()}</div>
    <div class="abstract">${formValue.abstract}</div>
    ${buildBlockContent(formValue.blocks)}
  </div>
</body>
</html>`;
}

