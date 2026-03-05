import { Injectable, signal } from '@angular/core';
import { Category } from '../models/category.model';
import { Post } from '../models/post.model';

@Injectable()
export class PostsFacadeMock {
  readonly posts = signal<Post[]>([]);
  readonly categories = signal<Category[]>([]);

  reloadPosts(): void {}
}
