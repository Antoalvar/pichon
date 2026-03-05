import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { PostsFacade } from '../../facades/posts.facade';
import { Category } from '../../models/category.model';
import { Post } from '../../models/post.model';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-blog',
  imports: [],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogComponent {
  readonly #router = inject(Router);
  private readonly postsFacade = inject(PostsFacade);
  private readonly seoService = inject(SeoService);

  readonly posts = this.postsFacade.filteredPosts;
  readonly categories = this.postsFacade.categories;
  readonly selectedCategory = this.postsFacade.selectedCategory;

  constructor() {
    this.seoService.setPage({
      title: 'Blog',
      description: 'Artículos, recomendaciones y guías culturales para familias de Pichón.',
      url: 'https://revistapichon.es/blog',
    });
  }

  selectSection(category: Category): void {
    this.postsFacade.selectCategory(category);
  }

  navigateToPost(post: Post): void {
    this.#router.navigate(['/post', post.id, post.slug]);
  }
}
