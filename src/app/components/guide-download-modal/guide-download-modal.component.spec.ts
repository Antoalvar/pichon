import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { of } from 'rxjs';
import { GuideDownloadModalComponent } from './guide-download-modal.component';
import { NewsletterService } from '../../services/newsletterService';
import { NewsletterServiceMock } from '../../services/newsletterService.mock';

describe('GuideDownloadModalComponent', () => {
  let fixture: ComponentFixture<GuideDownloadModalComponent>;
  let component: GuideDownloadModalComponent;
  let newsletterServiceMock: NewsletterServiceMock;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuideDownloadModalComponent],
      providers: [
        NewsletterServiceMock,
        { provide: NewsletterService, useExisting: NewsletterServiceMock },
      ],
    }).compileComponents();

    newsletterServiceMock = TestBed.inject(NewsletterServiceMock);

    fixture = TestBed.createComponent(GuideDownloadModalComponent);
    fixture.componentRef.setInput('journeyId', 38);
    fixture.componentRef.setInput('stepId', 147);
    fixture.detectChanges();

    component = fixture.componentInstance;
  });

  describe('initialization', () => {
    it('should create successfully with required inputs journeyId=38 and stepId=147', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('template rendering', () => {
    it('should render name input, email input, subscribe checkbox, and submit button', () => {
      const nativeEl: HTMLElement = fixture.nativeElement;

      expect(nativeEl.querySelector('#modal-name')).not.toBeNull();
      expect(nativeEl.querySelector('#modal-email')).not.toBeNull();
      expect(nativeEl.querySelector('input[type="checkbox"]')).not.toBeNull();
      expect(nativeEl.querySelector('button[type="submit"]')).not.toBeNull();
    });

    it('should display "Descárgala ya" as submit button text when not loading', () => {
      const submitBtn = fixture.nativeElement.querySelector('button[type="submit"]') as HTMLButtonElement;

      expect(submitBtn.textContent?.trim()).toBe('Descárgala ya');
    });

    it('should have the subscribe checkbox checked by default', () => {
      const checkbox = fixture.nativeElement.querySelector('input[type="checkbox"]') as HTMLInputElement;

      expect(checkbox.checked).toBeTrue();
    });
  });

  describe('form validation', () => {
    it('should show name required error when name is empty and form is submitted', () => {
      component.form.setValue({ name: '', email: 'test@test.com', subscribe: false });
      component.onSubmit();
      fixture.detectChanges();

      const errorEl = fixture.nativeElement.querySelector('.field-error') as HTMLElement | null;

      expect(errorEl).not.toBeNull();
      expect(errorEl?.textContent?.trim()).toBe('El nombre es obligatorio');
    });

    it('should show email required error when email is empty and form is submitted', () => {
      component.form.setValue({ name: 'Test', email: '', subscribe: false });
      component.onSubmit();
      fixture.detectChanges();

      const errorEl = fixture.nativeElement.querySelector('.field-error') as HTMLElement | null;

      expect(errorEl).not.toBeNull();
      expect(errorEl?.textContent?.trim()).toBe('El email es obligatorio');
    });

    it('should show email format error when email is "notanemail" and form is submitted', () => {
      component.form.setValue({ name: 'Test', email: 'notanemail', subscribe: false });
      component.onSubmit();
      fixture.detectChanges();

      const errorEl = fixture.nativeElement.querySelector('.field-error') as HTMLElement | null;

      expect(errorEl).not.toBeNull();
      expect(errorEl?.textContent?.trim()).toBe('El formato del email no es válido');
    });
  });

  describe('onSubmit()', () => {
    it('should not call sendInfoEmail when form is invalid', () => {
      const spy = spyOn(newsletterServiceMock, 'sendInfoEmail');

      component.onSubmit();

      expect(spy).not.toHaveBeenCalled();
    });

    it('should call sendInfoEmail with correct payload when form is valid', fakeAsync(() => {
      const spy = spyOn(newsletterServiceMock, 'sendInfoEmail').and.returnValue(of<unknown>({}));

      component.form.setValue({ name: 'Test', email: 'test@test.com', subscribe: false });
      component.onSubmit();

      expect(spy).toHaveBeenCalledOnceWith({
        email: 'test@test.com',
        fname: 'Test',
        journey_id: 38,
        step_id: 147,
      });

      tick(2000);
    }));

    it('should not call subscribe when checkbox is unchecked', fakeAsync(() => {
      spyOn(newsletterServiceMock, 'sendInfoEmail').and.returnValue(of<unknown>({}));
      const subscribeSpy = spyOn(newsletterServiceMock, 'subscribe');

      component.form.setValue({ name: 'Test', email: 'test@test.com', subscribe: false });
      component.onSubmit();

      expect(subscribeSpy).not.toHaveBeenCalled();

      tick(2000);
    }));

    it('should call subscribe when checkbox is checked and form is valid', fakeAsync(() => {
      spyOn(newsletterServiceMock, 'sendInfoEmail').and.returnValue(of<unknown>({}));
      const subscribeSpy = spyOn(newsletterServiceMock, 'subscribe').and.returnValue(of<unknown>({}));

      component.form.setValue({ name: 'Test', email: 'test@test.com', subscribe: true });
      component.onSubmit();

      expect(subscribeSpy).toHaveBeenCalledOnceWith({ email: 'test@test.com', fname: 'Test' });

      tick(2000);
    }));

    it('should display success message after sendInfoEmail completes', fakeAsync(() => {
      spyOn(newsletterServiceMock, 'sendInfoEmail').and.returnValue(of<unknown>({}));

      component.form.setValue({ name: 'Test', email: 'test@test.com', subscribe: false });
      component.onSubmit();
      fixture.detectChanges();

      const successMsg = fixture.nativeElement.querySelector('.success-message') as HTMLElement | null;

      expect(successMsg).not.toBeNull();
      expect(successMsg?.textContent).toContain('¡Tu guía está en camino!');

      tick(2000);
    }));

    it('should emit close 2000ms after successful submission', fakeAsync(() => {
      spyOn(newsletterServiceMock, 'sendInfoEmail').and.returnValue(of<unknown>({}));

      let emitCount = 0;
      component.close.subscribe(() => { emitCount++; });

      component.form.setValue({ name: 'Test', email: 'test@test.com', subscribe: false });
      component.onSubmit();

      expect(emitCount).toBe(0);

      tick(2000);

      expect(emitCount).toBe(1);
    }));
  });

  describe('closeModal()', () => {
    it('should emit close when closeModal is called directly', () => {
      let emitCount = 0;
      component.close.subscribe(() => { emitCount++; });

      component.closeModal();

      expect(emitCount).toBe(1);
    });

    it('should emit close when the overlay backdrop is clicked', () => {
      let emitCount = 0;
      component.close.subscribe(() => { emitCount++; });

      const overlay = fixture.nativeElement.querySelector('.modal-overlay') as HTMLElement;
      overlay.click();

      expect(emitCount).toBe(1);
    });
  });
});
