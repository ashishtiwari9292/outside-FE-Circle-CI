import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SharedService } from '../../shared/shared.service';
import { FollowList } from '../models/follow';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user-followers',
  templateUrl: './user-followers.component.html',
  styleUrls: ['./user-followers.component.scss'],
})
export class UserFollowersComponent implements OnInit, OnDestroy {
  loginSubscription: Subscription;
  isLoggedIn: boolean = false;
  currentUsername: string | null;
  pageIndex = 1;
  pageSize = 20;
  isLoadingFollowers: boolean = true;
  isLoadingFollowing: boolean = true;
  throttleApiCalls: boolean = false;
  reachedEndOfFollowers: boolean = false;
  reachedEndOfFollowing: boolean = false;
  loadingMore: boolean = false;
  followersList: FollowList = { count: 0, data: [] };
  followingList: FollowList = { count: 0, data: [] };
  currentTab: number = 0;
  constructor(
    private sharedService: SharedService,
    private router: Router,
    private userService: UserService
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

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
    }
    this.currentUsername = this.sharedService.extractUsername();
    this.setFollowersList();
    this.setFollowingList();
  }

  onTabClick(event: any) {
    this.currentTab = event.index;
    if (
      this.currentUsername &&
      this.followingList.data.length == 0 &&
      event.index == 1
    ) {
      this.setFollowingList();
    }
  }

  onUserClick(username: string) {
    this.router.navigate([`user/${username}`]);
  }

  onScroll() {
    if (
      (this.throttleApiCalls) ||
      (this.reachedEndOfFollowers && this.currentTab == 0) ||
      (this.reachedEndOfFollowing && this.currentTab == 1)
    ) {
      return;
    }
    this.pageIndex++;
    this.loadingMore = true;
    this.throttleApiCalls = true;
    if (this.currentTab === 0) {
      this.setFollowersList();
    } else {
      this.setFollowingList();
    }
  }

  setFollowersList() {
    if (this.currentUsername) {
      this.userService
        .getFollowersList(this.currentUsername, this.pageIndex, this.pageSize)
        .subscribe(
          (res: any) => {
            this.throttleApiCalls = false;
            if (res?.body.data) {
              if (res.body.data.length == 0) {
                this.reachedEndOfFollowers = true;
              } else {
                this.followersList['data'] = [
                  ...this.followersList['data'],
                  ...res.body.data,
                ];
                this.followersList['count'] = res.body.totalLength;
              }
            }
            this.isLoadingFollowers = false;
          },
          (err: any) => {
            this.throttleApiCalls = false;
            this.isLoadingFollowers = false;
          }
        );
    }
  }

  setFollowingList() {
    if (this.currentUsername) {
      this.userService
        .getFollowingList(this.currentUsername, this.pageIndex, this.pageSize)
        .subscribe(
          (res: any) => {
            this.throttleApiCalls = false;
            if (res?.body.data) {
              if (res.body.data.length == 0) {
                this.reachedEndOfFollowing = true;
              } else {
                this.followingList['data'] = [...res.body.data];
                this.followingList['count'] = res.body.totalLength;
              }
            }
            this.isLoadingFollowing = false;
          },
          (err: any) => {
            this.throttleApiCalls = false;
            this.isLoadingFollowing = false;
          }
        );
    }
  }

  onFollowerSearch(event: any) {
    if (event == 'empty') {
      this.pageIndex = 1;
      this.followersList.data = [];
      this.isLoadingFollowers = true;
      this.setFollowersList();
    } else {
      this.followersList.data = event;
    }
  }

  onFollowingSearch(event: any) {
    if (event == 'empty') {
      this.pageIndex = 1;
      this.followingList.data = [];
      this.isLoadingFollowing = true;
      this.setFollowingList();
    } else {
      this.followingList.data = event;
    }
  }

  setLoadingFollowers(event: boolean) {
    this.isLoadingFollowers = event ? true : false;
  }

  setLoadingFollowing(event: boolean) {
    this.isLoadingFollowing = event ? true : false;
  }

  ngOnDestroy(){
    this.loginSubscription.unsubscribe();
  }
}
