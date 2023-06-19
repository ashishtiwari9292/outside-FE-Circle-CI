import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostComponent } from './post.component';
import { SharedModule } from '../shared/shared.module';
import { AddPostModalComponent } from './add-post-modal/add-post-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SnackBarService } from 'src/app/common/services/snack-bar.service';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgxMasonryModule } from 'ngx-masonry';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@NgModule({
  declarations: [PostComponent, AddPostModalComponent],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    InfiniteScrollModule,
    NgxMasonryModule,
    SlickCarouselModule,
    MatProgressSpinnerModule
  ],
  exports: [PostComponent, AddPostModalComponent],
  providers: [SnackBarService],
})
export class PostModule {}
