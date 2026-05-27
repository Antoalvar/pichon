import { Routes } from '@angular/router';
import { BlogComponent } from './components/blog-component/blog.component';
import { PostComponent } from './components/blog-component/components/post/post.component';
import { AboutComponent } from './components/about/about.component';
import { UnsubscribeComponent } from './components/unsubscribe/unsubscribe.component';
import { postDetailResolver } from './services/post-detail.resolver';
import { GuiasComponent } from './components/guias/guias.component';
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';
import { CookiePolicyComponent } from './components/cookie-policy/cookie-policy.component';

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
    path: 'unsubscribe',
    component: UnsubscribeComponent,
  },
  {
    path: 'about',
    component: AboutComponent,
  },
  {
    path: 'guias',
    component: GuiasComponent,
  },
  {
    path: 'post/:id/:slug',
    component: PostComponent,
    resolve: { post: postDetailResolver },
  },
  {
    path: 'politica-de-privacidad',
    component: PrivacyPolicyComponent,
  },
  {
    path: 'politica-de-cookies',
    component: CookiePolicyComponent,
  },
  {
    path: 'BackOffice',
    loadComponent: () =>
      import('./components/back-office/back-office.component').then(
        (m) => m.BackOfficeComponent
      ),
  },
];
