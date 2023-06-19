import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PostData, PostLikeStatus } from '../../post/models/postData';
import { SearchedPost } from '../../shared/models/searched-post';
import { SearchedUser } from '../../shared/models/searched-user';
import { SharedApiService } from '../../shared/shared.api.service';
import { SharedService } from '../../shared/shared.service';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss'],
})
export class SearchResultsComponent implements OnInit, OnDestroy {
  loginSubscription: Subscription;
  isLoggedIn: boolean = false;
  pageIndexUsers = 1;
  pageIndexPosts = 1;
  pageSizeUsers = 5;
  pageSizePosts = 5;
  throttlePosts: boolean = false;
  throttleUsers: boolean = false;
  isLoadingPosts: boolean = true;
  isLoadingUsers: boolean = true;
  reachedEndOfPosts: boolean = false;
  reachedEndOfUsers: boolean = false;
  loadingMore: boolean = false;
  postsList: PostData[];
  usersList: SearchedUser[];
  currentTab: number = 0;
  searchString: string;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sharedService: SharedService,
    private sharedApiService: SharedApiService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.sharedService.isLoggedIn();
    this.loginSubscription = this.sharedService.isLoggedIn$.subscribe(
      (res: any) => {
        this.isLoggedIn = res;
      }
    );
    this.route.queryParams.subscribe((params) => {
      if (params.q) {
        this.searchString = params.q;
        this.initSearch();
      }
    });
    this.sharedService.searchString$.subscribe((data: any) => {
      if (data && data != '') {
        this.searchString = data;
        this.initSearch();
        this.location.replaceState(`search?q=${this.searchString}`);
      }
    });
    this.isLoadingPosts = true;
    this.isLoadingUsers = true;
  }

  initSearch() {
    this.pageIndexPosts = 1;
    this.pageIndexUsers = 1;
    this.usersList = [];
    this.postsList = [];
    this.isLoadingPosts = true;
    this.isLoadingUsers = true;
    this.searchUsers();
    this.searchPosts();
  }
  onTabClick(event: any) {
    this.currentTab = event.index;
    if (
      this.searchString &&
      (!this.postsList || this.postsList.length == 0) &&
      event.index == 2 &&
      !this.throttlePosts &&
      !this.reachedEndOfUsers
    ) {
      this.searchPosts();
    }
    if (
      this.searchString &&
      (!this.usersList || this.usersList.length == 0) &&
      event.index == 1 &&
      !this.throttleUsers &&
      !this.reachedEndOfPosts
    ) {
      this.searchUsers();
    }
  }

  onScroll() {
    if (
      (this.currentTab == 1 && (this.reachedEndOfUsers || !this.usersList)) ||
      (this.currentTab == 2 && (this.reachedEndOfPosts || !this.postsList))
    ) {
      return;
    }
    if (this.currentTab == 0) {
      return;
    } else if (this.currentTab == 1 && !this.throttleUsers) {
      this.loadingMore = true;
      this.searchUsers();
    } else if (!this.throttlePosts) {
      this.loadingMore = true;
      this.searchPosts();
    }
  }

  onUserClick(username: string) {
    this.router.navigate([`user/${username}`]);
  }

  searchUsers() {
    this.throttleUsers = true;
    this.sharedApiService
      .searchUsersAndPostsWithDetails(
        this.searchString,
        'user',
        this.pageIndexUsers,
        this.pageSizeUsers
      )
      .subscribe(
        (res: any) => {
          this.loadingMore = false;
          this.throttleUsers = false;
          if (res.result) {
            this.setUserData(res);
          }
        },
        (err: any) => {
          this.loadingMore = false;
          this.throttleUsers = false;
          console.log(err);
          this.isLoadingUsers = false;
        }
      );
  }

  setUserData(res: any) {
    this.pageIndexUsers++;
    this.usersList = this.usersList
      ? [...this.usersList, ...res.result.users]
      : res.result.users;
    this.isLoadingUsers = false;
    this.reachedEndOfUsers = res.result.users.length > 0 ? false : true;
  }

  searchPosts() {
    this.throttlePosts = true;
    this.sharedApiService
      .searchUsersAndPostsWithDetails(
        this.searchString,
        'post',
        this.pageIndexPosts,
        this.pageSizePosts
      )
      .subscribe(
        (res: any) => {
          this.loadingMore = false;
          this.throttlePosts = false;
          if (res.result) {
            this.setPostData(res);
          }
        },
        (err: any) => {
          this.loadingMore = false;
          this.throttlePosts = false;
          console.log(err);
          this.isLoadingPosts = false;
        }
      );
  }

  setPostData(res: any) {
    this.pageIndexPosts++;
    this.postsList = this.postsList
      ? [...this.postsList, ...res.result.posts]
      : res.result.posts;
    this.isLoadingPosts = false;
    this.reachedEndOfPosts = res.result.posts.length > 0 ? false : true;
  }

  changeTab(index: number) {
    this.currentTab = index;
    window.scrollTo(0, 0);
  }

  onLikeClick(event: any) {
    console.log('like');
  }

  ngOnDestroy() {
    this.loginSubscription.unsubscribe();
  }
}
