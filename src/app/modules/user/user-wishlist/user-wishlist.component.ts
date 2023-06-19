import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PostLikeStatus } from '../../post/models/postData';
import { SavedPost } from '../../post/models/savedPost';
import { PostService } from '../../post/post.service';
import { SharedService } from '../../shared/shared.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user-wishlist',
  templateUrl: './user-wishlist.component.html',
  styleUrls: ['./user-wishlist.component.scss'],
})
export class UserWishlistComponent implements OnInit, OnDestroy {
  loginSubscription: Subscription;
  allPosts: SavedPost[];
  isLoggedIn: boolean;
  pageIndex = 1;
  pageSize = 9;
  isLoading: boolean = true;
  reachedEnd: boolean = false;
  loadingMore: boolean = false;
  constructor(
    private userService: UserService,
    private sharedService: SharedService,
    private postService: PostService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.sharedService.isLoggedIn();
    this.loginSubscription = this.sharedService.isLoggedIn$.subscribe((res: any) => {
      this.isLoggedIn = res;
      if (!res) {
        this.router.navigate(['']);
        return;
      }
    });
    if (!this.isLoggedIn) {
      this.router.navigate(['']);
      return;
    }
    this.getSavedPosts();
  }

  unSavePost(data: PostLikeStatus) {
    this.allPosts = this.allPosts.filter((ele) => ele.postId != data.postId);
    this.postService.unSavePost(data.postId).subscribe(
      (res: any) => {
        console.log(res);
      },
      (err) => {
        this.sharedService.showSnackError(err);
        console.log(err);
      }
    );
  }
  onScroll() {
    if (this.reachedEnd || !this.allPosts || this.allPosts.length == 0) {
      return;
    }
    this.loadingMore = true;
    this.getSavedPosts();
  }

  getSavedPosts() {
    this.userService.getSavedPosts(this.pageIndex, this.pageSize).subscribe(
      (res: any) => {
        this.loadingMore = false;
        if (res?.body.data) {
          this.pageIndex++;
          if (!this.allPosts) {
            this.allPosts = res.body.data;
          } else {
            this.allPosts = [...this.allPosts, ...res.body.data];
          }
        }
        if (res.body.data && res.body.data.length == 0) {
          this.reachedEnd = true;
        }
        this.isLoading = false;
      },
      (err) => {
        this.loadingMore = false;
        this.isLoading = false;
      }
    );
  }

  ngOnDestroy(){
    this.loginSubscription.unsubscribe();
  }
}
