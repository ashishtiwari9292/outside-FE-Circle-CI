import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FormOperationService } from 'src/app/common/services/form-operation.service';

@Component({
  selector: 'app-input-field',
  templateUrl: './input-field.component.html',
  styleUrls: ['./input-field.component.scss'],
})
export class InputFieldComponent implements OnInit {
  @Input() formGroup: FormGroup;
  @Input() fieldControlName: string;
  @Input() label: string;
  @Input() placeholder: string;
  @Input() type: string;
  @Input() isFocus: boolean;
  @Input() isMultiple: boolean = false;
  @Input() listenToClick: boolean = false;
  @Input() maxlength: number = 100;
  @Input() accept: string;
  @Output() onKeyUpEvent: EventEmitter<string> = new EventEmitter();
  @Output() onFileUpload: EventEmitter<any> = new EventEmitter();
  @Output() onClick: EventEmitter<any> = new EventEmitter();
  public isPasswordVisible: boolean = false;
  constructor(private formOperationService: FormOperationService) {}

  ngOnInit(): void {
    if(!this.formGroup){
      this.formGroup = new FormGroup({
        placeholder: new FormControl("")
      })
    }
  }

  public handleErrors(form: FormGroup, key: string, type: string): boolean {
    return this.formOperationService.handleErrors(key, type, form, false);
  }

  public getErrorMessage(key: string): string {
    return this.formOperationService.getErrorMessage(key);
  }

  public togglePasswordVisibility(): void {
    if (this.isPasswordVisible) {
      this.type = 'password';
    } else {
      this.type = 'text';
    }
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  public onFileChange(event: any) {
    this.onFileUpload.emit(event);
  }

  public onFileDropEvent(event: any) {
    if(event?.dataTransfer?.items.length){
      let fileType = event.dataTransfer.items[0].type;
      if(this.accept?.includes('image')){
        if(!fileType.includes('image')){
          event.preventDefault();
        }
      }else{
        if(!fileType.includes('video')){
          event.preventDefault();
        }
      }
    }
  }

  public onKeyUp(event: any) {
    this.onKeyUpEvent.emit(event.target.value);
  }

  public onInputClick(event: any){
    this.onClick.emit(event);
  }
}
