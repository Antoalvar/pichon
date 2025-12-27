import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SubscribeComponent } from './components/subscribe-component/subscribe.component';
import { NavbarComponent } from './components/app-navbar/app-navbar.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SubscribeComponent, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  isSubscribeModalVisible: boolean = false;

  hideModal() {
    this.isSubscribeModalVisible = false;
  }

  showModal() {
    this.isSubscribeModalVisible = true;
  }

  openInstagram() {
    window.open(
      'https://www.instagram.com/pichonrevista?igsh=MTJlNWY5ejU4ajg1Mg%3D%3D&utm_source=qr',
      '_blank'
    );
  }
}
