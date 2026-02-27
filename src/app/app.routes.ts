import { Routes } from '@angular/router';
import { BlogComponent } from './components/blog-component/blog.component';
import { PostComponent } from './components/blog-component/components/post/post.component';
import { AboutComponent } from './components/about/about.component';
import { SubscriptionFormComponent } from './components/subscription-form/subscription-form.component';
import { postDetailResolver } from './services/post-detail.resolver';

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
  {
    path: 'post/:id/:slug',
    component: PostComponent,
    resolve: { post: postDetailResolver },
  },
  {
    path: 'BackOffice',
    loadComponent: () =>
      import('./components/back-office/back-office.component').then(
        (m) => m.BackOfficeComponent
      ),
  },
];
