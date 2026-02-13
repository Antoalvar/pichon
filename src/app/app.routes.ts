import { Routes } from '@angular/router';
import { BlogComponent } from './components/blog-component/blog.component';
import { PostComponent } from './components/blog-component/components/post/post.component';
import { AboutComponent } from './components/about/about.component';
import { SubscriptionFormComponent } from './components/subscription-form/subscription-form.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/blog',
    pathMatch: 'full',
  },
  {
    path: 'blog',
    component: BlogComponent,
  },
  {
    path: 'subscribe',
    component: SubscriptionFormComponent,
  },
  {
    path: 'about',
    component: AboutComponent,
  },
  { path: 'post/:id', component: PostComponent },
];
