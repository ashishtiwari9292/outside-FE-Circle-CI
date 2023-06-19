import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SharedService } from '../../shared/shared.service';
import { UpdateImagePopupComponent } from '../update-image-popup/update-image-popup.component';
import { User } from '../models/user';
import { UserService } from '../user.service';
import { FormControl, FormGroup } from '@angular/forms';
import { MatMenuTrigger } from '@angular/material/menu';
import { ConfirmPopupComponent } from '../../shared/confirm-popup/confirm-popup.component';
import { Subscription } from 'rxjs';
import { SharedApiService } from '../../shared/shared.api.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit, OnDestroy {
  @ViewChild('menuTrigger') menuTrigger: MatMenuTrigger;
  loginSubscription: Subscription;
  userDataSubscription: Subscription;
  isLoggedIn: boolean = false;
  userData: User;
  currentUsername: string | null;
  isLoading: boolean = true;
  ownProfile: boolean = false;
  bioValue: string | undefined = 'I like Outside!';
  editBio: boolean = false;
  loadingBio: boolean = false;
  updateImageForm: FormGroup;
  isUploadProfile: boolean = false;
  isUploadCover: boolean = false;
  isUploadingProfile: boolean = false;
  isUploadingCover: boolean = false;
  isEditName: boolean = false;
  isUpdatingName: boolean = false;
  isUpdateBasicInfo: boolean = false;
  isUpdatingBasicInfo: boolean = false;
  isEmptyName: boolean = false;
  relationshipValue: string = 'single';
  relationshipOptions = [
    { value: 'single', viewValue: 'Single' },
    { value: 'married', viewValue: 'Married' },
    { value: 'divorced', viewValue: 'Divorced' },
    { value: 'engaged', viewValue: 'Engaged' },
  ];
  constructor(
    private sharedService: SharedService,
    private sharedApiService: SharedApiService,
    private userService: UserService,
    private dialogRef: MatDialog
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.sharedService.isLoggedIn();
    this.userDataSubscription = this.sharedService.userData$.subscribe(
      (res: any) => {
        if (this.userData && res) {
          this.userData.profilePic = res.profilePic;
        }
      }
    );
    this.currentUsername = this.sharedService.extractUsername();
    this.loginSubscription = this.sharedService.isLoggedIn$.subscribe((res) => {
      if (res) {
        this.isLoggedIn = true;
        this.isLoading = true;
        this.initData();
      } else {
        this.ownProfile = false;
        this.isLoggedIn = false;
      }
    });
    this.initData();
  }

  initData() {
    let loggedInUsername = this.sharedService.getUserName();
    this.ownProfile = loggedInUsername === this.currentUsername ? true : false;
    if (!this.isLoggedIn || !this.ownProfile) {
      this.sharedApiService
        .getOtherUserSettingsProfile(this.currentUsername || '')
        .subscribe(
          (res: any) => {
            this.isLoading = false;
            if (res.body) {
              this.userData = res.body;
              if (this.userData.relationship) {
                this.relationshipValue = this.userData.relationship;
                this.userData.relationship =
                  this.userData.relationship.charAt(0).toUpperCase() +
                  this.userData.relationship.slice(1);
              }
            }
          },
          (err) => {
            this.isLoading = false;
            console.log(err);
          }
        );
    } else {
      this.sharedApiService.getOwnUserSettingsProfile().subscribe(
        (res: any) => {
          this.isLoading = false;
          this.isUploadingProfile = false;
          this.isUploadingCover = false;
          if (res.body) {
            this.userData = res.body;
            if (this.userData.relationship) {
              this.relationshipValue = this.userData.relationship;
              this.userData.relationship =
                this.userData.relationship.charAt(0).toUpperCase() +
                this.userData.relationship.slice(1);
            }
            this.bioValue = this.userData.about || this.bioValue;
            this.isLoading = false;
          }
        },
        (err) => {
          this.isLoading = false;
          this.isUploadingProfile = false;
          this.isUploadingCover = false;
          console.log(err);
        }
      );
    }
  }

  initProfileImageForm() {
    this.updateImageForm = new FormGroup({
      image: new FormControl(''),
    });
  }

  onFileUpload(event: any, type = 'profile') {
    if (event.target.files && event.target.files[0]) {
      this.isUploadProfile = false;
      this.isUploadCover = false;
      if (type == 'profile') {
        this.isUploadingProfile = true;
      } else {
        this.isUploadingCover = true;
      }
      let postDetails: any[] = [];
      let getS3calls = [];
      let uploadS3calls: any[] = [];
      let body = { key: '', method: '', content: '' };
      body.key = `post/${this.userData.id}/image/${new Date().getTime()}.${
        event.target.files[0].name?.split('.')[event.target.files[0].name?.split('.').length - 1]
      }`;
      body.method = 'put';
      body.content = event.target.files[0].type;
      postDetails.push({ photoUrl: body.key, contentType: body.content });
      getS3calls.push(this.sharedApiService.getS3SignedUrl(body).toPromise());
      let index = 0;
      let eventBackup = event.target.files[0];
      Promise.all(getS3calls)
        .then((values) => {
          for (let value of values) {
            uploadS3calls.push(
              this.sharedApiService
                .uploadToS3(value?.body?.url, eventBackup)
                .toPromise()
            );
            index++;
          }
          Promise.all(uploadS3calls)
            .then((res) => {
              this.callUpdateProfileApi(postDetails, type);
            })
            .catch((err) => {
              this.isLoading = false;
              this.isUploadingProfile = false;
              this.isUploadingCover = false;
            });
        })
        .catch((err) => {
          this.isLoading = false;
          this.isUploadingProfile = false;
          this.isUploadingCover = false;
        });
    }
  }

  callUpdateProfileApi(postDetails: any, type: string) {
    this.userService
      .updateUserProfile({
        fullName: this.userData.fullName,
        images:
          postDetails && postDetails.length && postDetails[0].photoUrl
            ? [
                {
                  photoUrl: postDetails[0].photoUrl,
                  photoType: type,
                  contentType: postDetails[0].contentType || '',
                },
              ]
            : undefined,
      })
      .subscribe(
        (res) => {
          if (type == 'profile') {
            this.sharedService.updateHeader$.next(true);
            this.isLoading = false;
            this.isUploadingProfile = false;
            this.isUploadingCover = false;
          } else {
            this.isLoading = true;
            this.initData();
          }
        },
        (err) => {
          this.isLoading = false;
          this.isUploadingProfile = false;
          this.isUploadingCover = false;
        }
      );
  }

  saveBio() {
    this.editBio = false;
    this.userService
      .updateUserProfile({
        fullName: this.userData.fullName,
        about: this.bioValue,
      })
      .subscribe(
        (res) => {
          this.loadingBio = false;
          //this.sharedService.getUserProfile(true);
        },
        (err) => {
          this.loadingBio = false;
        }
      );
  }

  updateFullname() {
    if (this.userData.fullName.trim() == '') {
      this.isEmptyName = true;
      return;
    }
    this.isEmptyName = false;
    this.isUpdatingName = true;
    this.userService
      .updateUserProfile({ fullName: this.userData.fullName })
      .subscribe(
        (res) => {
          this.isLoading = false;
          this.isUpdatingName = false;
          this.isEditName = false;
          this.sharedService.updateHeader$.next(true);
        },
        (err) => {
          this.isUpdatingName = false;
          this.isLoading = false;
        }
      );
  }

  updateBasicInfo() {
    this.isUpdatingBasicInfo = true;
    this.userService
      .updateUserProfile({
        dob: this.userData.dob,
        location: this.userData.location,
        relationship: this.relationshipValue,
      })
      .subscribe(
        (res: any) => {
          this.isUpdatingBasicInfo = false;
          this.isUpdateBasicInfo = false;
          this.isLoading = false;
          if (res.body) {
            this.userData.relationship = res?.body?.relationship
              ? res.body.relationship.charAt(0).toUpperCase() +
                res.body.relationship.substring(1)
              : this.userData.relationship;
          }
        },
        (err) => {
          this.isUpdatingBasicInfo = false;
          this.isLoading = false;
        }
      );
  }

  closeMenu(event: any) {
    event.stopPropagation();
    this.menuTrigger.closeMenu();
  }

  removePhoto(photoType: string) {
    let dialog = this.dialogRef.open(ConfirmPopupComponent, {
      maxWidth: 500,
      width: '95%',
      panelClass: 'dialog',
    });
    dialog.afterClosed().subscribe((result) => {
      if (result == 'YES') {
        if (photoType == 'cover') {
          this.isUploadingCover = true;
        } else {
          this.isUploadingProfile = true;
        }
        this.userService.removePhoto(photoType).subscribe(
          (res) => {
            if (photoType == 'cover') {
              this.userData.coverPic = undefined;
              this.isUploadingCover = false;
            } else {
              this.sharedService.updateHeader$.next(true);
              this.userData.profilePic = undefined;
              this.isUploadingProfile = false;
            }
          },
          (err) => {
            this.sharedService.showSnackError(err);
            console.log(err);
          }
        );
      }
    });
  }

  openImagePopup(type: string) {
    let dialog = this.dialogRef.open(UpdateImagePopupComponent, {
      data: { type },
      maxWidth: 500,
      width: '95%',
      panelClass: 'dialog',
    });
    dialog.afterClosed().subscribe((result) => {
      if (result == 'cover') {
        this.isLoading = true;
        this.initData();
      }
    });
  }

  ngOnDestroy() {
    this.loginSubscription.unsubscribe();
    this.userDataSubscription.unsubscribe();
  }
}
