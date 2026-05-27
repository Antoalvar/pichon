import { Component, inject, input, output, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  NewsletterPayload,
  NewsletterService,
} from '../../services/newsletterService';

@Component({
  selector: 'app-subscription-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './subscription-form.component.html',
  styleUrl: './subscription-form.component.scss',
})
export class SubscriptionFormComponent {
  private readonly newsletterService = inject(NewsletterService);

  readonly subscriptionSuccess = signal<boolean>(false);
  readonly subscriptionDone = output<boolean>();

  readonly selfClass = input<boolean>(true);

  subscriptionEmail = new FormControl('');
  subscriptionName = new FormControl('');
  privacyAccepted = new FormControl(false);

  sendSubscriptionEmail() {
    if (!this.privacyAccepted.value) {
      return;
    }

    const user: NewsletterPayload = {
      email: this.subscriptionEmail.value ?? '',
      fname: this.subscriptionName.value ?? '',
    };

    this.newsletterService.subscribe(user).subscribe({
      next: (response) => {
        this.subscriptionSuccess.set(true);
        this.subscriptionDone.emit;
        console.log('Suscripción exitosa', response);
      },
      error: (err) => {
        this.subscriptionSuccess.set(true);
        this.subscriptionDone.emit;
        console.error('Error en la petición', err);
      },
    });
  }
}
