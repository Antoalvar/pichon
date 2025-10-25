import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BlogCategory, BlogIndexItem } from '../../models/blogTypes';

@Injectable({
  providedIn: 'root',
})
export class UsePostsService {
  #http = inject(HttpClient);

  private readonly _posts = signal<BlogIndexItem[]>([]);
  readonly posts = this._posts.asReadonly();

  private readonly _filteredPosts = signal<BlogIndexItem[]>([]);
  readonly filteredPosts = this._filteredPosts.asReadonly();

  private readonly _categories = signal<BlogCategory[]>([]);
  readonly categories = this._categories.asReadonly();

  constructor() {
    this.#getPostsIndex().subscribe((data: BlogIndexItem[]) => {
      this._posts.set(data);
      this._filteredPosts.set(data);
    });
    this.#getCategories().subscribe((data: BlogCategory[]) => {
      this._categories.set(data);
    });
  }

  #getPostsIndex(): Observable<any> {
    return this.#http
      .get('../../../assets/posts/index.json')
      .pipe(takeUntilDestroyed());
  }

  #getCategories(): Observable<any> {
    return this.#http
      .get('../../../assets/posts/categories.json')
      .pipe(takeUntilDestroyed());
  }

  updateCategory(category: string) {
    const currentPosts = this._posts();
    if (currentPosts.length > 0) {
      if (category) {
        this._filteredPosts.set(
          this._posts().filter((post) =>
            post.categories.includes(category.toLowerCase())
          )
        );
      } else {
        this._filteredPosts.set(this._posts());
      }
    }
  }
}
