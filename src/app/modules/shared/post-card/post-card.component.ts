import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { getVideoUrl, isImage } from 'src/app/common/helpers/helpers';
import { AuthPopupComponent } from '../../auth/auth-popup/auth-popup.component';
import { PostData, PostLikeStatus } from '../../post/models/postData';
import { PostService } from '../../post/post.service';
import { User } from '../../user/models/user';
import { UserPost } from '../../user/models/userPost';
import { PostCard } from '../models/post-card';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-post-card',
  templateUrl: './post-card.component.html',
  styleUrls: ['./post-card.component.scss'],
})
export class PostCardComponent implements OnInit, OnDestroy {
  @Input() userPost: UserPost;
  @Input() post: PostData;
  @Input() isLoading: boolean = true;
  @Input() ownProfile: boolean = false;
  @Output() onLikeClickPost: EventEmitter<any> = new EventEmitter();
  @Output() onDeletePost: EventEmitter<string> = new EventEmitter();
  @Output() onEditPost: EventEmitter<PostCard> = new EventEmitter();
  loginSubscription: Subscription;
  postCardData: PostCard;
  currentUsername: string;
  ownPost: boolean = false;
  isLiked: boolean = false;
  likeLoader: boolean = false;
  likeCount: number = 0;
  userData: User;
  updatedTime: string;
  isLoggedIn: boolean = false;

  constructor(
    private sharedService: SharedService,
    private postService: PostService,
    private router: Router,
    private dialogRef: MatDialog
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.sharedService.isLoggedIn();
    this.loginSubscription = this.sharedService.isLoggedIn$.subscribe((res) => {
      this.isLoggedIn = res;
    });
    if (!this.isLoading) {
      if (this.ownProfile) {
        this.sharedService.userData$.subscribe((userData: any) => {
          this.userData = userData;
        });
      }
      this.currentUsername = this.sharedService.extractUsername();
      this.formatToPostCard();
    }
  }

  formatToPostCard() {
    this.postCardData = {
      id: this.userPost ? this.userPost.id : this.post.id,
      postTitle: this.userPost ? this.userPost.postTitle : this.post.postTitle,
      postDesc: this.userPost ? this.userPost.postDesc : this.post.postDesc,
      likeCount: this.userPost ? this.userPost.likeCount : this.post.likeCount,
      isLiked: this.userPost ? this.userPost.isLiked : this.post.isLiked,
      commentCount: this.userPost
        ? this.userPost.commentCount
        : this.post.commentCount,
      updatedDate: this.userPost
        ? this.userPost.updatedDate || this.userPost.updatedAt
        : this.post.updatedDate || this.post.updatedAt,
      postDetails: [
        {
          photoUrl: this.userPost
            ? this.userPost.postDetails[0].photoUrl
            : this.post.postDetails.length > 0
            ? this.post.postDetails[0].photoUrl
            : '',
          streamUrl: this.userPost
            ? this.userPost.postDetails[0].streamUrl
            : this.post.postDetails.length > 0
            ? this.post.postDetails[0].streamUrl
            : '',
          contentType: this.userPost
            ? this.userPost.postDetails[0].contentType
            : this.post.postDetails.length > 0
            ? this.post.postDetails[0].contentType
            : '',
          redirectLink: this.userPost
            ? this.userPost.postDetails[0].redirectLink
            : this.post.postDetails.length > 0
            ? this.post.postDetails[0].redirectLink
            : '',
        },
      ],
      userData: {
        profilePic: this.userPost
          ? this.userPost.userInfo.profilePic ||
            'assets/images/skelton-man-md.png'
          : this.post.userInfo.profilePic || 'assets/images/skelton-man-md.png',
        fullName: this.userPost
          ? this.userPost.userInfo.fullName
          : this.post.userInfo.fullName,
        username: this.userPost
          ? this.userPost.userInfo.userName
          : this.post.userInfo.userName,
      },
    };
    this.isLiked = this.postCardData.isLiked;
    this.likeCount = this.postCardData.likeCount;
  }

  onLikeClick(event: any) {
    if (!this.isLoggedIn) {
      this.dialogRef.open(AuthPopupComponent, {
        data: { popupType: 'login' },
        maxWidth: 900,
        width: '95%',
        panelClass: 'dialog',
      });
      return;
    }
    if(this.likeLoader){
      return;
    }
    this.likeLoader = true;
    if (!this.isLiked) {
      this.postService
        .likePost({
          actionOn: 'post',
          postId: this.userPost ? this.userPost.id : this.post.id,
        })
        .subscribe(
          (res) => {
            this.likeLoader = false;
            this.onLikeClickPost.emit({ response: res });
          },
          (err) => {
            this.sharedService.showSnackError(err);
            this.likeLoader = false;
            this.onLikeClickPost.emit({ error: err });
          }
        );
    } else {
      this.postService
        .unLikePost({
          actionOn: 'post',
          postId: this.userPost ? this.userPost.id : this.post.id,
        })
        .subscribe(
          (res) => {
            this.likeLoader = false;
            this.onLikeClickPost.emit({ response: res });
          },
          (err) => {
            this.sharedService.showSnackError(err);
            this.likeLoader = false;
            this.onLikeClickPost.emit({ error: err });
          }
        );
    }
    if (this.isLiked) {
      this.likeCount > 0 ? this.likeCount-- : '';
    } else {
      this.likeCount++;
    }
    this.isLiked = !this.isLiked;
  }

  editPost() {
    this.onEditPost.emit(this.postCardData);
  }

  deletePost() {
    this.onDeletePost.emit(this.postCardData.id);
  }

  onPostClick(id: string) {
    this.router.navigate([`post/${btoa(id)}`]);
  }

  ngOnDestroy() {
    this.loginSubscription?.unsubscribe();
  }

  getVideoUrl(){
    return getVideoUrl(this.postCardData.postDetails[0], this.postCardData.updatedDate);
  }

  isImage(url: string){
    return isImage(url);
  }
}
