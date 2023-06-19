import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ButtonComponent } from './button/button.component';
import { InputFieldComponent } from './input-field/input-field.component';
import { AutoFocusDirective } from 'src/app/common/directives/auto-focus.directive';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { ImageCardComponent } from './image-card/image-card.component';
import { ProfileWidgetComponent } from './profile-widget/profile-widget.component';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';
import { IsLoggedInDirective } from 'src/app/common/directives/is-logged-in.directive';
import { PostCardComponent } from './post-card/post-card.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { SnackBarService } from 'src/app/common/services/snack-bar.service';
import { LogoComponent } from './logo/logo.component';
import { SkeletonComponent } from './skeleton/skeleton.component';
import { ConfirmPopupComponent } from './confirm-popup/confirm-popup.component';
import { TimeElapsedPipe } from 'src/app/common/pipes/time-elapsed.pipe';
import { SearchBarComponent } from './search-bar/search-bar.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { VjsPlayerComponent } from './vjs-player/vjs-player.component';
import {MatSliderModule} from '@angular/material/slider';
import { CategoryComponent } from './category/category.component';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { SubCategoryComponent } from './sub-category/sub-category.component';

@NgModule({
  declarations: [
    ButtonComponent,
    InputFieldComponent,
    AutoFocusDirective,
    HeaderComponent,
    FooterComponent,
    SearchBarComponent,
    ImageCardComponent,
    ProfileWidgetComponent,
    IsLoggedInDirective,
    PostCardComponent,
    LogoComponent,
    SkeletonComponent,
    ConfirmPopupComponent,
    TimeElapsedPipe,
    ChangePasswordComponent,
    VjsPlayerComponent,
    CategoryComponent,
    SubCategoryComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MatDialogModule,
    MatSnackBarModule,
    MatMenuModule,
    NgxSkeletonLoaderModule,
    MatAutocompleteModule,
    MatSliderModule,
    SlickCarouselModule
  ],
  exports: [
    CommonModule,
    ButtonComponent,
    InputFieldComponent,
    FormsModule,
    AutoFocusDirective,
    ImageCardComponent,
    HeaderComponent,
    FooterComponent,
    SearchBarComponent,
    ProfileWidgetComponent,
    MatDialogModule,
    MatSnackBarModule,
    MatMenuModule,
    IsLoggedInDirective,
    PostCardComponent,
    NgxSkeletonLoaderModule,
    LogoComponent,
    SkeletonComponent,
    TimeElapsedPipe,
    MatAutocompleteModule,
    VjsPlayerComponent,
    CategoryComponent,
    SubCategoryComponent
  ],
  providers: [
    {
      provide: MatDialogRef,
      useValue: {},
    },
    SnackBarService
  ],
})
export class SharedModule {}
