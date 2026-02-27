import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { PostsFacade } from '../../facades/posts.facade';
import { Category } from '../../models/category.model';
import { Post } from '../../models/post.model';

@Component({
  selector: 'app-blog',
  imports: [],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.scss',
})
export class BlogComponent {
  readonly #router = inject(Router);
  private readonly postsFacade = inject(PostsFacade);

  readonly posts = this.postsFacade.filteredPosts;
  readonly categories = this.postsFacade.categories;
  readonly selectedCategory = this.postsFacade.selectedCategory;

  selectSection(category: Category): void {
    this.postsFacade.selectCategory(category);
  }

  navigateToPost(post: Post): void {
    this.#router.navigate(['/post', post.id, post.slug]);
  }
}
