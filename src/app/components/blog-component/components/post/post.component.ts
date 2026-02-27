import { Component, inject, ViewEncapsulation } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { PostDetail } from '../../../../models/post.model';

@Component({
  selector: 'app-post',
  imports: [],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss',
})
export class PostComponent {
  readonly post = toSignal(
    inject(ActivatedRoute).data.pipe(map((data) => data['post'] as PostDetail))
  );
}
