import { ChangeDetectionStrategy, Component, ViewEncapsulation, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { PostDetail } from '../../../../models/post.model';
import { SeoService } from '../../../../services/seo.service';

@Component({
  selector: 'app-post',
  imports: [],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostComponent {
  private readonly seoService = inject(SeoService);

  readonly post = toSignal(
    inject(ActivatedRoute).data.pipe(map((data) => data['post'] as PostDetail))
  );

  constructor() {
    effect(() => {
      const post = this.post();
      if (!post) {
        return;
      }
      this.seoService.setPage({
        title: post.title,
        description: post.abstract,
        image: post.thumbnail_url,
        url: `https://revistapichon.es/post/${post.id}/${post.slug}`,
        type: 'article',
      });
      this.seoService.setJsonLd({
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.abstract,
        image: post.thumbnail_url,
        url: `https://revistapichon.es/post/${post.id}/${post.slug}`,
        datePublished: post.published_at,
        dateModified: post.published_at,
        author: {
          '@type': 'Organization',
          name: 'Pichón',
          url: 'https://revistapichon.es',
        },
        publisher: {
          '@type': 'Organization',
          name: 'Pichón',
          url: 'https://revistapichon.es',
        },
      });
    });
  }
}
