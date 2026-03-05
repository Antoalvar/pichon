import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit,
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
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

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

    const { name, email, subscribe } = this.form.getRawValue();
    this.isLoading.set(true);

    const infoPayload: InfoEmailPayload = {
      email,
      fname: name,
      journey_id: this.journeyId(),
      step_id: this.stepId(),
    };

    const infoEmail$ = this.newsletterService.sendInfoEmail(infoPayload).pipe(
      catchError(() => of(null))
    );

    const subscribe$ = subscribe
      ? this.newsletterService.subscribe({ email, fname: name }).pipe(catchError(() => of(null)))
      : of(null);

    forkJoin([infoEmail$, subscribe$]).subscribe(() => {
      this.isLoading.set(false);
      this.downloadSuccess.set(true);
      setTimeout(() => this.close.emit(), 2000);
    });
  }

  closeModal(): void {
    this.close.emit();
  }
}
