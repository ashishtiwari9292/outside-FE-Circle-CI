import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment as env } from 'src/environments/environment';
import { ApiService } from '../shared/api.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private apiService: ApiService) {}

  getUserProfileByUsername<T>(username: string): Observable<T> {
    return this.apiService.get('user/profile', {}, username);
  }

  getSavedPosts<T>(pageIndex: number, pageSize: number): Observable<T> {
    return this.apiService.get('post/save', { pageIndex, pageSize });
  }

  followUser<T>(userId: any): Observable<T> {
    return this.apiService.post('follow', { userId });
  }

  unFollowUser<T>(userId: any): Observable<T> {
    return this.apiService.delete('follow/unfollow', {}, {},userId);
  }

  getFollowersList<T>(
    username: string,
    pageIndex: number,
    pageSize: number
  ): Observable<T> {
    return this.apiService.get(
      'follow/followers',
      { pageIndex, pageSize },
      username
    );
  }

  getFollowingList<T>(
    username: string,
    pageIndex: number,
    pageSize: number
  ): Observable<T> {
    return this.apiService.get(
      'follow/following',
      { pageIndex, pageSize },
      username
    );
  }

  getPostsList<T>(pageIndex: number, pageSize: number): Observable<T> {
    return this.apiService.get('post/my-post', { pageIndex, pageSize });
  }

  getTimeline<T>(pageIndex: number, pageSize: number): Observable<T> {
    return this.apiService.get('post/timeline', { pageIndex, pageSize });
  }

  searchFollowedUsers<T>(
    username: string,
    searchString: string,
    pageIndex: number,
    pageSize: number
  ): Observable<T> {
    return this.apiService.get(
      'follow/followers',
      { pageIndex, pageSize, search: searchString },
      username
    );
  }

  searchFollowingUsers<T>(
    username: string,
    searchString: string,
    pageIndex: number,
    pageSize: number
  ): Observable<T> {
    return this.apiService.get(
      'follow/following',
      { pageIndex, pageSize, search: searchString },
      username
    );
  }

  getPostListByUsername<T>(
    userId: string,
    pageIndex: number,
    pageSize: number
  ): Observable<T> {
    return this.apiService.get('post/auth/posts', { pageIndex, pageSize }, userId);
  }

  updateUserProfile<T>(body: any): Observable<T> {
    return this.apiService.put('user/update', body);
  }

  removePhoto<T>(photoType: string): Observable<T> {
    return this.apiService.put('user/unset/image', { photoType });
  }

  getSuggestedUsers<T>(pageIndex: number, pageSize: number): Observable<T> {
    return this.apiService.get('suggested-users', { pageIndex, pageSize });
  }

  getUserPhotos<T>(type: string): Observable<T> {
    return this.apiService.get('user/all/images', {}, type);
  }

  deleteUserPhoto<T>(id: string): Observable<T> {
    return this.apiService.delete('user/remove/image', {}, {}, id);
  }

  setProfilePhoto<T>(body: any): Observable<T> {
    return this.apiService.put('user/set-current', body);
  }
}
