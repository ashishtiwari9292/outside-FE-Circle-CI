import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Router } from '@angular/router';
import { SlickCarouselComponent } from 'ngx-slick-carousel';
import { Subscriber, Subscription } from 'rxjs';
import { AuthPopupComponent } from '../../auth/auth-popup/auth-popup.component';
import { AddPostModalComponent } from '../../post/add-post-modal/add-post-modal.component';
import { PostData } from '../../post/models/postData';
import { PostService } from '../../post/post.service';
import { ConfirmPopupComponent } from '../../shared/confirm-popup/confirm-popup.component';
import { PostCard } from '../../shared/models/post-card';
import { SharedService } from '../../shared/shared.service';
import { FollowList } from '../models/follow';
import { UserService } from '../user.service';
@Component({
  selector: 'app-user-home',
  templateUrl: './user-home.component.html',
  styleUrls: ['./user-home.component.scss'],
})
export class UserHomeComponent implements OnInit, OnDestroy {
  @ViewChild('slickModal') slickModal: SlickCarouselComponent;
  loginSubscription: Subscription;
  userDataSubscription: Subscription;
  postSubscription: Subscription;
  isLoggedIn: boolean = false;
  error: boolean = false;
  ownProfile: boolean = false;
  coverImage: string;
  isLoadingPosts: boolean = true;
  isLoadingCoverimg: boolean = true;
  username: string = 'placeholder';
  pageIndexPosts = 1;
  pageSizePosts = 5;
  posts: PostData[];
  userId: string;
  reachedEnd: boolean = false;
  loadingMore: boolean = false;
  /** Recent Followers */
  pageIndexFollowers = 1;
  skippedOnce = false;
  pageSizeFollowers = 10;
  isLoadingFollowers: boolean = true;
  isLoadingNextFollower: boolean = true;
  reachedEndOfFollowers: boolean = false;
  followersList: FollowList = { count: 0, data: [] };
  fromIndex: number = 0;
  currentSlide: number = 0;
  maxSlide: number = 0;
  slideConfig = {
    slidesToShow: 5,
    slidesToScroll: 1,
    infinite: false,
    responsive: [
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
    ],
  };

  constructor(
    private sharedService: SharedService,
    private userService: UserService,
    private postService: PostService,
    private router: Router,
    private dialogRef: MatDialog
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit(): void {
    this.isLoggedIn = this.sharedService.isLoggedIn();
    this.userId = this.sharedService.getUserId();
    this.username = this.sharedService.extractUsername();
    this.loginSubscription = this.sharedService.isLoggedIn$.subscribe(
      (res: any) => {
        this.isLoggedIn = res;
        if (res) {
          this.initData();
        } else {
          this.ownProfile = false;
        }
      }
    );
    this.sharedService.coverImage$.subscribe((res: any) => {
      if (res != '') {
        this.coverImage = res;
        this.isLoadingCoverimg = false;
      }
    });
    this.userDataSubscription = this.sharedService.userData$.subscribe(
      (userData: any) => {
        if (userData?.username === this.username) {
          this.ownProfile = true;
        } else {
          this.ownProfile = false;
        }
      }
    );
    this.initData();
    this.postSubscription = this.sharedService.postListChange$.subscribe(
      (res: any) => {
        if (res) {
          this.pageIndexPosts = 1;
          this.posts = [];
          this.isLoadingPosts = true;
          this.getTimeline();
        }
      }
    );
  }

  initData() {
    if (this.isLoggedIn) this.getRecentFollowers();
    this.getTimeline();
  }

  getRecentFollowers() {
    this.isLoadingNextFollower = true;
    this.userService
      .getFollowersList(
        this.username,
        this.pageIndexFollowers,
        this.pageSizeFollowers
      )
      .subscribe(
        (res: any) => {
          this.removeSkeleton();
          if (res?.body.data) {
            if (res.body.data.length == 0) {
              this.reachedEndOfFollowers = true;
            } else {
              this.followersList['data'] = [
                ...this.followersList['data'],
                ...res.body.data,
              ];
              this.maxSlide += res.body.data.length;
              this.followersList['count'] = res.body.count;
            }
          }
          this.isLoadingFollowers = false;
          this.isLoadingNextFollower = false;
        },
        (err: any) => {
          this.removeSkeleton();
          this.isLoadingFollowers = false;
          this.isLoadingNextFollower = false;
        }
      );
  }

  getTimeline() {
    if (this.ownProfile) {
      this.userService
        .getTimeline(this.pageIndexPosts, this.pageSizePosts)
        .subscribe(
          (res: any) => {
            this.isLoadingPosts = false;
            this.loadingMore = false;
            if (res.body.data) {
              this.posts =
                this.posts && this.posts.length
                  ? [...this.posts, ...res.body.data]
                  : res.body.data;
              this.reachedEnd =
                res.body.data.length == 0 ? true : this.reachedEnd;
                this.addOwnPostField();
            }
          },
          (err: any) => {
            this.loadingMore = false;
            this.isLoadingPosts = false;
            console.log(err);
          }
        );
    } else {
      this.userService
        .getPostListByUsername(
          this.username,
          this.pageIndexPosts,
          this.pageSizePosts
        )
        .subscribe(
          (res: any) => {
            if (res.body.data) {
              this.posts =
                this.posts && this.posts.length
                  ? [...this.posts, ...res.body.data]
                  : res.body.data;
              this.reachedEnd =
                res.body.data.length == 0 ? true : this.reachedEnd;
                this.addOwnPostField();
            }
            this.loadingMore = false;
            this.isLoadingPosts = false;
          },
          (err: any) => {
            console.log(err);
            this.loadingMore = false;
            this.isLoadingPosts = false;
          }
        );
    }
  }

  beforeChange(e: any) {
    if (
      e.nextSlide > e.currentSlide &&
      !this.reachedEndOfFollowers &&
      this.maxSlide <= e.nextSlide + 5
    ) {
      // this.skippedOnce ? (this.pageIndexFollowers += 1) : (this.pageIndexFollowers += 10);
      // this.skippedOnce = true;
      this.pageIndexFollowers++;
      this.pageSizeFollowers = 10;
      if (
        this.followersList.data[this.followersList.data.length - 1].username !=
        'skeleton'
      ) {
        this.followersList.data.push({
          username: 'skeleton',
          fullName: 'skeleton',
          photoUrl: 'skeleton',
        });
      }
      this.getRecentFollowers();
    }
  }

  onDeletePost(postId: string) {
    let dialog = this.dialogRef.open(ConfirmPopupComponent, {
      maxWidth: 500,
      width: '95%',
      panelClass: 'dialog',
    });
    dialog.afterClosed().subscribe((result) => {
      if (result == 'YES') {
        this.posts = this.posts.filter((ele) => {
          return ele.id !== postId;
        });
        this.postService.deletePost(postId).subscribe(
          (res: any) => {
            console.log(res);
          },
          (err: any) => {
            this.sharedService.showSnackError(err);
            console.log(err);
          }
        );
      }
    });
  }

  onEditPost(post: PostCard) {
    let dialog = this.dialogRef.open(AddPostModalComponent, {
      data: { type: 'edit', post },
      maxWidth: 500,
      width: '95%',
      panelClass: 'dialog',
    });
    dialog.afterClosed().subscribe((result) => {
      if (result == 'DONE') {
      }
    });
  }

  onUserClick(username: string) {
    this.router.navigate([`user/${username}`]);
  }

  onScroll() {
    if (!this.isLoggedIn && !this.reachedEnd) {
      this.showAuthPopup();
      return;
    }
    if (this.reachedEnd || !this.posts || this.posts.length == 0) {
      return;
    }
    this.pageIndexPosts++;
    this.loadingMore = true;
    this.getTimeline();
  }

  removeSkeleton() {
    if (
      this.followersList.data.length > 0 &&
      this.followersList.data[this.followersList.data.length - 1].username ==
        'skeleton'
    ) {
      this.followersList.data.pop();
    }
  }

  showAuthPopup() {
    this.dialogRef.open(AuthPopupComponent, {
      data: { popupType: 'login' },
      maxWidth: 900,
      width: '95%',
      panelClass: 'dialog',
    });
  }

  addOwnPostField(){
    this.posts = this.posts.map((ele)=>{
      ele.ownPost = false;
      if(ele.userInfo.id == this.userId){
        ele.ownPost = true;
      }
      return ele;
    })
  }

  ngOnDestroy() {
    this.userDataSubscription.unsubscribe();
    this.loginSubscription.unsubscribe();
    this.postSubscription.unsubscribe();
  }
}
