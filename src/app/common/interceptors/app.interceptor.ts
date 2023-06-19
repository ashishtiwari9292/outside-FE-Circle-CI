import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';

import { from, Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'src/environments/environment';
import { tap } from 'rxjs/operators';
import { SharedService } from 'src/app/modules/shared/shared.service';

@Injectable({ providedIn: 'root' })
export class AppInterceptor implements HttpInterceptor {
  userIpReqSent = false;
  apiCount = 0;
  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    private sharedService: SharedService
  ) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return from(this.handle(req, next));
  }

  async handle(req: HttpRequest<any>, next: HttpHandler) {
    // if (req?.url.indexOf('ipify') == -1) {
    //   req = req.clone({
    //     withCredentials: true,
    //   });
    // }
    /** If user not logged in send cookies with ip and user agent */
    if(req.url.indexOf('X-Amz-SignedHeaders=') > -1){
      return next.handle(req).toPromise();
    }
    // if (localStorage.getItem('userData') === null) {
      //   if (this.cookieService.get('userAgent') === '') {
      //     const userAgent = window.navigator.userAgent;
      //     this.cookieService.set('userAgent', userAgent);
      //   }
      //   if (this.cookieService.get('userIP') === '' && !this.userIpReqSent) {
      //     await this.getIPAddress();
      //   }
    // } else {
      /** Otherwise send access token */
      // const token = this.getAccessToken();
      // const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      // req = req.clone({ headers: headers });
    // }
    return next
      .handle(req)
      .pipe(
        tap(
          () => {},
          (error: HttpEvent<any>) => {
            if (error instanceof HttpErrorResponse) {
              if (error.status == 429 && this.apiCount >= 5) {
                console.log('Too many requests');
              }
              if (error.status == 401 && this.apiCount < 5) {
                this.sharedService.checkAndUpdateLoggedIn();
                this.apiCount++;
                if(!this.sharedService.isLoggedIn()){
                  this.apiCount = 6;
                  localStorage.clear();
                  setTimeout(() => {
                    localStorage.clear();
                  }, 3000);
                }
              }
              if(this.apiCount >= 5){
                localStorage.clear();
                this.sharedService.checkAndUpdateLoggedIn();
                this.apiCount++;
              }
            }
          }
        )
      )
      .toPromise();
  }
  async getIPAddress() {
    return new Promise(async (resolve, reject) => {
      try {
        if (this.cookieService.get('userIP') === '' && !this.userIpReqSent) {
          this.userIpReqSent = true;
          let res: any = await this.http
            .get('https://api.ipify.org?format=json')
            .toPromise();
          this.userIpReqSent = false;
          if (res?.ip) {
            this.cookieService.set('userIP', res.ip);
            resolve('success');
          }
          resolve('failed');
        } else {
          resolve('wait');
        }
      } catch (error) {
        this.userIpReqSent = false;
        console.log('ERRON IN GETTING IP-------->', error);
      }
    });
  }
  getAccessToken() {
    let userData = JSON.parse(localStorage.getItem('userData') || '{}');
    let username = userData?.userName || userData?.username || null;
    if (username) {
      const keyName = `CognitoIdentityServiceProvider.${environment.cognitoAppClientId}.${username}.accessToken`;
      return localStorage.getItem(keyName);
    }
    return '';
  }
}
