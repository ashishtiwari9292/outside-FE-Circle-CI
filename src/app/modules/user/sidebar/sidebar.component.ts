import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscriber, Subscription } from 'rxjs';
import { closeSideBar } from 'src/app/common/helpers/helpers';
import { AuthPopupComponent } from '../../auth/auth-popup/auth-popup.component';
import { AddPostModalComponent } from '../../post/add-post-modal/add-post-modal.component';
import { SideBar } from '../../shared/models/sidebar';
import { SharedApiService } from '../../shared/shared.api.service';
import { SharedService } from '../../shared/shared.service';
import { UserProfileWidget } from '../models/userProfileWidget';
import { UserService } from '../user.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit, OnDestroy {
  sideBarData: SideBar;
  isLoggedIn: boolean = false;
  loggedInUsername: string;
  loggedInUserData: UserProfileWidget;
  routeUsername: string = 'placeholder';
  loginSubscription: Subscription;
  isLoading: boolean = true;
  ownProfile: boolean = false;
  followLoader: boolean = false;
  constructor(
    private sharedService: SharedService,
    private sharedApiService: SharedApiService,
    private userService: UserService,
    private dialogRef: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    closeSideBar();
    this.isLoggedIn = this.sharedService.isLoggedIn();
    this.loggedInUsername = this.sharedService.getUserName();
    this.routeUsername = this.sharedService.extractUsername();
    if (!this.routeUsername) {
      this.router.navigate(['404']);
    }
    this.sharedService.updateSidebar$.subscribe((res) => {
      if (res) {
        this.getOwnSidebarData();
      }
    });
    this.sharedService.userData$.subscribe((res: any) => {
      if (this.sideBarData) {
        this.sideBarData.profilePic = res.profilePic;
        this.sideBarData.fullName = res.fullName;
      }
    });
    this.loginSubscription = this.sharedService.isLoggedIn$.subscribe((res) => {
      if (res) {
        this.isLoggedIn = true;
        this.loggedInUsername = this.sharedService.getUserName();
        this.isLoading = true;
      } else {
        this.isLoggedIn = false;
        this.ownProfile = false;
      }
      this.initData();
    });
    this.initData();
  }

  initData() {
    if (this.loggedInUsername == this.routeUsername) {
      this.ownProfile = true;
    }
    if (this.routeUsername == this.loggedInUsername) {
      this.getOwnSidebarData();
    } else {
      this.getOthersSidebarData(this.routeUsername);
    }
  }

  createPost() {
    let dialog = this.dialogRef.open(AddPostModalComponent, {
      data: { dialogRef: this.dialogRef },
      maxWidth: 500,
      width: '95%',
      panelClass: 'dialog',
    });
    dialog.afterClosed().subscribe((res) => {
      if (res == 'DONE') {
      }
    });
  }

  getOwnSidebarData() {
    this.sharedApiService.getOwnSidebarProfile().subscribe(
      (res: any) => {
        this.isLoading = false;
        if (res.body) {
          this.sharedService.coverImage$.next(res.body.coverPic);
          this.sideBarData = res.body;
        }
      },
      (err: any) => {
        this.isLoading = false;
        console.log(err);
      }
    );
  }

  getOthersSidebarData(username: string) {
    this.sharedApiService.getOthersSidebarProfile(username).subscribe(
      (res: any) => {
        this.isLoading = false;
        if (res?.body) {
          this.sharedService.coverImage$.next(res.body.coverPic);
          this.sideBarData = res.body;
        }
      },
      (err: any) => {
        this.isLoading = false;
        console.log(err);
      }
    );
  }

  onFollow() {
    if (!this.isLoggedIn) {
      this.showAuthPopup();
      return;
    }
    try {
      this.followLoader = true;
      if (!this.sideBarData.isFollowed) {
        this.userService.followUser(this.sideBarData.id).subscribe(
          (res) => {
            this.sideBarData.followersCount++;
            this.followLoader = false;
            this.sideBarData.isFollowed = !this.sideBarData.isFollowed;
          },
          (err: any) => {
            this.sharedService.showSnackError(err);
            this.followLoader = false;
          }
        );
      } else {
        this.userService.unFollowUser(this.sideBarData.id).subscribe(
          (res) => {
            this.sideBarData.followersCount--;
            this.followLoader = false;
            this.sideBarData.isFollowed = !this.sideBarData.isFollowed;
          },
          (err: any) => {
            this.sharedService.showSnackError(err);
            this.followLoader = false;
          }
        );
      }
    } catch (err) {
      console.log(err);
    }
  }

  showAuthPopup() {
    this.dialogRef.open(AuthPopupComponent, {
      data: { popupType: 'login' },
      maxWidth: 900,
      width: '95%',
      panelClass: 'custom-dialog',
    });
  }

  closeSideBar() {
    closeSideBar();
  }

  ngOnDestroy() {
    this.loginSubscription.unsubscribe();
  }
}
