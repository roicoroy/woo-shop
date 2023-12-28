import { Routes } from '@angular/router';
import { PostResolver } from './blog/post/post.resolver';
import { PostsResolver } from './blog/posts/posts.resolver';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'posts',
    loadComponent: () => import('./blog/posts/posts.page').then(m => m.PostsPage),
    resolve: {
      data: PostsResolver
    },
    runGuardsAndResolvers: 'paramsOrQueryParamsChange'
  },
  {
    path: 'post/:id',
    loadComponent: () => import('./blog/post/post.page').then(m => m.PostPage),
    resolve: {
      data: PostResolver
    }
  },
  {
    path: 'shop',
    loadComponent: () =>
      import('./shop/product-list/product-list.page').then(m => m.ProductListPage)
  },
  {
    path: 'product-details/:id',
    loadComponent: () =>
      import('./shop/product-details/product-details.page').then(m => m.ProductDetailsPage)
  },
  // {
  //   path: 'posts',
  //   loadComponent: () => import('./blog/posts/posts.page').then( m => m.PostsPage)
  // },
];
