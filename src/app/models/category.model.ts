export interface CategoriesResponse {
  readonly count: number;
  readonly data: readonly Category[];
}

export interface Category {
  readonly id: number;
  readonly name: string;
  readonly order: number;
  readonly slug: string;
}
