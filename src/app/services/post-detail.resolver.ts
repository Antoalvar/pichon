import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { PostDetail } from '../models/post.model';
import { PostsService } from './posts.service';

export const postDetailResolver: ResolveFn<PostDetail> = (route) => {
  const id = route.paramMap.get('id') as string;
  return inject(PostsService).getPostById(id);
};
