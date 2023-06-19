import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CognitoUser, CognitoUserPool } from 'amazon-cognito-identity-js';
import { FormOperationService } from 'src/app/common/services/form-operation.service';
import { SnackBarService } from 'src/app/common/services/snack-bar.service';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
  @Output() linkClick: EventEmitter<any> = new EventEmitter();
  forgotPasswordForm: FormGroup;
  otp: string;
  action: string = 'forgotpassword';
  cognitoUser: CognitoUser;
  userEmail: string;
  submitted: boolean = false;
  isResetLoading = { load: false };
  isLoading: boolean = false;
  constructor(
    private router: Router,
    private formOperationService: FormOperationService,
    private authService: AuthService,
    private snackBarService: SnackBarService
  ) {
    this.forgotPasswordForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
    });
  }

  ngOnInit(): void {
    this.authService.setPageData({
      title: 'Reset password',
      icon: 'assets/images/reset-user.svg',
    });
  }

  forgotPasswordFormSubmit() {
    this.forgotPasswordForm.get('email')?.markAsDirty();
    if (this.forgotPasswordForm.valid) {
      this.isLoading = true;
      this.userEmail = this.forgotPasswordForm.value.email;
      let poolData = {
        UserPoolId: environment.cognitoUserPoolId,
        ClientId: environment.cognitoAppClientId,
      };
      let userPool = new CognitoUserPool(poolData);
      let userData = {
        Username: this.forgotPasswordForm.value.email,
        Pool: userPool,
      };
      let cognitoUser = new CognitoUser(userData);
      this.cognitoUser = cognitoUser;
      cognitoUser.forgotPassword({
        onSuccess: (result: any) => {
          this.isLoading = false;
          this.action = 'resetpassword';
        },
        onFailure: (err: any) => {
          this.isLoading = false;
          if(err.message.indexOf('not found') != -1){
            err.message = 'Account does not exist!';
          }
          if(err.message.indexOf('User password cannot be reset in the current state') != -1){
            err.message = 'Please login with the temporary password sent to your email';
          }
          this.snackBarService.openSnackBar(err.message,'error');
        },
      });
    }
  }
  onNewPassword(data: any) {
    this.cognitoUser.confirmPassword(data.otp, data.newPassword, {
      onSuccess: (result: any) => {
        this.isResetLoading = { load: false };
        this.snackBarService.openSnackBar('Password Reset Successfully');
        this.linkClick.emit('login');
      },
      onFailure: (err: any) => {
        this.isResetLoading = { load: false };
        this.snackBarService.openSnackBar(err.message,'error');
      },
    });
  }
  public handleErrors(form: FormGroup, key: string, type: string): boolean {
    return this.formOperationService.handleErrors(key, type, form, false);
  }

  public getErrorMessage(key: string): string {
    return this.formOperationService.getErrorMessage(key);
  }
  onLoginClick() {
    this.linkClick.emit('login');
  }
}
