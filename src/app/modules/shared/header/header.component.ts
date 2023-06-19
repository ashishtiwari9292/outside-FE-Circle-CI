import {
  Component,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthPopupComponent } from '../../auth/auth-popup/auth-popup.component';
import { Notification } from '../models/notification';
import { SharedService } from '../shared.service';
import { debounce } from '../../../common/helpers/helpers';
import { ChangePasswordComponent } from '../change-password/change-password.component';
import { Subscription } from 'rxjs';
import { SharedApiService } from '../shared.api.service';
import { SocketService } from 'src/app/common/services/socket.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  @ViewChild('notifRef') notificationRef: ElementRef;
  loginSubscription: Subscription;
  searchToggle: boolean = false;
  notificationToggle: boolean = false;
  notifications: Notification[];
  totalNotifications: number;
  totalUnreadNotifications: number = 0;
  notifPageIndex: number = 1;
  notifPageSize: number = 5;
  unreadNotifs: any[] = [];
  unreadNotifsInView: any[] = [];
  notifFlag: boolean = false;
  isLoggedIn: boolean = false;
  userProfileImg: string;
  userFullName: string;
  username: string;
  isLoading: boolean = true;
  isLoadingMoreNotif: boolean = false;
  reachedEnd: boolean = false;
  isSideBarOpen: boolean = false;
  constructor(
    private sharedService: SharedService,
    private sharedApiService: SharedApiService,
    private dialogRef: MatDialog,
    private router: Router,
    private socketService: SocketService
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.sharedService.isLoggedIn();
    this.isLoading = this.isLoggedIn ? true : false;
    this.loginSubscription = this.sharedService.isLoggedIn$.subscribe((res: any) => {
      this.isLoggedIn = res;
    });
    this.sharedService.updateHeader$.subscribe((res: any) => {
      if (this.isLoggedIn && res) {
        this.isLoading = true;
        this.getHeaderData();
      }
    });
    if (!this.userFullName && this.isLoggedIn) {
      this.getHeaderData();
    }
    if (this.isLoggedIn) {
      this.getNotifications();
      this.manageNotificationSocket();
    }
  }

  manageNotificationSocket(){
    this.socketService.listen('notification').subscribe((res) => {
      this.totalUnreadNotifications++;
      this.totalNotifications++;
      this.notifications.unshift(res);
    })
  }

  getHeaderData() {
    this.sharedApiService.getHeaderProfile().subscribe(
      (res: any) => {
        this.isLoading = false;
        if (res.body) {
          this.setHeaderData(res.body);
        }
      },
      (err: any) => {
        this.isLoading = false;
        console.log(err);
      }
    );
  }

  setHeaderData(headerData: any) {
    this.userFullName = headerData.fullName;
    this.userProfileImg = headerData?.userImage;
    this.username = headerData.username;
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    userData.userId = headerData.userId;
    localStorage.setItem('userData', JSON.stringify(userData));
    this.sharedService.userData$.next({
      profilePic: this.userProfileImg,
      fullName: this.userFullName,
      username: headerData.username,
      userId: headerData.userId
    });
  }

  @HostListener('document:mousedown', ['$event'])
  onClick(event: any) {
    if (
      this.notificationRef &&
      this.notificationRef.nativeElement &&
      !this.notificationRef.nativeElement.contains(event.target)
    ) {
      if (this.notificationToggle) {
        this.markNotificationRead();
      }
      this.notificationToggle = false;
    }
  }

  async getNotifications() {
    return new Promise((resolve, reject) => {
      this.sharedApiService
        .getNotifications(this.notifPageIndex, this.notifPageSize)
        .subscribe(
          (res: any) => {
            if (res.result.data && res.result.data.length == 0) {
              this.reachedEnd = true;
            }
            this.isLoadingMoreNotif = false;
            if (this.notifications && this.notifications.length > 0) {
              this.notifications = [...this.notifications, ...res.result.data];
            } else {
              this.notifications = res.result.data;
            }
            this.notifications.forEach((ele) => {
              !ele.isReaded ? this.unreadNotifs.push(ele.id) : '';
              !ele.isReaded && !this.notifFlag
                ? this.unreadNotifsInView.push(ele.id)
                : '';
            });
            this.notifFlag = true;
            this.totalNotifications = res.result.totalLength;
            if (res.result.totalUnreadLength) {
              this.totalUnreadNotifications = res.result.totalUnreadLength;
            }
            resolve(true);
          },
          (err: any) => {
            this.isLoadingMoreNotif = false;
            console.log(err);
            resolve(false);
          }
        );
    });
  }

  loginClicked() {
    let dialog = this.dialogRef.open(AuthPopupComponent, {
      data: { popupType: 'login' },
      maxWidth: 900,
      width: '95%',
      panelClass: 'dialog',
    });
    // dialog.afterClosed().subscribe((result) => {
    //   if (result) {
    //     this.getDocumentList();
    //   }
    // });
  }
  signupClicked() {
    let dialog = this.dialogRef.open(AuthPopupComponent, {
      data: { popupType: 'register' },
      maxWidth: 900,
      width: '95%',
      panelClass: 'dialog',
    });
    // dialog.afterClosed().subscribe((result) => {
    //   if (result) {
    //     this.getDocumentList();
    //   }
    // });
  }
  goToProfile() {
    this.router.navigate([`user/profile/${this.username}`]);
  }
  goToFeed() {
    this.router.navigate([`user/${this.username}`]);
  }
  logout() {
    this.sharedService.isLoggedIn$.next(false);
    localStorage.clear();
    this.router.navigate(['']);
  }
  openSidebar() {
    document.body.className += ' activesidebar';
  }
  hasRoute(route: string) {
    return this.router.url.includes(route);
  }

  deleteNotification(id: string) {
    this.notifications = this.notifications.filter((ele) => ele.id != id);
    this.totalUnreadNotifications > 0
      ? this.totalUnreadNotifications--
      : this.totalUnreadNotifications;
    this.totalNotifications--;
    this.sharedApiService.deleteNotification(id).subscribe(
      (res: any) => {
        console.log(res);
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  clearAllNotification() {
    this.notifications = [];
    this.totalUnreadNotifications = 0;
    this.totalNotifications = 0;
    this.sharedApiService.deleteAllNotification().subscribe(
      (res: any) => {
        console.log(res);
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  toggleNotification() {
    if (this.notificationToggle) {
      this.markNotificationRead();
    }
    this.notificationToggle = !this.notificationToggle;
  }

  markNotificationReadInFrontend() {
    this.notifications.forEach((ele) => {
      if (this.unreadNotifsInView.includes(ele.id)) {
        ele.isReaded = true;
      }
    });
    this.unreadNotifs = this.unreadNotifs.filter((ele) => {
      return !this.unreadNotifsInView.includes(ele);
    });
    this.unreadNotifsInView = [];
  }

  markNotificationReadApiCall(ids: string[]) {
    this.sharedApiService.markNotificationRead(ids).subscribe(
      (res: any) => {
        console.log(res);
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  markNotificationRead() {
    if (this.unreadNotifsInView.length > 0) {
      this.totalUnreadNotifications -= this.unreadNotifsInView.length;
      this.markNotificationReadApiCall(this.unreadNotifsInView);
      this.markNotificationReadInFrontend();
    }
  }

  async loadMoreNotifications() {
    this.isLoadingMoreNotif = true;
    this.notifPageIndex++;
    await this.getNotifications();
  }

  onNotifScroll(event: any) {
    debounce(this.updateUnreadNotifInView, this, 500)(this);
  }

  updateUnreadNotifInView(self: any) {
    self.unreadNotifsInView = self.unreadNotifs.filter((ele: any) => {
      if (self.isInView(document.getElementById(ele))) {
        return ele;
      }
    });
  }

  isInView(elem: any) {
    const bounding = elem.getBoundingClientRect();
    return (
      bounding.top >= 0 &&
      bounding.left >= 0 &&
      bounding.bottom <=
        (window.innerHeight || document.documentElement.clientHeight) &&
      bounding.right <=
        (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  onNotifClick(type: string, postId: string, username: string, notifId: string) {
    this.markNotificationReadApiCall([notifId]);
    if (type == 'follow' && username != '') {
      this.router.navigate([`user/${username}`]);
    } else if (postId != '') {
      this.router.navigate([`post/${btoa(postId)}`]);
    }
    this.notificationToggle = false;
  }

  changePasswordPopUp() {
    let dialog = this.dialogRef.open(ChangePasswordComponent, {
      data: { popupType: 'login' },
      maxWidth: 440,
      width: '95%',
      panelClass: 'dialog',
    });
  }

  isSearchHeader(){
    if(this.router.url == '/' || this.router.url.includes('category')) return true;
    return false;
  }

  ngOnDestroy() {
    this.loginSubscription.unsubscribe();
    this.socketService.removeAllListeners('notification');
  }
}
