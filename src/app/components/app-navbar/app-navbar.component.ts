import { Component, inject, signal } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { map } from 'rxjs/operators';
import { Router, RouterLink } from '@angular/router';
import { DownloadPdf } from '../../services/downloadPdf.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { MenuButtonComponent } from '../menu-button/menu-button.component';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'app-navbar',
  templateUrl: './app-navbar.component.html',
  styleUrl: './app-navbar.component.scss',
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    RouterLink,
    MenuButtonComponent,
    NgTemplateOutlet,
  ],
})
export class NavbarComponent {
  private readonly router = inject(Router);
  private readonly downloadPdf = inject(DownloadPdf);

  private breakpointObserver = inject(BreakpointObserver);

  readonly hiddenMenuOn = signal<boolean>(false);

  isHandset = toSignal(
    this.breakpointObserver
      .observe(Breakpoints.Handset)
      .pipe(map((result) => result.matches)),
    { initialValue: false }
  );

  navigateTHome() {
    this.router.navigate(['/blog']);
    this.closeHiddenMenu();
  }

  startDownloadPdf() {
    const url = 'https://example.com/AgendaPichón.pdf';
    this.downloadPdf.downloadFile().subscribe((blob) => {
      const a = document.createElement('a');
      const objectUrl = URL.createObjectURL(blob);
      a.href = objectUrl;
      a.download = 'Agenda Pichon.pdf';
      a.click();
      URL.revokeObjectURL(objectUrl);
    });
    this.closeHiddenMenu();
  }

  closeHiddenMenu() {
    this.hiddenMenuOn.set(false);
  }

  showHiddenMenu(isOpen: boolean) {
    console.log(isOpen);
    this.hiddenMenuOn.set(isOpen);
  }
}
