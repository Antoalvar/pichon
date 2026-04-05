import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
  signal,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  InfoEmailPayload,
  NewsletterService,
} from '../../services/newsletterService';
import { switchMap } from 'rxjs/operators';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-guide-download-modal',
  imports: [ReactiveFormsModule],
  templateUrl: './guide-download-modal.component.html',
  styleUrl: './guide-download-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GuideDownloadModalComponent {
  private readonly newsletterService = inject(NewsletterService);
  private readonly platformId = inject(PLATFORM_ID);

  readonly title = input.required<string>();
  readonly subtitle = input.required<string>();
  readonly journeyId = input<number | undefined>(undefined);
  readonly stepId = input<number | undefined>(undefined);
  readonly successUrl = input<string | undefined>(undefined);
  readonly close = output<void>();

  readonly isLoading = signal<boolean>(false);
  readonly downloadSuccess = signal<boolean>(false);
  readonly downloadError = signal<boolean>(false);

  readonly form = new FormGroup({
    name: new FormControl('', { validators: [Validators.required], nonNullable: true }),
    email: new FormControl('', {
      validators: [Validators.required, Validators.email],
      nonNullable: true,
    }),
  });

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { name, email } = this.form.getRawValue();
    this.isLoading.set(true);

    const jId = this.journeyId();
    const sId = this.stepId();
    const url = this.successUrl();

    // Open the window synchronously during the user gesture so mobile browsers
    // do not block it as a pop-up. The URL will be set once the request succeeds.
    const newWindow =
      url && isPlatformBrowser(this.platformId)
        ? window.open('', '_blank')
        : null;

    // Always subscribe first; silently ignore errors (e.g. 409 already subscribed).
    const subscribe$ = this.newsletterService
      .subscribe({ email, fname: name })
      .pipe(catchError(() => of(null)));

    // If journeyId + stepId are provided, trigger the Mailchimp journey to deliver
    // the guide by email. Otherwise (agenda case) just subscribing is enough.
    const action$ =
      jId != null && sId != null
        ? subscribe$.pipe(
            switchMap(() => {
              const infoPayload: InfoEmailPayload = {
                email,
                fname: name,
                journey_id: jId,
                step_id: sId,
              };
              return this.newsletterService.sendInfoEmail(infoPayload);
            })
          )
        : subscribe$;

    action$.subscribe({
      next: () => {
        if (newWindow && url) {
          newWindow.location.href = url;
        }
        this.isLoading.set(false);
        this.downloadSuccess.set(true);
        setTimeout(() => this.close.emit(), 2000);
      },
      error: () => {
        newWindow?.close();
        this.isLoading.set(false);
        this.downloadError.set(true);
      },
    });
  }

  closeModal(): void {
    this.close.emit();
  }
}

