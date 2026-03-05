import { CreatePostRequest } from '../../models/post.model';
import { ContentBlockFormValue, PostFormValue } from './back-office.model';

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

/**
 * Assembles a {@link CreatePostRequest} from the current form value
 * and the selected category slugs.
 */
export function buildPayload(
  formValue: PostFormValue,
  selectedCategories: readonly string[]
): CreatePostRequest {
  const { title, abstract, thumbnail_url, blocks } = formValue;
  const titleDiv = `<div class='title'>${title.toUpperCase()}</div>`;
  const abstractDiv = `<div class='abstract'>${abstract}</div>`;
  const imgHeader = `<img src='${thumbnail_url}' alt='' />`;
  const content = titleDiv + abstractDiv + imgHeader + buildBlockContent(blocks);
  return {
    title,
    abstract,
    img: thumbnail_url,
    categories: [...selectedCategories],
    prod: true,
    content,
  };
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
