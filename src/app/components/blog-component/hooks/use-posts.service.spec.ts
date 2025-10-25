import { TestBed } from '@angular/core/testing';

import { UsePostsService } from './use-posts.service';

describe('UsePostsService', () => {
  let service: UsePostsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsePostsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
