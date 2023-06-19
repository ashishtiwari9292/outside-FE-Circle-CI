import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormOperationService } from 'src/app/common/services/form-operation.service';
import { SharedApiService } from '../../shared/shared.api.service';
import { SharedService } from '../../shared/shared.service';
import { UserPost } from '../../user/models/userPost';
import { PostService } from '../post.service';

@Component({
  selector: 'app-add-post-modal',
  templateUrl: './add-post-modal.component.html',
  styleUrls: ['./add-post-modal.component.scss'],
})
export class AddPostModalComponent implements OnInit {
  addPostForm: FormGroup;
  currentStep: number = 1;
  uploadedImages: any[] = [];
  userId: string;
  fileFormat: string = 'image';
  isLoading: boolean = false;
  modalType: string = 'add';
  postType: string = 'image';
  currentPostDetails: UserPost;
  isImageRemoved: boolean = false;
  // dialogRef: MatDialogRef<AddPostModalComponent>;
  constructor(
    private formOperationService: FormOperationService,
    private sharedService: SharedService,
    private sharedApiService: SharedApiService,
    private postService: PostService,
    private dialogRef: MatDialogRef<AddPostModalComponent>,
    @Inject(MAT_DIALOG_DATA) public modalData: any
  ) {}

  ngOnInit(): void {
    this.userId = this.sharedService.getUserId();
    if (this.modalData && this.modalData.type == 'edit') {
      this.initEditForm();
      this.currentPostDetails = this.modalData.post;
      this.setInitialData();
    } else {
      this.initAddForm();
    }
  }

  public handleErrors(form: FormGroup, key: string, type: string): boolean {
    return this.formOperationService.handleErrors(key, type, form, false);
  }

  public getErrorMessage(key: string): string {
    return this.formOperationService.getErrorMessage(key);
  }

  submitForm() {}

  onFileUpload(event: any) {
    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        this.uploadedImages.push(event.target.files[i]);
        if (event.target.files[i].type.indexOf('image') > -1) {
          this.fileFormat = 'image';
        } else if (event.target.files[i].type.indexOf('video') > -1) {
          this.fileFormat = 'video';
        }
        let lastIndex = this.uploadedImages.length - 1;
        var reader = new FileReader();
        reader.onload = (event: any) => {
          this.uploadedImages[lastIndex].imageUrl = event.target.result;
          this.addPostForm.patchValue({
            fileSource: this.uploadedImages,
          });
        };
        reader.readAsDataURL(event.target.files[i]);
      }
    }
  }
  onImageRemove(i: number) {
    if (this.uploadedImages.length == 1) {
      this.addPostForm.patchValue({
        fileSource: null,
        file: null,
      });
    }
    this.uploadedImages.splice(i, 1);
    this.isImageRemoved = true;
  }
  onNextClick(type: string) {
    // if (this.addPostForm.controls.fileSource.errors) {
    //   this.addPostForm.markAllAsTouched();
    //   this.addPostForm.get('fileSource')?.markAsDirty();
    //   return;
    // }
    this.postType = type;
    this.currentStep++;
  }
  onPrevClick() {
    this.currentStep--;
    this.addPostForm.reset();
  }
  async onCreatePost() {
    let postDetails: any[] = [];
    let postTitle: string, postDesc: string, redirectLink: string;
    this.addPostForm.get('file')?.markAsDirty();
    this.addPostForm.get('file')?.markAsTouched();
    if (this.addPostForm.controls.postTitle.errors) {
      this.addPostForm.markAllAsTouched();
      this.addPostForm.get('postTitle')?.markAsDirty();
      return;
    }
    if (
      this.uploadedImages.length != 0 ||
      (this.modalData && this.modalData.type == 'edit')
    ) {
      this.isLoading = true;
      postTitle = this.addPostForm.controls.postTitle.value;
      postDesc = this.addPostForm.controls.postDesc.value;
      redirectLink = this.addPostForm.controls.redirectLink.value;
      let hashTags: any;
      if (postDesc && postDesc != '') {
        hashTags = postDesc.match(/#(\w+)/g);
      }
      if (this.modalType == 'edit' && !this.isImageRemoved) {
        this.callUpdatePostApi(postTitle, postDesc, this.userId, {
          photoUrl: this.currentPostDetails.postDetails[0].photoUrl,
          contentType: this.currentPostDetails.postDetails[0].contentType,
          redirectLink
        });
        return;
      }
      let getS3calls = [];
      let uploadS3calls: any[] = [];
      let body = { key: '', method: '', content: '' };
      for (let i = 0; i < this.uploadedImages.length; i++) {
        let type = 'image';
        if (this.postType == 'video') {
          type = 'video';
        }
        body.key = `post/${this.userId}/${type}/${new Date().getTime()}.${
          this.uploadedImages[i].name?.split('.')[
            this.uploadedImages[i].name?.split('.').length - 1
          ]
        }`;
        body.method = 'put';
        body.content = this.uploadedImages[i].type;
        postDetails.push({
          photoUrl: body.key,
          contentType: body.content,
          redirectLink,
        });
        getS3calls.push(this.sharedApiService.getS3SignedUrl(body).toPromise());
      }
      let index = 0;
      Promise.all(getS3calls)
        .then((values) => {
          for (let value of values) {
            uploadS3calls.push(
              this.sharedApiService
                .uploadToS3(value?.body?.url, this.uploadedImages[index])
                .toPromise()
            );
            index++;
          }
          Promise.all(uploadS3calls)
            .then((res) => {
              if (this.modalType == 'edit') {
                this.callUpdatePostApi(
                  postTitle,
                  postDesc,
                  this.userId,
                  postDetails
                );
              } else {
                this.callCreatePostApi(
                  postTitle,
                  postDesc,
                  this.userId,
                  postDetails,
                  hashTags
                );
              }
            })
            .catch((err) => {
              this.isLoading = false;
            });
        })
        .catch((err) => {
          this.isLoading = false;
        });
    }
  }

  disableButton() {
    let postTitle = this.addPostForm.controls.postTitle.value;
    let postDesc = this.addPostForm.controls.postDesc.value;
    let redirectLink = this.addPostForm.controls.redirectLink.value;
    if (
      this.modalType == 'edit' && 
      this.currentPostDetails.postTitle == postTitle &&
      this.currentPostDetails.postDesc == postDesc &&
      this.currentPostDetails.postDetails[0].redirectLink == redirectLink
    ) {
      return true;
    }
    return false;
  }

  initAddForm() {
    this.addPostForm = new FormGroup({
      postTitle: new FormControl('', Validators.required),
      postDesc: new FormControl(''),
      file: new FormControl('', Validators.required),
      fileSource: new FormControl('', Validators.required),
      redirectLink: new FormControl(''),
    });
  }

  initEditForm() {
    this.addPostForm = new FormGroup({
      postTitle: new FormControl('', Validators.required),
      postDesc: new FormControl(''),
      // file: new FormControl(''),
      // fileSource: new FormControl(''),
      redirectLink: new FormControl(''),
    });
  }

  setInitialData() {
    this.modalType = 'edit';
    this.currentStep++;
    // this.uploadedImages.push({
    //   fileFormat: 'image',
    //   imageUrl: this.currentPostDetails?.postDetails[0]?.photoUrl,
    // });
    this.addPostForm
      .get('postTitle')
      ?.setValue(this.currentPostDetails.postTitle);
    this.addPostForm
      .get('postDesc')
      ?.setValue(this.currentPostDetails.postDesc);
    this.addPostForm
      .get('redirectLink')
      ?.setValue(this.currentPostDetails.postDetails[0].redirectLink);
  }

  closeModal(data: any) {
    this.dialogRef.close(data);
  }

  callCreatePostApi(
    postTitle: string,
    postDesc: string,
    userId: string,
    postDetails: any,
    hashTags: any
  ) {
    this.postService
      .createPost({
        postTitle,
        postDesc,
        userId,
        postDetails,
        hashTags,
      })
      .subscribe(
        (result) => {
          this.isLoading = false;
          this.currentStep++;
          this.sharedService.postListChange$.next(true);
          this.sharedService.updateSidebar$.next(true);
        },
        (err) => {
          this.isLoading = false;
        }
      );
  }
  callUpdatePostApi(
    postTitle: string,
    postDesc: string,
    userId: string,
    postDetails: any
  ) {
    this.postService
      .updatePost(
        {
          postTitle,
          postDesc,
          userId,
          postDetails,
        },
        this.currentPostDetails.id
      )
      .subscribe(
        (result) => {
          this.isLoading = false;
          this.currentStep++;
          this.sharedService.postListChange$.next(true);
        },
        (err) => {
          this.isLoading = false;
        }
      );
  }
}
