import { Category } from './category.model';

export function createFakeCategory(overrides: Partial<Category> = {}): Category {
  return {
    id: 1,
    name: 'Technology',
    order: 1,
    slug: 'technology',
    ...overrides,
  };
}
