import { Routes } from '@angular/router';
import { HomeComponent } from './components/home-component/home.component';
import { BlogComponent } from './components/blog-component/blog.component';
import { PostComponent } from './components/blog-component/components/post/post.component';
import { AboutComponent } from './components/about/about.component';

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
  {
    path: 'about',
    component: AboutComponent,
  },
  { path: 'post/:id', component: PostComponent },
];
