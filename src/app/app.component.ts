import { Component, effect, inject, signal } from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterOutlet,
} from '@angular/router';
import { SubscribeComponent } from './components/subscribe-component/subscribe.component';
import { NavbarComponent } from './components/app-navbar/app-navbar.component';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SubscribeComponent, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private router = inject(Router);
  showSubscribe = signal<boolean>(true);

  isSubscribeModalVisible: boolean = true;
  isSubscribeButtonVisible = signal<boolean>(true);

  constructor() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((val) => {
        console.log(val.url.split('/'));
        if (val.url.split('/')[1] === 'subscribe') {
          console.log(val.url.split('/'));
          this.isSubscribeButtonVisible.set(false);
          this.isSubscribeModalVisible = false;
        } else {
          this.isSubscribeButtonVisible.set(true);
        }
        console.log(val);
      });
  }

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
