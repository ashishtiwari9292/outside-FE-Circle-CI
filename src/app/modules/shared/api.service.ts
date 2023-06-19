import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { endPoints } from 'src/app/apiEndPoints';
import { environment } from 'src/environments/environment';
import { SharedService } from './shared.service';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  protected isLoggedIn: boolean = false;
  protected endPointString = 'unauth';
  protected env: any = environment;
  protected endpoint: any = endPoints;
  constructor(
    protected http: HttpClient,
    protected sharedService: SharedService
  ) {
    this.isLoggedIn = this.sharedService.isLoggedIn();
    this.sharedService.isLoggedIn$.subscribe((res) => {
      this.isLoggedIn = res;
      this.endPointString = res ? 'auth' : 'unauth';
    });
    this.endPointString = this.isLoggedIn ? 'auth' : 'unauth';
  }

  // public get<T>(
  //   key: string,
  //   queryParams: { [param: string]: any } = {},
  //   pathParams: string = ''
  // ): Observable<T> {
  //   let options = this.getQueryParams(queryParams);
  //   console.log('GET METHOD')
  //   console.log('endPointString-',this.endPointString);
  //   console.log('url-',this.endpoint[this.endPointString][key]);
  //   console.log('params-',this.getPathParams(pathParams));
  //   return this.http.get<T>(
  //     `${this.env.apiUrl}/${
  //       this.endpoint[this.endPointString][key]
  //     }${this.getPathParams(pathParams)}`,
  //     { ...options, ...this.getAccessToken() }
  //   );
  // }

  public get<T>(
    url: string,
    queryParams: { [param: string]: any } = {},
    pathParams: string = ''
  ): Observable<T> {
    let options = this.getQueryParams(queryParams);
    if(!this.isLoggedIn){
      url = url.replace('auth/','');
    }
    return this.http.get<T>(
      `${this.env.apiUrl}/${url}${this.getPathParams(pathParams)}`,
      { ...options, ...this.getAccessToken() }
    );
  }

  // public post<T>(
  //   key: string,
  //   body: any,
  //   queryParams: { [param: string]: any } = {},
  //   pathParams: string = ''
  // ): Observable<T> {
  //   let options = this.getQueryParams(queryParams);
  //   return this.http.post<T>(
  //     `${this.env.apiUrl}/${
  //       this.endpoint[this.endPointString][key]
  //     }${this.getPathParams(pathParams)}`,
  //     body,
  //     { ...options, ...this.getAccessToken() }
  //   );
  // }

  public post<T>(
    url: string,
    body: any,
    queryParams: { [param: string]: any } = {},
    pathParams: string = ''
  ): Observable<T> {
    let options = this.getQueryParams(queryParams);
    if(!this.isLoggedIn){
      url = url.replace('auth/','');
    }
    return this.http.post<T>(
      `${this.env.apiUrl}/${url}${this.getPathParams(pathParams)}`,
      body,
      { ...options, ...this.getAccessToken() }
    );
  }

  // public patch<T>(
  //   key: string,
  //   body: any,
  //   queryParams: { [param: string]: any } = {},
  //   pathParams: string = ''
  // ): Observable<T> {
  //   let options = this.getQueryParams(queryParams);
  //   return this.http.patch<T>(
  //     `${this.env.apiUrl}/${
  //       this.endpoint[this.endPointString][key]
  //     }${this.getPathParams(pathParams)}`,
  //     body,
  //     { ...options, ...this.getAccessToken() }
  //   );
  // }

  public patch<T>(
    url: string,
    body: any,
    queryParams: { [param: string]: any } = {},
    pathParams: string = ''
  ): Observable<T> {
    let options = this.getQueryParams(queryParams);
    if(!this.isLoggedIn){
      url = url.replace('auth/','');
    }
    return this.http.patch<T>(
      `${this.env.apiUrl}/${url}${this.getPathParams(pathParams)}`,
      body,
      { ...options, ...this.getAccessToken() }
    );
  }

  // public put<T>(
  //   key: string,
  //   body: any,
  //   queryParams: { [param: string]: any } = {},
  //   pathParams: string = ''
  // ): Observable<T> {
  //   let options = this.getQueryParams(queryParams);
  //   return this.http.put<T>(
  //     `${this.env.apiUrl}/${
  //       this.endpoint[this.endPointString][key]
  //     }${this.getPathParams(pathParams)}`,
  //     body,
  //     { ...options, ...this.getAccessToken() }
  //   );
  // }

  public put<T>(
    url: string,
    body: any,
    queryParams: { [param: string]: any } = {},
    pathParams: string = ''
  ): Observable<T> {
    let options = this.getQueryParams(queryParams);
    if(!this.isLoggedIn){
      url = url.replace('auth/','');
    }
    return this.http.put<T>(
      `${this.env.apiUrl}/${url}${this.getPathParams(pathParams)}`,
      body,
      { ...options, ...this.getAccessToken() }
    );
  }

  // public delete<T>(
  //   key: string,
  //   body: any,
  //   queryParams: { [param: string]: any } = {},
  //   pathParams: string = ''
  // ): Observable<T> {
  //   let options = this.getQueryParams(queryParams);
  //   return this.http.delete<T>(
  //     `${this.env.apiUrl}/${
  //       this.endpoint[this.endPointString][key]
  //     }${this.getPathParams(pathParams)}`,
  //     { ...options, ...this.getAccessToken(), body }
  //   );
  // }

  public delete<T>(
    url: string,
    body: any,
    queryParams: { [param: string]: any } = {},
    pathParams: string = ''
  ): Observable<T> {
    let options = this.getQueryParams(queryParams);
    if(!this.isLoggedIn){
      url = url.replace('auth/','');
    }
    return this.http.delete<T>(
      `${this.env.apiUrl}/${url}${this.getPathParams(pathParams)}`,
      { ...options, ...this.getAccessToken(), body }
    );
  }

  uploadToS3<T>(url: string, body: any): Observable<T> {
    return this.http.put<T>(url, body);
  }

  getPathParams(pathParams: string) {
    if (pathParams === '') return '';
    return `/${pathParams}`;
  }

  getAccessToken(): { headers?: HttpHeaders } {
    let userData = JSON.parse(localStorage.getItem('userData') || '{}');
    let username = userData?.userName || userData?.username || null;
    if (username) {
      const keyName = `CognitoIdentityServiceProvider.${environment.cognitoAppClientId}.${username}.accessToken`;
      const token = localStorage.getItem(keyName);
      return token
        ? { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) }
        : {};
    }
    return {};
  }

  getQueryParams(queryParams: { [param: string]: any }) {
    return {
      params: new HttpParams({
        fromObject: queryParams,
      }),
    };
  }
}
