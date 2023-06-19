import { Component, Input, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-popup',
  templateUrl: './confirm-popup.component.html',
  styleUrls: ['./confirm-popup.component.scss']
})
export class ConfirmPopupComponent implements OnInit {
  @Input() heading: string = 'Are you sure?';
  @Input() cancelText: string = 'No';
  @Input() confirmText: string = 'Yes';
  constructor(private dialogRef: MatDialogRef<ConfirmPopupComponent>,) { }

  ngOnInit(): void {
  }

  closeModal(data: any) {
    this.dialogRef.close(data);
  }

}
