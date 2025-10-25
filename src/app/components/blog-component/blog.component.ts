import { Component, computed, inject, signal } from '@angular/core';
import { UsePostsService } from './hooks/use-posts.service';
import { BlogCategory } from '../models/blogTypes';

@Component({
  selector: 'app-blog',
  imports: [],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.scss',
})
export class BlogComponent {
  public readonly IMAGE_FOLDER = '../../../assets/images';

  #usePosts = inject(UsePostsService);

  posts = computed(() => this.#usePosts.filteredPosts());
  categories = computed(() => this.#usePosts.categories());
  selectedCategory = signal<string>('');

  selectSection(category: BlogCategory) {
    const categoryToUpdate =
      category.title.toLocaleLowerCase() === this.selectedCategory()
        ? ''
        : category.title.toLocaleLowerCase();
    this.selectedCategory.set(categoryToUpdate);
    this.#usePosts.updateCategory(categoryToUpdate);
  }
}
