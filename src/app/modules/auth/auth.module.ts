import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LoginComponent } from './login/login.component';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { AuthCarouselComponent } from './auth-carousel/auth-carousel.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthPopupComponent } from './auth-popup/auth-popup.component';

const Components = [
  LoginComponent,
  AuthCarouselComponent,
  RegisterComponent,
  ResetPasswordComponent,
  ForgotPasswordComponent,
];

@NgModule({
  declarations: [Components, AuthPopupComponent],
  imports: [
    SlickCarouselModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule,
    MatSnackBarModule,
  ],
  exports: [Components],
  providers: [],
})
export class AuthModule {}
