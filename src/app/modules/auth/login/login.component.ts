import { Component, EventEmitter, OnInit, Output, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserPool,
} from 'amazon-cognito-identity-js';
import { environment } from 'src/environments/environment';
import { FormOperationService } from 'src/app/common/services/form-operation.service';
import { AuthService } from '../auth.service';
import { SnackBarService } from 'src/app/common/services/snack-bar.service';
// import { MatDialogRef } from '@angular/material/dialog';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SharedService } from '../../shared/shared.service';
import { SocketService } from 'src/app/common/services/socket.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  @Output() linkClick: EventEmitter<any> = new EventEmitter();
  slideNumber: number = 1;
  action: string = 'login';
  emailForm: FormGroup;
  loginForm: FormGroup;
  userEmail: string;
  cognitoUser: any = {};
  userAttributes: any = {};
  isNewUser: boolean = false;
  isPasswordVisible: boolean = false;
  isLoading: boolean = false;
  isResetLoading = { load: false };
  formSubmitted: boolean = false;
  constructor(
    private router: Router,
    private  socketService: SocketService,
    private snackBarService: SnackBarService,
    private formOperationService: FormOperationService,
    private authService: AuthService,
    private sharedService: SharedService,
    private dialogRef: MatDialogRef<LoginComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  /**
   * For sign out:
   * - Clear localstorage
   * - cognitoUser.globalSignOut(callback) call this to INVALIDATE issued tokens
   */
  ngOnInit(): void {
    this.authService.setPageData({
      title: 'Login',
      icon: 'assets/images/login-user.svg',
    });
    this.loginForm = new FormGroup({
      password: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      rememberMe: new FormControl(false),
    });
  }

  public handleErrors(form: FormGroup, key: string, type: string): boolean {
    let result = this.formOperationService.handleErrors(key, type, form, false);
    if (!this.formSubmitted && result) {
      return false;
    }
    return result;
  }

  public getErrorMessage(key: string): string {
    return this.formOperationService.getErrorMessage(key);
  }

  submitLogin() {
    this.formSubmitted = true;
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.loginForm.get('email')?.markAsDirty();
      this.loginForm.get('password')?.markAsDirty();
      return;
    }
    this.isLoading = true;
    let authenticationDetails = new AuthenticationDetails({
      Username: this.loginForm.value.email,
      Password: this.loginForm.value.password,
    });
    let poolData = {
      UserPoolId: environment.cognitoUserPoolId,
      ClientId: environment.cognitoAppClientId,
    };
    let userPool = new CognitoUserPool(poolData);
    let userData = { Username: this.loginForm.value.email, Pool: userPool };
    var cognitoUser = new CognitoUser(userData);
    this.cognitoUser = cognitoUser;
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (result: any) => {
        // if (this.loginForm.value.rememberMe) {
        this.initLogin(result);
        // }
        /* Session expiry for later */
        // this.getAndPutLoginInfo(userInfo);
        // var currentDate = moment().unix()
        // if(userInfo.exp > currentDate){
        //   this.router.navigateByUrl("");
        // }
      },
      onFailure: (err) => {
        this.snackBarService.openSnackBar(err.message, 'error');
        this.isLoading = false;
      },
      newPasswordRequired: (userAttributes, requiredAttributes) => {
        delete userAttributes.email_verified;
        delete userAttributes.email;
        this.userAttributes = userAttributes;
        this.action = 'resetpassword';
        this.isLoading = false;
      },
    });
  }

  changePassword(data: any) {
    this.cognitoUser.completeNewPasswordChallenge(
      data.newPassword,
      this.userAttributes,
      {
        onSuccess: (result: any) => {
          this.isResetLoading = { load: false };
          this.initLogin(result);
          this.router.navigate(['']);
        },
        onFailure: (err: any) => {
          this.isResetLoading = { load: false };
          this.snackBarService.openSnackBar(err.message, 'error');
        },
      }
    );
  }
  onForgotPasswordClick() {
    this.linkClick.emit('forgot');
  }
  onRegisterClick() {
    this.linkClick.emit('register');
  }
  initLogin(result: any) {
    const { payload, jwtToken } = result.idToken;
    const { token } = result.refreshToken;
    let userInfo = {
      email: payload.email,
      sub: payload.sub,
      userName: payload['cognito:username'],
      exp: payload.exp,
      token: jwtToken,
      refreshToken: token,
    };
    this.socketService.emitEvent('loginRoom', {username:payload['cognito:username']});
    localStorage.setItem('userData', JSON.stringify(userInfo));
    this.sharedService.isLoggedIn$.next(true);
    this.sharedService.updateHeader$.next(true);
    this.isLoading = false;
    this.dialogRef.close('DONE');
  }
}
