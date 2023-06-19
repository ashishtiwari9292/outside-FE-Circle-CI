import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormOperationService } from 'src/app/common/services/form-operation.service';
import { SharedService } from '../../shared/shared.service';
import { ProfilePhoto } from '../models/ProfilePhoto';
import { UserService } from '../user.service';

@Component({
  selector: 'app-update-image-popup',
  templateUrl: './update-image-popup.component.html',
  styleUrls: ['./update-image-popup.component.scss'],
})
export class UpdateImagePopupComponent implements OnInit {
  userphotos: ProfilePhoto[];
  selectedPhoto: string;
  isLoadingPhotos: boolean = true;
  isSettingPhoto: boolean = false;
  modalType: string = 'profile';
  isImageRemoved: boolean = false;
  constructor(
    private formOperationService: FormOperationService,
    private sharedService: SharedService,
    private userService: UserService,
    private dialogRef: MatDialogRef<UpdateImagePopupComponent>,
    @Inject(MAT_DIALOG_DATA) public modalData: any
  ) {}

  ngOnInit(): void {
    if (this.modalData && this.modalData.type == 'cover') {
      this.modalType = 'cover';
    }
    this.getUserPhotos();
  }

  getUserPhotos() {
    this.userService.getUserPhotos(this.modalType).subscribe(
      (res: any) => {
        this.isLoadingPhotos = false;
        if (res.body && res.body.length > 0) {
          this.userphotos = res.body;
        }
      },
      (err) => {
        this.isLoadingPhotos = false;
        console.log(err);
      }
    );
  }

  public handleErrors(form: FormGroup, key: string, type: string): boolean {
    return this.formOperationService.handleErrors(key, type, form, false);
  }

  public getErrorMessage(key: string): string {
    return this.formOperationService.getErrorMessage(key);
  }

  onImageRemove(i: number) {
    this.isImageRemoved = true;
    this.userService.deleteUserPhoto(this.userphotos[i].id).subscribe(
      (res: any) => {
        console.log(res);
      },
      (err) => {
        console.log(err);
      }
    );
    this.userphotos.splice(i, 1);
  }

  onUpdate() {
    if (!this.userphotos || !this.selectedPhoto) {
      return;
    }
    this.isSettingPhoto = true;
    this.userService
      .setProfilePhoto({
        id: this.selectedPhoto,
        photoType: this.modalType,
      })
      .subscribe(
        (res: any) => {
          this.isSettingPhoto = false;
          if (this.modalType == 'profile') {
            this.closeModal('profile');
            this.sharedService.updateHeader$.next(true);
          } else {
            this.closeModal('cover');
          }
        },
        (err) => {
          this.isSettingPhoto = false;
          console.log(err);
        }
      );
  }

  selectPhoto(id: string) {
    this.selectedPhoto = id;
  }

  closeModal(data: any) {
    this.dialogRef.close(data);
  }
}
