import { Component, effect, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { SubscribeComponent } from './components/subscribe-component/subscribe.component';
import { NavbarComponent } from './components/app-navbar/app-navbar.component';
import { PostsFacade } from './facades/posts.facade';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SubscribeComponent, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private router = inject(Router);
  private readonly _postsFacade = inject(PostsFacade);
  showSubscribe = signal<boolean>(true);

  isSubscribeModalVisible: boolean = true;
  isSubscribeButtonVisible = signal<boolean>(true);

  constructor() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((val) => {
        const segment = val.url.split('/')[1];
        const hideSubscribe =
          segment === 'subscribe' || segment === 'backOffice_101';
        this.isSubscribeButtonVisible.set(!hideSubscribe);
        if (hideSubscribe) {
          this.isSubscribeModalVisible = false;
        }
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
