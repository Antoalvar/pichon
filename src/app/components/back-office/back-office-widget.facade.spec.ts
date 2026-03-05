import { TestBed } from '@angular/core/testing';
import { of, Subject } from 'rxjs';
import { PostsFacade } from '../../facades/posts.facade';
import { PostsFacadeMock } from '../../facades/posts.facade.mock';
import { createFakePostDetail } from '../../models/post.factory';
import { PostsService } from '../../services/posts.service';
import { PostsServiceMock } from '../../services/posts.service.mock';
import { BackOfficeWidgetFacade } from './back-office-widget.facade';

describe('BackOfficeWidgetFacade', () => {
  let facade: BackOfficeWidgetFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BackOfficeWidgetFacade,
        PostsServiceMock,
        { provide: PostsService, useExisting: PostsServiceMock },
        PostsFacadeMock,
        { provide: PostsFacade, useExisting: PostsFacadeMock },
      ],
    });

    facade = TestBed.inject(BackOfficeWidgetFacade);
  });

  describe('setMode', () => {
    it("changes mode() to 'edit' when called with 'edit'", () => {
      facade.setMode('edit');
      expect(facade.mode()).toBe('edit');
    });

    it("resets the form and block groups when switching back to 'create' from 'edit'", () => {
      facade.setMode('edit');
      facade.form.patchValue({ title: 'T', abstract: 'A', thumbnail_url: 'http://u' });
      facade.addBlock('subtitle');

      facade.setMode('create');

      expect(facade.mode()).toBe('create');
      expect(facade.form.get('title')!.value).toBe('');
      expect(facade.blockGroups().length).toBe(0);
    });

    it('is a no-op when the incoming mode equals the current mode', () => {
      facade.form.patchValue({ title: 'T', abstract: 'A', thumbnail_url: 'http://u' });

      facade.setMode('create');

      expect(facade.form.get('title')!.value).toBe('T');
    });
  });

  describe('selectPost', () => {
    it('sets selectedPostId() to the provided id', () => {
      facade.selectPost('123');
      expect(facade.selectedPostId()).toBe('123');
    });
  });

  describe('toggleCategory', () => {
    it('adds a slug to selectedCategories when toggled on', () => {
      facade.toggleCategory('tech');
      expect(facade.selectedCategories()).toContain('tech');
    });

    it('removes a slug from selectedCategories when toggled a second time', () => {
      facade.toggleCategory('tech');
      facade.toggleCategory('tech');
      expect(facade.selectedCategories()).not.toContain('tech');
    });

    it('can hold multiple independent slugs', () => {
      facade.toggleCategory('tech');
      facade.toggleCategory('science');
      expect(facade.selectedCategories()).toContain('tech');
      expect(facade.selectedCategories()).toContain('science');
    });
  });

  describe('addBlock', () => {
    it('appends one block group to blockGroups() with the given type', () => {
      facade.addBlock('subtitle');

      expect(facade.blockGroups().length).toBe(1);
      expect(facade.blockGroups()[0].get('type')!.value).toBe('subtitle');
    });

    it('assigns a unique id to each added block', () => {
      facade.addBlock('subtitle');
      facade.addBlock('caption');

      const id1 = facade.blockGroups()[0].get('id')!.value as number;
      const id2 = facade.blockGroups()[1].get('id')!.value as number;
      expect(id1).not.toBe(id2);
    });
  });

  describe('removeBlock', () => {
    it('removes the block group with the given id from blockGroups()', () => {
      facade.addBlock('subtitle');
      const blockId = facade.blockGroups()[0].get('id')!.value as number;

      facade.removeBlock(blockId);

      expect(facade.blockGroups().length).toBe(0);
    });

    it('is a no-op when the id does not correspond to any block', () => {
      facade.addBlock('subtitle');

      facade.removeBlock(9999);

      expect(facade.blockGroups().length).toBe(1);
    });
  });

  describe('submitCreate', () => {
    it('calls postsService.createPost and sets submitSuccess to true on success', () => {
      const mockService = TestBed.inject(PostsServiceMock);
      spyOn(mockService, 'createPost').and.returnValue(of(createFakePostDetail()));

      facade.form.patchValue({ title: 'Title', abstract: 'Abstract', thumbnail_url: 'http://u' });
      facade.submitCreate();

      expect(mockService.createPost).toHaveBeenCalled();
      expect(facade.submitSuccess()).toBe(true);
    });

    it('calls postsService.createPost with prod: true', () => {
      const mockService = TestBed.inject(PostsServiceMock);
      spyOn(mockService, 'createPost').and.returnValue(of(createFakePostDetail()));

      facade.form.patchValue({ title: 'T', abstract: 'A', thumbnail_url: 'http://u' });
      facade.submitCreate();

      expect(mockService.createPost).toHaveBeenCalledWith(
        jasmine.objectContaining({ prod: true })
      );
    });

    it('does not call postsService.createPost when the form is invalid', () => {
      const mockService = TestBed.inject(PostsServiceMock);
      spyOn(mockService, 'createPost');

      facade.submitCreate();

      expect(mockService.createPost).not.toHaveBeenCalled();
    });

    it('calls postsFacade.reloadPosts after a successful create', () => {
      const mockService = TestBed.inject(PostsServiceMock);
      const mockFacade = TestBed.inject(PostsFacadeMock);
      spyOn(mockService, 'createPost').and.returnValue(of(createFakePostDetail()));
      spyOn(mockFacade, 'reloadPosts');

      facade.form.patchValue({ title: 'T', abstract: 'A', thumbnail_url: 'http://u' });
      facade.submitCreate();

      expect(mockFacade.reloadPosts).toHaveBeenCalled();
    });
  });

  describe('submitEdit', () => {
    it('calls postsService.updatePost with the post id and prod: true when form is valid', () => {
      const mockService = TestBed.inject(PostsServiceMock);
      spyOn(mockService, 'updatePost').and.returnValue(of(createFakePostDetail()));

      facade.selectPost('post-1');
      facade.loadPostForEdit();
      facade.form.patchValue({ title: 'Title', abstract: 'Abstract', thumbnail_url: 'http://u' });

      facade.submitEdit();

      expect(mockService.updatePost).toHaveBeenCalledWith(
        'post-1',
        jasmine.objectContaining({ prod: true })
      );
    });

    it('omits the content field from the payload when no blocks have been added', () => {
      const mockService = TestBed.inject(PostsServiceMock);
      const calls: unknown[] = [];
      spyOn(mockService, 'updatePost').and.callFake((_, body) => {
        calls.push(body);
        return of(createFakePostDetail());
      });

      facade.selectPost('post-1');
      facade.loadPostForEdit();
      facade.form.patchValue({ title: 'Title', abstract: 'Abstract', thumbnail_url: 'http://u' });

      facade.submitEdit();

      expect((calls[0] as Record<string, unknown>)['content']).toBeUndefined();
    });

    it('includes the content field in the payload when blocks have been added', () => {
      const mockService = TestBed.inject(PostsServiceMock);
      const calls: unknown[] = [];
      spyOn(mockService, 'updatePost').and.callFake((_, body) => {
        calls.push(body);
        return of(createFakePostDetail());
      });

      facade.selectPost('post-1');
      facade.loadPostForEdit();
      facade.form.patchValue({ title: 'Title', abstract: 'Abstract', thumbnail_url: 'http://u' });
      facade.addBlock('subtitle');

      facade.submitEdit();

      expect((calls[0] as Record<string, unknown>)['content']).toBeDefined();
    });

    it('sets submitSuccess to true after a successful update', () => {
      const mockService = TestBed.inject(PostsServiceMock);
      spyOn(mockService, 'updatePost').and.returnValue(of(createFakePostDetail()));

      facade.selectPost('post-1');
      facade.loadPostForEdit();
      facade.form.patchValue({ title: 'Title', abstract: 'Abstract', thumbnail_url: 'http://u' });

      facade.submitEdit();

      expect(facade.submitSuccess()).toBe(true);
    });

    it('does not call postsService.updatePost when no post is loaded', () => {
      const mockService = TestBed.inject(PostsServiceMock);
      spyOn(mockService, 'updatePost');

      facade.form.patchValue({ title: 'T', abstract: 'A', thumbnail_url: 'http://u' });
      facade.submitEdit();

      expect(mockService.updatePost).not.toHaveBeenCalled();
    });

    it('does not call postsService.updatePost when the form is invalid', () => {
      const mockService = TestBed.inject(PostsServiceMock);
      spyOn(mockService, 'updatePost');

      facade.selectPost('post-1');
      facade.loadPostForEdit();

      facade.submitEdit();

      expect(mockService.updatePost).not.toHaveBeenCalled();
    });
  });

  describe('submitDelete', () => {
    it('calls postsService.deletePost with the selected post id', () => {
      const mockService = TestBed.inject(PostsServiceMock);
      const deleteSubject = new Subject<void>();
      spyOn(mockService, 'deletePost').and.returnValue(deleteSubject.asObservable());

      facade.selectPost('post-1');
      facade.submitDelete();

      expect(mockService.deletePost).toHaveBeenCalledWith('post-1');
      deleteSubject.next();
    });

    it('sets deleteSuccess to true and clears selectedPostId on success', () => {
      const mockService = TestBed.inject(PostsServiceMock);
      const deleteSubject = new Subject<void>();
      spyOn(mockService, 'deletePost').and.returnValue(deleteSubject.asObservable());

      facade.selectPost('post-1');
      facade.submitDelete();
      deleteSubject.next();

      expect(facade.deleteSuccess()).toBe(true);
      expect(facade.selectedPostId()).toBeUndefined();
    });

    it('calls postsFacade.reloadPosts after a successful delete', () => {
      const mockService = TestBed.inject(PostsServiceMock);
      const mockFacade = TestBed.inject(PostsFacadeMock);
      const deleteSubject = new Subject<void>();
      spyOn(mockService, 'deletePost').and.returnValue(deleteSubject.asObservable());
      spyOn(mockFacade, 'reloadPosts');

      facade.selectPost('post-1');
      facade.submitDelete();
      deleteSubject.next();

      expect(mockFacade.reloadPosts).toHaveBeenCalled();
    });

    it('does not call postsService.deletePost when no post is selected', () => {
      const mockService = TestBed.inject(PostsServiceMock);
      spyOn(mockService, 'deletePost');

      facade.submitDelete();

      expect(mockService.deletePost).not.toHaveBeenCalled();
    });
  });
});
