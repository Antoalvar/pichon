export interface PostsResponse {
  readonly count: number;
  readonly data: readonly Post[];
}

export interface PostDetailResponse {
  readonly data: PostDetail;
}

export interface Post {
  readonly id: string;
  readonly slug: string;
  readonly title: string;
  readonly abstract: string;
  readonly category_name: readonly string[];
  readonly thumbnail_url: string;
  readonly published_at: string;
}

export interface PostDetail extends Post {
  readonly slug: string;
  readonly content: string;
}

export interface CreatePostRequest {
  readonly title: string;
  readonly abstract: string;
  readonly img: string;
  readonly categories: readonly string[];
  readonly prod: boolean;
  readonly content: string;
}

/**
 * Request body for PATCH /posts/:id.
 * All fields are optional; only include fields that change.
 */
export interface UpdatePostRequest {
  readonly title?: string;
  readonly abstract?: string;
  readonly img?: string;
  readonly categories?: readonly string[];
  readonly prod?: boolean;
  readonly content?: string;
}

