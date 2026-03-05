import { Injectable } from '@angular/core';
import { NEVER, Observable } from 'rxjs';
import { CreatePostRequest, Post, PostDetail, UpdatePostRequest } from '../models/post.model';

@Injectable()
export class PostsServiceMock {
  getPosts(): Observable<Post[]> {
    return NEVER;
  }

  getPostById(_id: string): Observable<PostDetail> {
    return NEVER;
  }

  createPost(_post: CreatePostRequest): Observable<PostDetail> {
    return NEVER;
  }

  updatePost(_id: string, _body: UpdatePostRequest): Observable<PostDetail> {
    return NEVER;
  }

  deletePost(_id: string): Observable<void> {
    return NEVER;
  }
}
