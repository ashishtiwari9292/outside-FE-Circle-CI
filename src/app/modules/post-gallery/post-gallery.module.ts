import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostGalleryComponent } from './post-gallery.component';
import { SharedModule } from '../shared/shared.module';
import { NgxMasonryModule } from 'ngx-masonry';
import { RouterModule, Routes } from '@angular/router';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { SnackBarService } from 'src/app/common/services/snack-bar.service';
import { PostModule } from '../post/post.module';
import { SearchBannerComponent } from './search-banner/search-banner.component';

const routes: Routes = [
  {
    path: '',
    component: PostGalleryComponent,
  },
];

@NgModule({
  declarations: [PostGalleryComponent, SearchBannerComponent],
  imports: [
    CommonModule,
    SharedModule,
    NgxMasonryModule,
    RouterModule.forChild(routes),
    InfiniteScrollModule,
    NgxSkeletonLoaderModule.forRoot({ animation: 'pulse'}),
    PostModule,
  ],
  providers:[SnackBarService]
})
export class PostGalleryModule { }
