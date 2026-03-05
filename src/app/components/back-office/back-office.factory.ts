import { ContentBlockFormValue, PostFormValue } from './back-office.model';

export function createFakeContentBlockFormValue(
  overrides: Partial<ContentBlockFormValue> = {}
): ContentBlockFormValue {
  return {
    id: 1,
    type: 'subtitle',
    content: 'Test subtitle',
    ...overrides,
  };
}

export function createFakePostFormValue(overrides: Partial<PostFormValue> = {}): PostFormValue {
  return {
    title: 'Test Title',
    abstract: 'Test abstract',
    thumbnail_url: 'https://img.example.com/thumb.jpg',
    blocks: [],
    ...overrides,
  };
}
