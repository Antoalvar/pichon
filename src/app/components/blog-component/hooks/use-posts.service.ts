import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { filter, map, Observable } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BlogCategory, BlogIndexItem } from '../../../models/blogTypes';

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

  private readonly _selectedCategory = signal<string>('');
  readonly selectedCategory = this._selectedCategory.asReadonly();

  constructor() {
    this.#getPostsIndex()
      .pipe(
        map((posts: BlogIndexItem[]) => posts.filter((post) => !!post.prod)),
        takeUntilDestroyed()
      )
      .subscribe((data: BlogIndexItem[]) => {
        this._posts.set(data);
        this._filteredPosts.set(data);
      });
    this.#getCategories()
      .pipe(takeUntilDestroyed())
      .subscribe((data: BlogCategory[]) => {
        this._categories.set(data);
      });
  }

  #getPostsIndex(): Observable<any> {
    return this.#http
      .get('../../../assets/posts/index.json')
      .pipe(takeUntilDestroyed());
  }

  getPostsById(id: string): Observable<any> {
    const url = `../../../assets/posts/${id}.json`;
    return this.#http.get(url).pipe(takeUntilDestroyed());
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

  updateSelectedCategory(category: BlogCategory) {
    const categoryToUpdate =
      category.title.toLocaleLowerCase() === this.selectedCategory()
        ? ''
        : category.title.toLocaleLowerCase();

    this._selectedCategory.set(categoryToUpdate);
    this.updateCategory(categoryToUpdate);
  }
}
