import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { NewsletterService } from '../../services/newsletterService';

@Component({
  selector: 'app-unsubscribe',
  imports: [ReactiveFormsModule],
  templateUrl: './unsubscribe.component.html',
  styleUrl: './unsubscribe.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnsubscribeComponent {
  private readonly newsletterService = inject(NewsletterService);

  readonly unsubscribeSuccess = signal<boolean>(false);
  readonly errorMessage = signal<string>('');

  emailControl = new FormControl('', [Validators.required, Validators.email]);

  unsubscribe(): void {
    if (this.emailControl.invalid) {
      return;
    }

    this.errorMessage.set('');

    this.newsletterService.unsubscribe(this.emailControl.value ?? '').subscribe({
      next: () => {
        this.unsubscribeSuccess.set(true);
      },
      error: () => {
        this.errorMessage.set(
          'No se pudo procesar la solicitud. Comprueba que el email es correcto o inténtalo más tarde.'
        );
      },
    });
  }
}
