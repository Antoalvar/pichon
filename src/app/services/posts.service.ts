import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  Post,
  PostDetail,
  PostDetailResponse,
  PostsResponse,
  CreatePostRequest,
  UpdatePostRequest,
} from '../models/post.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PostsService {
  private readonly http = inject(HttpClient);

  getPosts(): Observable<Post[]> {
    return this.http
      .get<PostsResponse>(`${environment.apiUrl}/posts`)
      .pipe(map((response) => [...response.data]));
  }

  getPostById(id: string): Observable<PostDetail> {
    return this.http
      .get<PostDetailResponse>(`${environment.apiUrl}/posts/${id}`)
      .pipe(map((response) => response.data));
  }

  createPost(post: CreatePostRequest): Observable<PostDetail> {
    return this.http
      .post<PostDetailResponse>(`${environment.apiUrl}/posts`, post)
      .pipe(map((response) => response.data));
  }

  updatePost(id: string, body: UpdatePostRequest): Observable<PostDetail> {
    return this.http
      .patch<PostDetailResponse>(`${environment.apiUrl}/posts/${id}`, body)
      .pipe(map((response) => response.data));
  }

  deletePost(id: string): Observable<void> {
    return this.http
      .delete(`${environment.apiUrl}/posts/${id}`)
      .pipe(map(() => void 0));
  }
}

