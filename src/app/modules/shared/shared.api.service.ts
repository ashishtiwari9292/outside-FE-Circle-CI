import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { SharedService } from './shared.service';

@Injectable({
  providedIn: 'root',
})
export class SharedApiService {
  constructor(private apiService: ApiService, private sharedService: SharedService) {}

  getHeaderProfile() {
    return this.apiService.get('user/header/profile/profile');
  }

  getOwnSidebarProfile() {
    return this.apiService.get('user/sidebar/profile');
  }

  getOthersSidebarProfile(username: string) {
    return this.apiService.get('user/auth/sidebar/profile', {}, username);
  }

  async getUserData() {
    let userData = {
      fullName: null,
      profilePic: null,
      username: null,
      userId: null,
    };
    if (this.sharedService.isLoggedIn()) {
      let res: any = await this.getHeaderProfile().toPromise();
      if (res.body) {
        userData.fullName = res.body.fullName;
        userData.profilePic = res.body.userImage;
        userData.username = res.body.username;
        userData.userId = res.body.userId;
      }
    }
    return userData;
  }

  getOwnUserSettingsProfile() {
    return this.apiService.get('user/profile');
  }

  getOtherUserSettingsProfile(username: string) {
    return this.apiService.get('user/profile', {}, username);
  }

  getS3SignedUrl(body: any): Observable<any> {
    return this.apiService.post('user/signed-url', body);
  }
  uploadToS3(url: string, body: any): Observable<any> {
    return this.apiService.uploadToS3(url, body);
  }

  searchUsersAndPostsWithDetails(
    searchString: string,
    filter: string = 'none',
    pageIndex: number,
    pageSize: number
  ): Observable<any> {
    return this.apiService.get('auth/search-all', {
      search: searchString,
      filter,
      pageIndex,
      pageSize,
    });
  }

  searchUsersAndPosts(
    searchString: string,
    filter: string = 'none',
    pageIndex: number,
    pageSize: number
  ): Observable<any> {
    return this.apiService.get('search', {
      search: searchString,
      filter,
      pageIndex,
      pageSize,
    });
  }

  getNotifications(pageIndex: number, pageSize: number): Observable<any> {
    return this.apiService.get('action/notification', { pageIndex, pageSize });
  }

  deleteNotification(id: string) {
    return this.apiService.delete('action/notification/clear', {}, {}, id);
  }

  deleteAllNotification() {
    return this.apiService.delete('action/notification/clear-all', {});
  }

  markNotificationRead(ids: string[]) {
    return this.apiService.put('action/readed', { ids });
  }
}
