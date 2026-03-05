import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { createFakePostDetail } from '../models/post.factory';
import { PostDetail } from '../models/post.model';
import { PostsService } from './posts.service';
import { environment } from '../../environments/environment';

describe('PostsService', () => {
  let service: PostsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PostsService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(PostsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('updatePost', () => {
    it('sends a PATCH request to /posts/:id with the provided body', () => {
      const body = { title: 'Updated Title' };

      service.updatePost('post-1', body).subscribe();

      const req = httpMock.expectOne(`${environment.apiUrl}/posts/post-1`);
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual(body);
      req.flush({ data: createFakePostDetail() });
    });

    it('uses the given id in the request URL', () => {
      service.updatePost('post-99', {}).subscribe();

      const req = httpMock.expectOne(`${environment.apiUrl}/posts/post-99`);
      expect(req.request.url).toContain('post-99');
      req.flush({ data: createFakePostDetail() });
    });

    it('maps the response data field to the emitted PostDetail', () => {
      const fakeDetail = createFakePostDetail({ title: 'Mapped Title' });
      let result: PostDetail | undefined;

      service.updatePost('post-1', { title: 'Mapped Title' }).subscribe((d) => (result = d));

      httpMock.expectOne(`${environment.apiUrl}/posts/post-1`).flush({ data: fakeDetail });
      expect(result).toEqual(fakeDetail);
    });
  });

  describe('deletePost', () => {
    it('sends a DELETE request to /posts/:id', () => {
      service.deletePost('post-1').subscribe();

      const req = httpMock.expectOne(`${environment.apiUrl}/posts/post-1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });

    it('does not include a request body', () => {
      service.deletePost('post-1').subscribe();

      const req = httpMock.expectOne(`${environment.apiUrl}/posts/post-1`);
      expect(req.request.body).toBeNull();
      req.flush(null);
    });

    it('emits once and completes after a successful response', () => {
      let emitCount = 0;
      let completed = false;

      service.deletePost('post-1').subscribe({
        next: () => emitCount++,
        complete: () => (completed = true),
      });

      httpMock.expectOne(`${environment.apiUrl}/posts/post-1`).flush(null);

      expect(emitCount).toBe(1);
      expect(completed).toBe(true);
    });
  });
});
