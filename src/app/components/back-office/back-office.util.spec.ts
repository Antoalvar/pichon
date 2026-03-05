import { buildUpdatePayload, htmlToBlocks } from './back-office.util';
import {
  createFakeContentBlockFormValue,
  createFakePostFormValue,
} from './back-office.factory';

describe('htmlToBlocks', () => {
  it('returns an empty array for an empty string', () => {
    expect(htmlToBlocks('')).toEqual([]);
  });

  it('returns one paragraph block when content has a paragraph div', () => {
    const result = htmlToBlocks('<div class="paragraph">Hello</div>');
    expect(result).toEqual([{ type: 'paragraph', content: 'Hello' }]);
  });

  it('returns one subtitle block when content has a subtitle div', () => {
    const result = htmlToBlocks('<div class="subtitle">Sub</div>');
    expect(result).toEqual([{ type: 'subtitle', content: 'Sub' }]);
  });

  it('returns one caption block when content has a caption div', () => {
    const result = htmlToBlocks('<div class="caption">Cap</div>');
    expect(result).toEqual([{ type: 'caption', content: 'Cap' }]);
  });

  it('skips the first img element because it is the header thumbnail', () => {
    const result = htmlToBlocks('<img src="x.jpg">');
    expect(result).toEqual([]);
  });

  it('returns one image block for the second img element', () => {
    const result = htmlToBlocks('<img src="thumb.jpg"><img src="content.jpg">');
    expect(result).toEqual([{ type: 'image', content: 'content.jpg' }]);
  });

  it('skips title divs as reserved meta elements', () => {
    const result = htmlToBlocks('<div class="title">Title</div>');
    expect(result).toEqual([]);
  });

  it('skips abstract divs as reserved meta elements', () => {
    const result = htmlToBlocks('<div class="abstract">Abs</div>');
    expect(result).toEqual([]);
  });

  it('returns blocks in DOM order for mixed content, skipping all meta elements', () => {
    const html =
      "<div class='title'>Title</div>" +
      "<div class='abstract'>Abs</div>" +
      "<img src='thumb.jpg'>" +
      "<div class='subtitle'>Sub</div>" +
      "<div class='paragraph'>Para</div>" +
      "<img src='img2.jpg'>" +
      "<div class='caption'>Cap</div>";

    const result = htmlToBlocks(html);

    expect(result).toEqual([
      { type: 'subtitle', content: 'Sub' },
      { type: 'paragraph', content: 'Para' },
      { type: 'image', content: 'img2.jpg' },
      { type: 'caption', content: 'Cap' },
    ]);
  });
});

describe('buildUpdatePayload', () => {
  it('always sets prod to true', () => {
    const result = buildUpdatePayload(createFakePostFormValue(), []);
    expect(result.prod).toBe(true);
  });

  it('does NOT include the content field when includeContent is false (default)', () => {
    const result = buildUpdatePayload(createFakePostFormValue(), []);
    expect((result as Record<string, unknown>)['content']).toBeUndefined();
  });

  it('includes content HTML with the rendered block markup when includeContent is true', () => {
    const formValue = createFakePostFormValue({
      blocks: [createFakeContentBlockFormValue({ type: 'subtitle', content: 'MySubtitle' })],
    });

    const result = buildUpdatePayload(formValue, [], true);

    expect(result.content).toContain("<div class='subtitle'>MySubtitle</div>");
  });

  it('sets categories from the provided selected slugs', () => {
    const result = buildUpdatePayload(createFakePostFormValue(), ['tech', 'science']);
    expect(result.categories).toEqual(['tech', 'science']);
  });

  it('maps thumbnail_url to the img field', () => {
    const formValue = createFakePostFormValue({ thumbnail_url: 'https://example.com/img.jpg' });
    const result = buildUpdatePayload(formValue, []);
    expect(result.img).toBe('https://example.com/img.jpg');
  });

  it('carries title and abstract from the form value', () => {
    const formValue = createFakePostFormValue({ title: 'My Title', abstract: 'My Abstract' });
    const result = buildUpdatePayload(formValue, []);
    expect(result.title).toBe('My Title');
    expect(result.abstract).toBe('My Abstract');
  });
});
