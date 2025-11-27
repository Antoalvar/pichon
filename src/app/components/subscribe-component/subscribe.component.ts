import { Component, output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-subscribe',
  imports: [ReactiveFormsModule],
  templateUrl: './subscribe.component.html',
  styleUrl: './subscribe.component.scss',
})
export class SubscribeComponent {
  close = output<void>();

  subscriptionEmail = new FormControl('');

  closeModal(): void {
    this.close.emit();
    console.log(this.subscriptionEmail.value);
  }

  sendSubscriptionEmail() {}
}
