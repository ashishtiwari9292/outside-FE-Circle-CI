import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import {
  AuthenticationDetails,
  CognitoUserPool,
} from 'amazon-cognito-identity-js';
import { FormOperationService } from 'src/app/common/services/form-operation.service';
import { environment } from 'src/environments/environment';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent implements OnInit {
  currentStep: number = 1;
  changePasswordForm: FormGroup;
  wrongPassword: boolean = false;
  isLoading: boolean = false;
  constructor(
    private dialogRef: MatDialogRef<ChangePasswordComponent>,
    private formOperationService: FormOperationService,
    private fb: FormBuilder,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.changePasswordForm = this.fb.group(
      {
        currentpassword: new FormControl('', Validators.required),
        password: new FormControl('', [
          Validators.required,
          Validators.pattern(
            '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-zd$@$!%*?&].{8,}'
          ),
        ]),
        confirmPassword: new FormControl('', [Validators.required]),
      },
      {
        validators: this.confirmPasswordValidator,
      }
    );
  }
  public handleErrors(form: FormGroup, key: string, type: string): boolean {
    return this.formOperationService.handleErrors(key, type, form, false);
  }

  public getErrorMessage(key: string): string {
    return this.formOperationService.getErrorMessage(key);
  }

  onSubmit() {
    this.wrongPassword = false;
    if (this.changePasswordForm.status == 'INVALID') {
      this.changePasswordForm.markAllAsTouched();
      this.changePasswordForm.get('currentpassword')?.markAsDirty();
      this.changePasswordForm.get('password')?.markAsDirty();
      this.changePasswordForm.get('confirmPassword')?.markAsDirty();
      return;
    }
    this.isLoading = true;
    let poolData = {
      UserPoolId: environment.cognitoUserPoolId,
      ClientId: environment.cognitoAppClientId,
    };
    let Username = this.sharedService.getUserName();
    let userPool = new CognitoUserPool(poolData);
    let cognitoUser = userPool.getCurrentUser();
    const authDetails = new AuthenticationDetails({
      Username,
      Password: this.changePasswordForm.value.currentpassword,
    });
    if (cognitoUser != null) {
      cognitoUser.authenticateUser(authDetails, {
        onSuccess: () => {
          if (cognitoUser){
            let self = this;
            cognitoUser.changePassword(
              this.changePasswordForm.value.currentpassword,
              this.changePasswordForm.value.password,
              function (err, result) {
                self.isLoading = false;
                if(!err)
                self.currentStep++;
                if(err)
                self.sharedService.showSnackError({status: 500,err})
                console.log(result,err);
              }
            );
          }
        },
        onFailure: (error) => {
          this.isLoading = false;
          this.wrongPassword = true;
        },
      });
    }
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

  closeModal(data: any) {
    this.dialogRef.close(data);
  }
}
