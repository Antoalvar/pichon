import { Routes } from '@angular/router';
import { HomeComponent } from './components/home-component/home.component';
import { BlogComponent } from './components/blog-component/blog.component';

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
  {
    path: 'blog',
    component: BlogComponent,
  },
];
