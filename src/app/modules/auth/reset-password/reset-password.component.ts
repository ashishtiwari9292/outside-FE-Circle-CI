import {
  Component,
  Input,
  OnInit,
  EventEmitter,
  Output,
  OnChanges,
  DoCheck,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';

import { FormOperationService } from 'src/app/common/services/form-operation.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  ResetPasswordForm: FormGroup;
  showLoader: boolean = false;
  submitted: boolean = false;
  serverError: string;
  @Input() isOtpRequired: boolean;
  @Input() email: string;
  @Input() placeholder: string;
  @Input() otpText: string;
  @Input() buttonText: string = 'Reset Password';
  @Input() isLoading: { load: false | true };
  @Output() newPassword: EventEmitter<any> = new EventEmitter();
  // @Output() back: EventEmitter<any> = new EventEmitter();
  constructor(
    public formOperationService: FormOperationService,
    private fb: FormBuilder,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authService.setPageData({
      title: 'Create password',
      icon: 'assets/images/reset-user.svg',
    });
    this.initPasswordForm();
  }
  initPasswordForm() {
    this.ResetPasswordForm = this.getPasswordForm();
  }

  getPasswordForm() {
    return this.isOtpRequired
      ? this.fb.group(
          {
            password: [
              '',
              [
                Validators.required,
                Validators.pattern(
                  '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-zd$@$!%*?&].{8,}'
                ),
              ],
            ],
            confirmPassword: ['', [Validators.required]],
            otp: ['', [Validators.required]],
          },
          { validators: this.confirmPasswordValidator }
        )
      : this.fb.group(
          {
            password: [
              '',
              [
                Validators.required,
                Validators.pattern(
                  '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-zd$@$!%*?&].{8,}'
                ),
              ],
            ],
            confirmPassword: ['', [Validators.required]],
          },
          { validators: this.confirmPasswordValidator }
        );
  }

  public handleErrors(form: FormGroup, key: string, type: string): boolean {
    return this.formOperationService.handleErrors(key, type, form, false);
  }

  getErrorMessage(key: string): string {
    return this.formOperationService.getErrorMessage(key);
  }

  public onResetSubmit() {
    if (this.ResetPasswordForm.invalid) {
      this.ResetPasswordForm.markAllAsTouched();
      this.ResetPasswordForm.get('password')?.markAsDirty();
      this.ResetPasswordForm.get('confirmPassword')?.markAsDirty();
      this.ResetPasswordForm.get('otp')?.markAsDirty();
      return;
    }
    this.isLoading.load = true;
    let data;
    data = {
      newPassword: this.ResetPasswordForm.value.password,
      otp: this.ResetPasswordForm.value.otp,
    };
    this.newPassword.emit(data);
  }
  confirmPasswordValidator(
    control: AbstractControl | any
  ): ValidationErrors | null {
    let pass = control.get('password').value;
    let confirmPass = control.get('confirmPassword').value;
    if (pass != '' && confirmPass != '' && pass != confirmPass) {
      return { notMatching: true };
    }
    return null;
  }

  // goBack(){
  //   this.back.emit(true);
  // }
}
