import { Injectable, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Post } from '../models/post.model';
import { CategoriesService } from '../services/categories.service';
import { PostsService } from '../services/posts.service';
import { Category } from '../models/category.model';

@Injectable({ providedIn: 'root' })
export class PostsFacade {
  private readonly postsService = inject(PostsService);
  private readonly categoriesService = inject(CategoriesService);

  private readonly postsResource = rxResource<Post[], undefined>({
    stream: () => this.postsService.getPosts(),
  });

  private readonly categoriesResource = rxResource<Category[], undefined>({
    stream: () => this.categoriesService.getCategories(),
  });

  /** Resolved posts list, empty array while loading. */
  readonly posts = computed<Post[]>(() => this.postsResource.value() ?? []);

  /** Resolved categories list, empty array while loading. */
  readonly categories = computed<Category[]>(
    () => this.categoriesResource.value() ?? []
  );

  private readonly _selectedCategory = signal<string>('');

  /** The currently active category filter (empty string means no filter). */
  readonly selectedCategory = this._selectedCategory.asReadonly();

  /**
   * Posts filtered by the selected category.
   * Derived reactively from `posts` and `selectedCategory` — no imperative sync needed.
   */
  readonly filteredPosts = computed<Post[]>(() => {
    const category = this._selectedCategory();
    const allPosts = this.posts();
    if (!category) return allPosts;
    return allPosts.filter((post) =>
      post.category_name.some((name) => name.toLowerCase() === category)
    );
  });

  /** True while either resource is in flight. */
  readonly isLoading = computed(
    () => this.postsResource.isLoading() || this.categoriesResource.isLoading()
  );

  /** Error from the posts fetch, undefined if none. */
  readonly postsError = this.postsResource.error;

  /** Error from the categories fetch, undefined if none. */
  readonly categoriesError = this.categoriesResource.error;

  /**
   * Triggers a fresh reload of the posts list.
   * Call after any write operation (create, update, delete) to keep the
   * global post list in sync.
   */
  reloadPosts(): void {
    this.postsResource.reload();
  }

  /**
   * Toggles the active category filter.
   * Selecting the already-active category clears the filter.
   */
  selectCategory(category: Category): void {
    const incoming = category.name.toLowerCase();
    this._selectedCategory.update((current) =>
      current === incoming ? '' : incoming
    );
  }
}
