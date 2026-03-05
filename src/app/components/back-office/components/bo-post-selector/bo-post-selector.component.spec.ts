import { ComponentFixture, TestBed } from '@angular/core/testing';
import { createFakePost } from '../../../../models/post.factory';
import { BoPostSelectorComponent } from './bo-post-selector.component';

describe('BoPostSelectorComponent', () => {
  let fixture: ComponentFixture<BoPostSelectorComponent>;
  let component: BoPostSelectorComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoPostSelectorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BoPostSelectorComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('posts', []);
    fixture.componentRef.setInput('actionLabel', 'Cargar');
    fixture.detectChanges();
  });

  it('renders one option per post inside the select', () => {
    fixture.componentRef.setInput('posts', [
      createFakePost({ id: '1', title: 'Post One' }),
      createFakePost({ id: '2', title: 'Post Two' }),
    ]);
    fixture.detectChanges();

    const postOptions = fixture.nativeElement.querySelectorAll(
      '#bo-post-select option:not([disabled])'
    );
    expect(postOptions.length).toBe(2);
  });

  it('displays the actionLabel text on the action button', () => {
    fixture.componentRef.setInput('actionLabel', 'Editar seleccionado');
    fixture.detectChanges();

    const btn = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(btn.textContent).toContain('Editar seleccionado');
  });

  it('disables the action button when selectedPostId is null', () => {
    fixture.componentRef.setInput('selectedPostId', null);
    fixture.detectChanges();

    const btn = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(btn.disabled).toBe(true);
  });

  it('disables the action button when selectedPostId is an empty string', () => {
    fixture.componentRef.setInput('selectedPostId', '');
    fixture.detectChanges();

    const btn = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(btn.disabled).toBe(true);
  });

  it('enables the action button when selectedPostId is set and isLoading is false', () => {
    fixture.componentRef.setInput('selectedPostId', 'post-1');
    fixture.componentRef.setInput('isLoading', false);
    fixture.detectChanges();

    const btn = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(btn.disabled).toBe(false);
  });

  it('disables the action button when isLoading is true even if a post is selected', () => {
    fixture.componentRef.setInput('selectedPostId', 'post-1');
    fixture.componentRef.setInput('isLoading', true);
    fixture.detectChanges();

    const btn = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(btn.disabled).toBe(true);
  });

  it('emits postSelect with the selected id when the native select changes', () => {
    fixture.componentRef.setInput('posts', [createFakePost({ id: 'post-1' })]);
    fixture.detectChanges();

    const emittedIds: string[] = [];
    component.postSelect.subscribe((id) => emittedIds.push(id));

    const select = fixture.nativeElement.querySelector('select') as HTMLSelectElement;
    select.value = 'post-1';
    select.dispatchEvent(new Event('change'));

    expect(emittedIds).toContain('post-1');
  });

  it('emits actionClick when the action button is clicked', () => {
    fixture.componentRef.setInput('selectedPostId', 'post-1');
    fixture.componentRef.setInput('isLoading', false);
    fixture.detectChanges();

    let clicked = false;
    component.actionClick.subscribe(() => { clicked = true; });

    (fixture.nativeElement.querySelector('button') as HTMLButtonElement).click();

    expect(clicked).toBe(true);
  });
});
