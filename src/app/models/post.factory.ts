import { Post, PostDetail } from './post.model';

export function createFakePost(overrides: Partial<Post> = {}): Post {
  return {
    id: 'post-1',
    slug: 'test-post',
    title: 'Test Post',
    abstract: 'Test abstract',
    category_name: ['Tech'],
    thumbnail_url: 'https://img.example.com/thumb.jpg',
    published_at: '2024-01-01T00:00:00.000Z',
    ...overrides,
  };
}

export function createFakePostDetail(overrides: Partial<PostDetail> = {}): PostDetail {
  return {
    id: 'post-1',
    slug: 'test-post',
    title: 'Test Post',
    abstract: 'Test abstract',
    category_name: ['Tech'],
    thumbnail_url: 'https://img.example.com/thumb.jpg',
    published_at: '2024-01-01T00:00:00.000Z',
    content:
      "<div class='title'>TEST POST</div>" +
      "<div class='abstract'>Test abstract</div>" +
      "<img src='https://img.example.com/thumb.jpg' alt='' />" +
      "<div class='subtitle'>A subtitle</div>",
    ...overrides,
  };
}
