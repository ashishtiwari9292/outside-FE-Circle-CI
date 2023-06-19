import { Component, OnInit, ChangeDetectorRef, Inject } from '@angular/core';

import { PageData } from '../models/pageData';
import { AuthService } from '../auth.service';
import { Subscriber } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

enum PopupType {
  LOGIN = 'login',
  REGISTER = 'register',
  FORGOT = 'forgot',
}

@Component({
  selector: 'app-auth-popup',
  templateUrl: './auth-popup.component.html',
  styleUrls: ['./auth-popup.component.scss'],
})
export class AuthPopupComponent implements OnInit {
  popupType: PopupType = PopupType.LOGIN;
  pageData: PageData = { title: '', icon: '' };
  subscription: any = new Subscriber();
  constructor(
    private authService: AuthService,
    private changeDetector: ChangeDetectorRef,
    private dialogRef: MatDialogRef<AuthPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  ngOnInit(): void {
    this.subscription = this.authService.title.subscribe(
      (pageData: PageData) => {
        this.pageData.title = pageData.title;
        this.pageData.icon = pageData.icon;
      }
    );
    if(this.data && this.data.popupType){
      this.popupType = this.data.popupType;
    }
  }
  onLinkClick(data: PopupType) {
    if (data == 'forgot') {
      this.popupType = PopupType.FORGOT;
    }
    if (data == 'register') {
      this.popupType = PopupType.REGISTER;
    }
    if (data == 'login') {
      this.popupType = PopupType.LOGIN;
    }
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  ngAfterViewChecked() {
    //Need this since 'Title' changes after angular runs change detection and angular gives error
    this.changeDetector.detectChanges();
  }
  closeModal(data: any) {
    this.dialogRef.close(data);
  }
}
