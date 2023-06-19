import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-launch',
  templateUrl: './launch.component.html',
  styleUrls: ['./launch.component.scss'],
})
export class LaunchComponent implements OnInit {
  password = '';
  isEmpty = false;
  isInvalid = false;
  isSubmitted = false;
  serverError = false;
  serverErrorMessage = '';
  isLoading = false;
  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {}
  onSubmit(ngform: any) {
    if (this.password == '') {
      this.isEmpty = true;
      setTimeout(() => {
        this.isEmpty = false;
      }, 3000);
      return;
    }
    this.isLoading = true;
    this.http
      .post(`${environment.apiUrl}/verify?pwd=${btoa(this.password)}`, {})
      .subscribe(
        (res) => {
          console.log(res)
          this.isLoading = false;
          if (res === true) {
            sessionStorage.setItem('isVerified', 'true');
            this.router.navigate(['']);
            return;
          }
          if (res === false) {
            this.serverError = true;
            this.serverErrorMessage = 'Incorrect Password';
            setTimeout(() => {
              this.serverError = false;
            }, 5000);
          } else {
            this.serverError = true;
            this.serverErrorMessage = 'Something went wrong! Please try again.';
            setTimeout(() => {
              this.serverError = false;
            }, 5000);
          }
        },
        (err) => {
          this.isLoading = false;
          this.serverError = true;
          this.serverErrorMessage = err.error.message || 'Something went wrong! Please try again.';
          setTimeout(() => {
            this.serverError = false;
          }, 8000);
        }
      );
  }
  // onSubmit(ngform: any) {
  //   if (this.email == '') {
  //     this.isEmpty = true;
  //     setTimeout(() => {
  //       this.isEmpty = false;
  //     }, 3000);
  //     return;
  //   }
  //   if (ngform.form.controls.email.errors?.pattern) {
  //     this.isInvalid = true;
  //     setTimeout(() => {
  //       this.isInvalid = false;
  //     }, 3000);
  //     return;
  //   }
  //   let launchBody = {
  //     email: this.email,
  //     //createdby and updated by dummy values for now
  //     createdBy: 'dummy',
  //     updatedBy: 'dummy',
  //   };
  //   this.email = '';
  //   this.http
  //     .post(
  //       'https://cjqflwsunk.execute-api.us-east-1.amazonaws.com/dev/launch',
  //       launchBody
  //     )
  //     .subscribe(
  //       (res) => {
  //         console.log('success' + res);
  //         this.isSubmitted = true;
  //         setTimeout(() => {
  //           this.isSubmitted = false;
  //         }, 5000);
  //       },
  //       (err) => {
  //         console.log(err);
  //         this.serverError = true;
  //         this.serverErrorMessage = err.error.message;
  //         setTimeout(() => {
  //           this.serverError = false;
  //         }, 5000);
  //       }
  //     );
  // }
}
