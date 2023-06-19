import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './common/components/not-found/not-found.component';
import { MainGuard } from './common/guards/main.guard';
import { AuthService } from './modules/auth/auth.service';

const routes: Routes = [
  {
    path: '',
    // canActivate: [MainGuard],
    loadChildren: () =>
      import('./modules/home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'categories',
    canActivate: [MainGuard],
    loadChildren: () =>
      import('./modules/post-gallery/post-gallery.module').then(
        (m) => m.PostGalleryModule
      ),
  },
  {
    path: 'verification',
    loadChildren: () =>
      import('./modules/launch/launch.module').then((m) => m.LaunchModule),
  },
  {
    path: 'product',
    canActivate: [MainGuard],
    loadChildren: () =>
      import('./modules/product/product.module').then((m) => m.ProductModule),
  },
  {
    path: 'user',
    canActivate: [MainGuard],
    loadChildren: () =>
      import('./modules/user/user.module').then((m) => m.UserModule),
  },
  {
    path: 'post',
    canActivate: [MainGuard],
    loadChildren: () =>
      import('./modules/post/post-routing.module').then((m) => m.PostRoutingModule),
  },
  {
    path: 'search',
    canActivate: [MainGuard],
    loadChildren: () =>
      import('./modules/search/search.module').then((m) => m.SearchModule),
  },
  { path: '404', component: NotFoundComponent },
  { path: '**', redirectTo: '/404' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      // scrollPositionRestoration: 'enabled',
    }),
  ],
  exports: [RouterModule],
  providers: [AuthService],
})
export class AppRoutingModule {}
