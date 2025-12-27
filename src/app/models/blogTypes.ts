export interface BlogCategory {
  title: string;
  order: number;
}

export interface BlogIndexItem {
  id: string;
  img: string;
  title: string;
  abstract: string;
  categories: string[];
  prod: boolean;
}
