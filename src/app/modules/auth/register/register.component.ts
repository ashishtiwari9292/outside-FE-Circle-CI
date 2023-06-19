import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserPool,
} from 'amazon-cognito-identity-js';

import { FormOperationService } from 'src/app/common/services/form-operation.service';
import { SnackBarService } from 'src/app/common/services/snack-bar.service';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';
import { User } from '../../user/models/user';
import { MatDialogRef } from '@angular/material/dialog';
import { SharedService } from '../../shared/shared.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  @Output() linkClick: EventEmitter<any> = new EventEmitter();
  action: string = 'register';
  registerForm: FormGroup;
  serverError: string;
  userEmail: string;
  username: string;
  userId: string;
  otp: string;
  userAttributes: any = {};
  cognitoUser: any = {};
  isLoading = false;
  isUnique = true;
  //Change detection strat to onpush
  isResetLoading = { load: false };
  constructor(
    private authService: AuthService,
    private sharedService: SharedService,
    private formOperationService: FormOperationService,
    private router: Router,
    private snackBarService: SnackBarService,
    private dialogRef: MatDialogRef<RegisterComponent>
  ) {}

  ngOnInit(): void {
    this.authService.setPageData({
      title: 'Signup',
      icon: 'assets/images/signup-user.svg',
    });
    this.registerForm = new FormGroup({
      username: new FormControl('', [
        Validators.required,
        Validators.pattern('^[a-z0-9._-]{2,20}$'),
      ]),
      fullName: new FormControl('', [Validators.required,Validators.pattern(/[\S]/)]),
      email: new FormControl('', [Validators.required, Validators.pattern('^[a-z0-9-.]+@[a-z]+[.][a-z]+$')]),
    });
  }

  public handleErrors(form: FormGroup, key: string, type: string): boolean {
    return this.formOperationService.handleErrors(key, type, form, false);
  }

  public getErrorMessage(key: string): string {
    return this.formOperationService.getErrorMessage(key);
  }

  onKeyUp(event: string) {
    if (event && event.trim() !== '') {
      this.debounce(this.checkIfUniqueUsername, this, 500)(event);
    }
  }
  debounce = (func: any, self: any, timeout = 300) => {
    return (...args: any[]) => {
      clearTimeout(self.timer);
      self.timer = setTimeout(() => {
        func.apply(this, args);
      }, timeout);
    };
  };
  checkIfUniqueUsername(username: string) {
    this.authService.checkUniqueUsername(username).subscribe(
      (res: any) => {
        if (res.body) {
          this.isUnique = res.body.isUnique;
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }
  registerFormSubmit() {
    if(!this.isUnique){
      return;
    }
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      this.registerForm.get('email')?.markAsDirty();
      this.registerForm.get('username')?.markAsDirty();
      this.registerForm.get('fullName')?.markAsDirty();
      return;
    }
    this.isLoading = true;
    this.userEmail = this.registerForm.value.email;
    this.username = this.registerForm.value.username;
    const registerFormValue = this.registerForm.value;
    const newUser: User = {
      ...registerFormValue,
    };
    this.authService.create(newUser).subscribe(
      (response: any) => {
        if (
          response.message &&
          response.message.indexOf('email already exists') > -1
        ) {
          this.serverError = 'Email Already Registered';
          this.snackBarService.openSnackBar(this.serverError,'error');
          this.isLoading = false;
          return;
        }
        if (
          response.message &&
          response.message.indexOf('User account already exists') > -1
        ) {
          this.serverError = 'Username Already Registered';
          this.snackBarService.openSnackBar(this.serverError,'error');
          this.isLoading = false;
          return;
        }
        this.userId = response.body.id;
        this.isLoading = false;
        this.action = 'resetpassword';
      },
      (err: HttpErrorResponse) => {
        this.isLoading = false;
        if (typeof err.error === 'string') {
          this.serverError = err.error;
        } else {
          switch (err.status) {
            case 400:
              this.serverError = 'Invalid Values';
              break;
            case 409:
              this.serverError = err.error.message;
              break;
            default:
              this.serverError = 'Something went wrong';
          }
        }
        this.snackBarService.openSnackBar(this.serverError,'error');
      }
    );
  }

  onNewPassword(data: any) {
    if (data.newPassword && data.otp) {
      //Username because email can't be used for the first time(Not verified/confirmed)
      let authenticationDetails = new AuthenticationDetails({
        Username: this.username,
        Password: data.otp,
      });
      let poolData = {
        UserPoolId: environment.cognitoUserPoolId,
        ClientId: environment.cognitoAppClientId,
      };
      let userPool = new CognitoUserPool(poolData);
      let userData = {
        Username: this.username,
        Pool: userPool,
      };
      let cognitoUser = new CognitoUser(userData);
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: (result: any) => {
          console.log('Logged In Successfully but on register page?');
          this.isResetLoading = { load: false };
        },
        onFailure: (err) => {
          this.snackBarService.openSnackBar(err.message,'error');
          this.isResetLoading = { load: false };
        },
        newPasswordRequired: (userAttributes, requiredAttributes) => {
          delete userAttributes.email_verified;
          delete userAttributes.email;
          cognitoUser.completeNewPasswordChallenge(
            data.newPassword,
            userAttributes,
            {
              onSuccess: (result: any) => {
                this.initLogin(result);
              },
              onFailure: (err) => {
                this.snackBarService.openSnackBar(err.message,'error');
                this.isResetLoading = { load: false };
              },
            }
          );
        },
      });
    }
  }
  onLoginClick() {
    this.linkClick.emit('login');
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
    localStorage.setItem('userData', JSON.stringify(userInfo));
    this.sharedService.isLoggedIn$.next(true);
    this.sharedService.updateHeader$.next(true);
    this.isResetLoading = { load: false };
    this.dialogRef.close();
    this.router.navigate(['']);
  }

  // backToRegister(){
  //   this.authService.deleteUser(this.username,this.userId).subscribe((res)=>{
  //     this.action = 'register';
  //     console.log(res);
  //   },(err)=>{
  //     console.log(err);
  //   })
    
  // }
}
