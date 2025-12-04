import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { RouterLink } from '@angular/router';
import { DownloadPdf } from './services/downloadPdf.service';
import { SubscribeComponent } from './components/subscribe-component/subscribe.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, SubscribeComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'pichon-front';
  #router = inject(Router);
  #downloadPdf = inject(DownloadPdf);

  isSubscribeModalVisible: boolean = false;

  navigateTHome() {
    this.#router.navigate(['/home']);
  }

  hideModal() {
    this.isSubscribeModalVisible = false;
  }

  showModal() {
    this.isSubscribeModalVisible = true;
  }

  downloadPdf() {
    const url = 'https://example.com/file.pdf';
    this.#downloadPdf.downloadFile().subscribe((blob) => {
      const a = document.createElement('a');
      const objectUrl = URL.createObjectURL(blob);
      a.href = objectUrl;
      a.download = 'file.pdf';
      a.click();
      URL.revokeObjectURL(objectUrl);
    });
  }
}
