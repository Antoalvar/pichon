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
}
