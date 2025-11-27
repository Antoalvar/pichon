import { Component, inject, signal, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { UsePostsService } from '../../hooks/use-posts.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-post',
  imports: [],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss',
})
export class PostComponent {
  readonly #activatedRoute = inject(ActivatedRoute);
  readonly #usePost = inject(UsePostsService);

  private readonly _post = signal<HTMLElement | null>(null);
  readonly post = this._post.asReadonly();

  constructor() {
    this.#getPost();
  }

  #getPost() {
    const postId = this.#activatedRoute.snapshot.paramMap.get('id');
    this.#usePost
      .getPostsById(postId as string)
      .pipe(takeUntilDestroyed())
      .subscribe((post) => this._post.set(post.text));
  }
}
