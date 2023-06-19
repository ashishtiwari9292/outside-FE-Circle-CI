import { Component, Inject, OnInit } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-snack-bar',
  templateUrl: './snack-bar.component.html',
  styleUrls: ['./snack-bar.component.scss']
})
export class SnackBarComponent implements OnInit {
  get getIcon():any {
    switch (this.data.snackType) {
      case 'success':
        return {type: this.data.snackType, icon: 'check', src : this.data.outline ? 'assets/images/check-green.svg' : 'assets/images/check-white.svg'};
      case 'error':
        return {type: this.data.snackType, icon: 'error', src : this.data.outline ? 'assets/images/error-red.svg' : 'assets/images/error-white.svg'};
      case 'warning':
        return {type: this.data.snackType, icon: 'warning', src : this.data.outline ? 'assets/images/warning-yellow.svg' : 'assets/images/warning-white.svg'};
      case 'info':
        return {type: this.data.snackType, icon: 'info', src : this.data.outline ? 'assets/images/info-blue.svg' : 'assets/images/info-white.svg'};
    }
  }
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) { }

  ngOnInit(): void {
  }
  closeSnackbar() {
    this.data.snackBar.dismiss();
  }

}
