import { Injectable } from '@angular/core';
import { CognitoUserPool, UserData } from 'amazon-cognito-identity-js';
import { environment as env } from 'src/environments/environment';
import { User } from '../user/models/user';
import { Observable, Subject } from 'rxjs';
import { PageData } from './models/pageData';
import { ApiService } from '../shared/api.service';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  title: any = new Subject();

  constructor(private apiService: ApiService) {}

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

  setPageData(data: PageData) {
    this.title.next(data);
  }

  create<T>(userData: User): Observable<T> {
    return this.apiService.post<T>('user/create', userData);
  }

  deleteUser<T>(username: string, userId: string): Observable<T> {
    return this.apiService.delete<any>('user/delete', {}, { username, userId });
  }

  checkUniqueUsername<T>(username: string): Observable<T> {
    return this.apiService.get('user/isUniqueUsername', {}, username);
  }
}
