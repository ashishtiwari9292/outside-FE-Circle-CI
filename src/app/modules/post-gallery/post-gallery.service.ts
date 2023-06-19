import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../shared/api.service';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(private apiService: ApiService) {}

  getPosts<T>(pageIndex: number, pageSize: number, category: string | null): Observable<T> {
    return this.apiService.get<T>('post/auth/home-post', Object.assign({ pageIndex, pageSize }, category ? { category } : {} ));
  }

  getPostsOfFollowingForAuth<T>(
    pageIndex: number,
    pageSize: number,
    category: string | null
  ): Observable<T> {
    return this.apiService.get<T>('post/auth/home-post/following', Object.assign({
      pageIndex,
      pageSize,
    }, category ? { category } : {}));
  }
}
