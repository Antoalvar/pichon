import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BoActionBarComponent } from './bo-action-bar.component';
import { BackOfficeMode } from '../../back-office.model';

describe('BoActionBarComponent', () => {
  let fixture: ComponentFixture<BoActionBarComponent>;
  let component: BoActionBarComponent;

  function setInputs(overrides: {
    mode?: BackOfficeMode;
    isSubmitting?: boolean;
    isFormValid?: boolean;
    submitSuccess?: boolean;
    submitError?: string | null;
  } = {}): void {
    fixture.componentRef.setInput('mode', overrides.mode ?? 'create');
    fixture.componentRef.setInput('isSubmitting', overrides.isSubmitting ?? false);
    fixture.componentRef.setInput('isFormValid', overrides.isFormValid ?? true);
    fixture.componentRef.setInput('submitSuccess', overrides.submitSuccess ?? false);
    fixture.componentRef.setInput('submitError', overrides.submitError ?? null);
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoActionBarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BoActionBarComponent);
    component = fixture.componentInstance;
  });

  describe("mode = 'create'", () => {
    it('displays "Nuevo post" as the page title', () => {
      setInputs({ mode: 'create' });
      fixture.detectChanges();

      const h1 = fixture.nativeElement.querySelector('h1') as HTMLElement;
      expect(h1.textContent?.trim()).toBe('Nuevo post');
    });

    it('displays "Publicar" on the submit button', () => {
      setInputs({ mode: 'create' });
      fixture.detectChanges();

      const btn = fixture.nativeElement.querySelector('.btn--publish') as HTMLButtonElement;
      expect(btn.textContent).toContain('Publicar');
    });

    it('shows "Post publicado correctamente." when submitSuccess is true', () => {
      setInputs({ mode: 'create', submitSuccess: true });
      fixture.detectChanges();

      const banner = fixture.nativeElement.querySelector('.bo-banner--success') as HTMLElement;
      expect(banner).not.toBeNull();
      expect(banner.textContent).toContain('Post publicado correctamente.');
    });
  });

  describe("mode = 'edit'", () => {
    it('displays "Editar post" as the page title', () => {
      setInputs({ mode: 'edit' });
      fixture.detectChanges();

      const h1 = fixture.nativeElement.querySelector('h1') as HTMLElement;
      expect(h1.textContent?.trim()).toBe('Editar post');
    });

    it('displays "Guardar cambios" on the submit button', () => {
      setInputs({ mode: 'edit' });
      fixture.detectChanges();

      const btn = fixture.nativeElement.querySelector('.btn--publish') as HTMLButtonElement;
      expect(btn.textContent).toContain('Guardar cambios');
    });

    it('shows "Post actualizado correctamente." when submitSuccess is true', () => {
      setInputs({ mode: 'edit', submitSuccess: true });
      fixture.detectChanges();

      const banner = fixture.nativeElement.querySelector('.bo-banner--success') as HTMLElement;
      expect(banner).not.toBeNull();
      expect(banner.textContent).toContain('Post actualizado correctamente.');
    });
  });

  describe('button disabled states', () => {
    it('disables the publish button when isFormValid is false', () => {
      setInputs({ isFormValid: false });
      fixture.detectChanges();

      const btn = fixture.nativeElement.querySelector('.btn--publish') as HTMLButtonElement;
      expect(btn.disabled).toBe(true);
    });

    it('disables the publish button when isSubmitting is true', () => {
      setInputs({ isFormValid: true, isSubmitting: true });
      fixture.detectChanges();

      const btn = fixture.nativeElement.querySelector('.btn--publish') as HTMLButtonElement;
      expect(btn.disabled).toBe(true);
    });

    it('enables the publish button when isFormValid is true and isSubmitting is false', () => {
      setInputs({ isFormValid: true, isSubmitting: false });
      fixture.detectChanges();

      const btn = fixture.nativeElement.querySelector('.btn--publish') as HTMLButtonElement;
      expect(btn.disabled).toBe(false);
    });
  });

  describe('event outputs', () => {
    it('emits previewClick when the preview button is clicked', () => {
      setInputs({ isFormValid: true });
      fixture.detectChanges();

      let emitted = false;
      component.previewClick.subscribe(() => { emitted = true; });

      (fixture.nativeElement.querySelector('.btn--preview') as HTMLButtonElement).click();

      expect(emitted).toBe(true);
    });

    it('emits publishClick when the publish button is clicked', () => {
      setInputs({ isFormValid: true });
      fixture.detectChanges();

      let emitted = false;
      component.publishClick.subscribe(() => { emitted = true; });

      (fixture.nativeElement.querySelector('.btn--publish') as HTMLButtonElement).click();

      expect(emitted).toBe(true);
    });
  });

  describe('error banner', () => {
    it('shows the error banner with the error message when submitError has a value', () => {
      setInputs({ submitError: 'Server error' });
      fixture.detectChanges();

      const banner = fixture.nativeElement.querySelector('.bo-banner--error') as HTMLElement;
      expect(banner).not.toBeNull();
      expect(banner.textContent).toContain('Server error');
    });

    it('does not render the error banner when submitError is null', () => {
      setInputs({ submitError: null });
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('.bo-banner--error')).toBeNull();
    });
  });
});
