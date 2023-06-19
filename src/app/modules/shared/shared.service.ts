import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CognitoUserPool } from 'amazon-cognito-identity-js';
import { BehaviorSubject, Subject } from 'rxjs';
import { SnackBarService } from 'src/app/common/services/snack-bar.service';
import { environment as env } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  updateHeader$ = new BehaviorSubject(false);
  updateSidebar$ = new BehaviorSubject(false);
  userData$: any = new BehaviorSubject({});
  coverImage$: any = new BehaviorSubject('');
  isLoggedIn$ = new Subject<boolean>();
  getTimeline$ = new BehaviorSubject(false);
  searchString$ = new Subject();
  postListChange$ = new Subject();
  constructor(
    private router: Router,
    private snackBarService: SnackBarService
  ) {}

  getLatestProfileImage() {
    return this.userData$.value.profilePic;
  }

  getUserName() {
    let userData = JSON.parse(localStorage.getItem('userData') || '{}');
    if (userData && userData.userName) {
      return userData.userName;
    }
    if (userData && userData.username) {
      return userData.username;
    }
    return '';
  }

  getUserId() {
    let userData = JSON.parse(localStorage.getItem('userData') || '{}');
    if (userData && userData.userId) {
      return userData.userId;
    }
    return '';
  }

  checkAndUpdateLoggedIn() {
    this.isLoggedIn$.next(this.isLoggedIn());
  }

  isLoggedIn(): boolean {
    var isAuth = false;

    let poolData = {
      UserPoolId: env.cognitoUserPoolId,
      ClientId: env.cognitoAppClientId,
    };

    var userPool = new CognitoUserPool(poolData);
    var cognitoUser = userPool.getCurrentUser();

    if (cognitoUser != null) {
      cognitoUser.getSession((err: any, session: any) => {
        if (err) {
          console.log('Something went wrong', err);
        }
        isAuth = session.isValid();
      });
    }
    return isAuth;
  }

  extractUsername() {
    let fragments = this.router.url.split('/');
    if (fragments.length >= 3) {
      if (
        ['profile', 'wishlist', 'followers', 'posts'].includes(
          fragments[2].toLowerCase()
        )
      ) {
        return fragments[3];
      } else {
        return fragments[2];
      }
    }
    return '';
  }

  showSnackError(err: any) {
    if (
      err.status != null &&
      err.status != undefined &&
      (err.status == 0 || err.status == 500)
    ) {
      this.snackBarService.openSnackBar('Something Went Wrong!', 'error');
    }
  }
}
