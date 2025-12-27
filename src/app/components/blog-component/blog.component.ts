import { Component, inject } from '@angular/core';
import { UsePostsService } from './hooks/use-posts.service';
import { BlogCategory, BlogIndexItem } from '../../models/blogTypes';
import { Router } from '@angular/router';

@Component({
  selector: 'app-blog',
  imports: [],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.scss',
})
export class BlogComponent {
  readonly #usePosts = inject(UsePostsService);
  readonly #router = inject(Router);

  posts = this.#usePosts.filteredPosts;
  categories = this.#usePosts.categories;
  selectedCategory = this.#usePosts.selectedCategory;

  selectSection(category: BlogCategory) {
    this.#usePosts.updateSelectedCategory(category);
  }

  navigateToPost(post: BlogIndexItem) {
    this.#router.navigate(['/post', post.id]);
  }
}
