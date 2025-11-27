import { Component, inject } from '@angular/core';
import { UsePostsService } from '../blog-component/hooks/use-posts.service';
import { BlogCategory } from '../models/blogTypes';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  #usePosts = inject(UsePostsService);
  #router = inject(Router);

  categories = this.#usePosts.categories;
  selectedCategory = this.#usePosts.selectedCategory;

  selectSection(category: BlogCategory) {
    this.#usePosts.updateSelectedCategory(category);
    this.#router.navigate(['/blog']);
  }
}
