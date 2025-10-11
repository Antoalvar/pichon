import { Routes } from '@angular/router';
import { HomeComponent } from './components/home-component/home-component.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: HomeComponent,
  },
];
