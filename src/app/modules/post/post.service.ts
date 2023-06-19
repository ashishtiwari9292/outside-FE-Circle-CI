import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../shared/api.service';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  constructor(private apiService: ApiService) {}

  getPostDetails<T>(postId: string): Observable<T> {
    return this.apiService.get<T>('post/auth/get', {}, postId);
  }

  likePost<T>(body: any): Observable<T> {
    return this.apiService.post<T>('action/like', body);
  }

  unLikePost<T>(body: any): Observable<T> {
    return this.apiService.delete<T>('action/like', body);
  }

  createPost<T>(body: any): Observable<T> {
    return this.apiService.post('post/create', body);
  }

  updatePost<T>(body: any, postId: string): Observable<T> {
    return this.apiService.put('post/update', body, {}, postId);
  }

  deletePost<T>(postId: any): Observable<T> {
    return this.apiService.delete('post/remove', {}, {}, postId);
  }

  savePost<T>(body: any): Observable<T> {
    return this.apiService.post('post/save', body);
  }

  unSavePost<T>(postId: string): Observable<T> {
    return this.apiService.delete('post/save', {}, {}, postId);
  }

  getSimilarPosts<T>(
    postId: string,
    pageIndex: number,
    pageSize: number
  ): Observable<T> {
    return this.apiService.get('post/auth/similar', {
      postId,
      pageIndex,
      pageSize,
    });
  }

  likeComment<T>(body: any): Observable<T> {
    return this.apiService.post('action/like', body);
  }

  unLikeComment<T>(body: any): Observable<T> {
    return this.apiService.delete('action/like', body);
  }

  deleteComment<T>(body: any): Observable<T> {
    return this.apiService.delete('action/comment', body);
  }

  getParentComments<T>(
    postId: string,
    pageIndex: number,
    pageSize: number,
    userId: string
  ): Observable<T> {
    return this.apiService.get(
      'action/comments',
      { pageIndex, pageSize, userId },
      postId
    );
  }

  getChildComments<T>(
    postId: string,
    parentId: string,
    pageIndex: number,
    pageSize: number,
    userId: string
  ): Observable<T> {
    return this.apiService.get(
      'action/comments',
      { pageIndex, pageSize, userId },
      `${postId}/${parentId}`
    );
  }

  postComment<T>(body: any): Observable<T> {
    return this.apiService.post('action/comment', body);
  }

  getTrendingPosts<T>(pageIndex: number, pageSize: number): Observable<T> {
    return this.apiService.get('trending', { pageIndex, pageSize });
  }
}
