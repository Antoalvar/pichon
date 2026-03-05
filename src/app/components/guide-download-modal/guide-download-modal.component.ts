import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
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

  readonly journeyId = input.required<number>();
  readonly stepId = input.required<number>();
  readonly close = output<void>();

  readonly isLoading = signal<boolean>(false);
  readonly downloadSuccess = signal<boolean>(false);

  readonly form = new FormGroup({
    name: new FormControl('', { validators: [Validators.required], nonNullable: true }),
    email: new FormControl('', {
      validators: [Validators.required, Validators.email],
      nonNullable: true,
    }),
    subscribe: new FormControl(true, { nonNullable: true }),
  });

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { name, email } = this.form.getRawValue();
    this.isLoading.set(true);

    const infoPayload: InfoEmailPayload = {
      email,
      fname: name,
      journey_id: this.journeyId(),
      step_id: this.stepId(),
    };

    // The Mailchimp journey requires the email to exist in the audience first.
    // We always subscribe (errors like 409 "already subscribed" are silently ignored),
    // then trigger the journey.
    this.newsletterService
      .subscribe({ email, fname: name })
      .pipe(
        catchError(() => of(null)),
        switchMap(() => this.newsletterService.sendInfoEmail(infoPayload)),
        catchError(() => of(null))
      )
      .subscribe(() => {
        this.isLoading.set(false);
        this.downloadSuccess.set(true);
        setTimeout(() => this.close.emit(), 2000);
      });
  }

  closeModal(): void {
    this.close.emit();
  }
}

