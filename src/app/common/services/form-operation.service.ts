import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class FormOperationService {
  constructor() {}

  public static GenericErrors: any = {
    required: 'This field is required',
    email: 'Please enter a valid email address',
    notMatching: 'The passwords do not match',
    image: 'Please upload an image',
    video: 'Please upload an video',
    pattern:
      'Passwords must contain at least 8 characters, 1 uppercase character, 1 lowercase character, 1 special character and a number',
    patternUsername:
      'Username must only contain lowercase alphabets, digits, [.  _  - ] and between 2 to 20 characters',
  };

  public getErrorMessage(key: string): string {
    return FormOperationService.GenericErrors[key];
  }

  public handleErrors(
    key: string,
    type: string,
    formGroup: FormGroup,
    submitted: boolean
  ): boolean {
    const formControl: AbstractControl | null = formGroup.get(key);
    if (
      submitted ||
      (formControl?.touched && formControl?.dirty) ||
      formGroup.errors
    ) {
      if (
        (formControl?.errors && formControl?.errors[type]) ||
        (formGroup?.errors && formGroup?.errors[type])
      ) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
}
