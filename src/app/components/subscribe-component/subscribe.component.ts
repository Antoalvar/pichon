import { Component, inject, output, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  NewsletterPayload,
  NewsletterService,
} from '../../services/newsletterService';

@Component({
  selector: 'app-subscribe',
  imports: [ReactiveFormsModule],
  templateUrl: './subscribe.component.html',
  styleUrl: './subscribe.component.scss',
})
export class SubscribeComponent {
  private readonly newsletterService = inject(NewsletterService);

  close = output<void>();
  readonly subscriptionSuccess = signal<boolean>(false);

  subscriptionEmail = new FormControl('');
  subscriptionName = new FormControl('');

  closeModal(): void {
    this.close.emit();
  }

  sendSubscriptionEmail() {
    const user: NewsletterPayload = {
      email: this.subscriptionEmail.value ?? '',
      fname: this.subscriptionName.value ?? '',
    };

    this.newsletterService.subscribe(user).subscribe({
      next: (response) => {
        this.subscriptionSuccess.set(true);
        setTimeout(() => this.closeModal(), 1000);
        console.log('Suscripción exitosa', response);
      },
      error: (err) => {
        console.error('Error en la petición', err);
      },
    });
  }
}
