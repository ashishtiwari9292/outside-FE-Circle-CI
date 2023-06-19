import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { SharedModule } from '../shared/shared.module';
import { UserService } from './user.service';
import { SidebarComponent } from './sidebar/sidebar.component';
import { UserWishlistComponent } from './user-wishlist/user-wishlist.component';
import { UserFollowersComponent } from './user-followers/user-followers.component';
import { UserHomeComponent } from './user-home/user-home.component';
import { UserWrapperComponent } from './user-wrapper/user-wrapper.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { MatTabsModule } from '@angular/material/tabs';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { SnackBarService } from 'src/app/common/services/snack-bar.service';
import { UserPostsComponent } from './user-posts/user-posts.component';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { UpdateImagePopupComponent } from './update-image-popup/update-image-popup.component';
import { ReactiveFormsModule } from '@angular/forms';
import {MatMenuModule} from '@angular/material/menu';
import {MatSelectModule} from '@angular/material/select';
import { AuthGuard } from '../auth/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: UserWrapperComponent,
    children: [
      {
        path: ':username',
        component: UserHomeComponent,
      },
      {
        path: 'posts/:username',
        canActivate: [AuthGuard],
        component: UserPostsComponent,
      },
      {
        path: 'profile/:username',
        component: UserProfileComponent,
      },
      {
        path: 'wishlist/:username',
        canActivate: [AuthGuard],
        component: UserWishlistComponent,
      },
      {
        path: 'followers/:username',
        component: UserFollowersComponent,
      },
      {
        path: '',
        redirectTo: '404component',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  declarations: [
    UserProfileComponent,
    SidebarComponent,
    UserWishlistComponent,
    UserFollowersComponent,
    UserHomeComponent,
    UserWrapperComponent,
    UserPostsComponent,
    UpdateImagePopupComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    NgxSkeletonLoaderModule,
    MatTabsModule,
    InfiniteScrollModule,
    SlickCarouselModule,
    ReactiveFormsModule,
    MatMenuModule,
    MatSelectModule
  ],
  exports: [NgxSkeletonLoaderModule, MatTabsModule],
  providers: [UserService, SnackBarService],
})
export class UserModule {}
