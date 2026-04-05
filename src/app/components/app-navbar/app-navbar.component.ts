import { Component, inject, output, signal } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { map } from 'rxjs/operators';
import { Router, RouterLink } from '@angular/router';
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
  private readonly breakpointObserver = inject(BreakpointObserver);

  readonly hiddenMenuOn = signal<boolean>(false);
  readonly agendaOpen = output<void>();

  readonly isHandset = toSignal(
    this.breakpointObserver
      .observe(Breakpoints.Handset)
      .pipe(map((result) => result.matches)),
    { initialValue: false }
  );

  navigateTHome(): void {
    this.router.navigate(['/blog']);
    this.closeHiddenMenu();
  }

  openAgendaModal(): void {
    this.agendaOpen.emit();
    this.closeHiddenMenu();
  }

  closeHiddenMenu(): void {
    this.hiddenMenuOn.set(false);
  }

  showHiddenMenu(isOpen: boolean): void {
    this.hiddenMenuOn.set(isOpen);
  }
}
