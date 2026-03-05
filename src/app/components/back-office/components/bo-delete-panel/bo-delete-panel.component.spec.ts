import { ComponentFixture, TestBed } from '@angular/core/testing';
import { createFakePost } from '../../../../models/post.factory';
import { BoDeletePanelComponent } from './bo-delete-panel.component';

describe('BoDeletePanelComponent', () => {
  let fixture: ComponentFixture<BoDeletePanelComponent>;
  let component: BoDeletePanelComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoDeletePanelComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BoDeletePanelComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('posts', []);
    fixture.detectChanges();
  });

  it('renders the app-bo-post-selector element', () => {
    const selector = fixture.nativeElement.querySelector('app-bo-post-selector');
    expect(selector).not.toBeNull();
  });

  it('shows the success banner when deleteSuccess is true', () => {
    fixture.componentRef.setInput('deleteSuccess', true);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.bo-banner--success')).not.toBeNull();
  });

  it('does not show the success banner when deleteSuccess is false', () => {
    fixture.componentRef.setInput('deleteSuccess', false);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.bo-banner--success')).toBeNull();
  });

  it('shows the error banner containing the error message when deleteError has a value', () => {
    fixture.componentRef.setInput('deleteError', 'Error al eliminar');
    fixture.detectChanges();

    const banner = fixture.nativeElement.querySelector('.bo-banner--error') as HTMLElement;
    expect(banner).not.toBeNull();
    expect(banner.textContent).toContain('Error al eliminar');
  });

  it('does not show the error banner when deleteError is null', () => {
    fixture.componentRef.setInput('deleteError', null);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.bo-banner--error')).toBeNull();
  });

  it('forwards postSelect from the inner post selector', () => {
    fixture.componentRef.setInput('posts', [createFakePost({ id: 'post-1' })]);
    fixture.detectChanges();

    const emittedIds: string[] = [];
    component.postSelect.subscribe((id) => emittedIds.push(id));

    const select = fixture.nativeElement.querySelector('#bo-post-select') as HTMLSelectElement;
    select.value = 'post-1';
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(emittedIds).toContain('post-1');
  });

  it('emits deleteConfirmed when confirmDelete is called', () => {
    let count = 0;
    component.deleteConfirmed.subscribe(() => count++);

    component.confirmDelete();

    expect(count).toBe(1);
  });
});
