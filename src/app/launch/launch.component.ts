import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-launch',
  templateUrl: './launch.component.html',
  styleUrls: ['./launch.component.scss']
})
export class LaunchComponent implements OnInit {
  email = '';
  isEmpty = false;
  isInvalid = false;
  isSubmitted = false;
  serverError = false;
  serverErrorMessage = '';
  constructor(private http: HttpClient) { }

  ngOnInit(): void {
  }
  onSubmit(ngform: any){
    if(this.email == ''){
      this.isEmpty = true;
      setTimeout(() => { this.isEmpty = false; },3000);
      return;
    }
    if(ngform.form.controls.email.errors?.pattern){
      this.isInvalid = true;
      setTimeout(() => { this.isInvalid = false; },3000);
      return;
    }
    let launchBody = {
      email: this.email,
      //createdby and updated by dummy values for now 
      createdBy: 'dummy',
      updatedBy: 'dummy'
    }
    this.email = '';
    this.http.post('http://ec2co-ecsel-1jy3u5xjegjgd-771036687.us-east-2.elb.amazonaws.com/launch',launchBody).subscribe(res => {
      console.log('success'+res);
      this.isSubmitted = true;
      setTimeout(() => { this.isSubmitted = false; },5000);
    },err => {
      console.log(err);
      this.serverError = true;
      this.serverErrorMessage = err.error.message;
      setTimeout(() => { this.serverError = false; },5000);
    });
  }
}
