import { Component, output, signal } from '@angular/core';
import { SubscriptionFormComponent } from '../subscription-form/subscription-form.component';

@Component({
  selector: 'app-subscribe',
  imports: [SubscriptionFormComponent],
  templateUrl: './subscribe.component.html',
  styleUrl: './subscribe.component.scss',
})
export class SubscribeComponent {
  close = output<void>();
  readonly subscriptionSuccess = signal<boolean>(false);

  closeModal(): void {
    this.subscriptionSuccess.set(true);
    this.close.emit();
  }

  closeModalFromSubscription(): void {
    this.subscriptionSuccess.set(true);
    setTimeout(() => this.close.emit(), 2000);
  }
}
