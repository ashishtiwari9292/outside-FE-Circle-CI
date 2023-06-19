import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostComponent } from './post.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { AddPostModalComponent } from './add-post-modal/add-post-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SnackBarService } from 'src/app/common/services/snack-bar.service';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgxMasonryModule } from 'ngx-masonry';
import { SlickCarouselModule } from 'ngx-slick-carousel';

const routes: Routes = [
  {
    path: '',
    component: AddPostModalComponent,
  },
  {
    path: ':id',
    component: PostComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class PostRoutingModule {}
