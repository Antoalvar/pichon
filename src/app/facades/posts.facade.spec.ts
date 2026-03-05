import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { environment } from '../../environments/environment';
import { PostsFacade } from './posts.facade';

describe('PostsFacade', () => {
  let facade: PostsFacade;
  let httpMock: HttpTestingController;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    facade = TestBed.inject(PostsFacade);
    httpMock = TestBed.inject(HttpTestingController);

    tick();
    httpMock
      .match((req) => req.url.includes('/posts') || req.url.includes('/categories'))
      .forEach((req) => req.flush({ count: 0, data: [] }));
    tick();
  }));

  afterEach(() => {
    httpMock.verify();
  });

  describe('reloadPosts', () => {
    it('does not throw when called', () => {
      expect(() => facade.reloadPosts()).not.toThrow();
    });

    it('issues a new GET /posts request after being called', fakeAsync(() => {
      facade.reloadPosts();
      tick();

      const reloadReqs = httpMock.match(`${environment.apiUrl}/posts`);
      expect(reloadReqs.length).toBeGreaterThan(0);
      reloadReqs.forEach((req) => req.flush({ count: 0, data: [] }));
    }));
  });
});
