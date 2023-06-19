import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from '../../shared/shared.service';
import { UserService } from '../user.service';
import { UserPost } from '../models/userPost';
import { PostService } from '../../post/post.service';
import { AddPostModalComponent } from '../../post/add-post-modal/add-post-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { PostCard } from '../../shared/models/post-card';
import { ConfirmPopupComponent } from '../../shared/confirm-popup/confirm-popup.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-posts',
  templateUrl: './user-posts.component.html',
  styleUrls: ['./user-posts.component.scss'],
})
export class UserPostsComponent implements OnInit, OnDestroy {
  loginSubscription: Subscription;
  postSubscription: Subscription;
  isLoggedIn: boolean = false;
  pageIndex = 1;
  pageSize = 6;
  userPosts: UserPost[];
  isLoading: boolean = true;
  reachedEnd: boolean = false;
  loadingMore: boolean = false;
  constructor(
    private sharedService: SharedService,
    private router: Router,
    private userService: UserService,
    private postService: PostService,
    private dialogRef: MatDialog
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.sharedService.isLoggedIn();
    this.loginSubscription = this.sharedService.isLoggedIn$.subscribe((res: any) => {
      this.isLoggedIn = res;
      if (!res) {
        this.router.navigate(['']);
        return;
      }
    });
    if (!this.isLoggedIn) {
      this.router.navigate(['']);
    }
    this.postSubscription = this.sharedService.postListChange$.subscribe((res: any) => {
      if (res) {
        this.pageIndex = 1;
        this.userPosts = [];
        this.isLoading = true;
        this.getPostsList();
      }
    });
    this.getPostsList();
  }

  getPostsList(forceData = false) {
    this.userService.getPostsList(this.pageIndex, this.pageSize).subscribe(
      (res: any) => {
        this.pageIndex++;
        if (res?.body.data) {
          if (!this.userPosts || forceData) {
            this.userPosts = res.body.data;
          } else {
            this.userPosts = [...this.userPosts, ...res.body.data];
          }
        }
        if (res.body.data.length == 0) {
          this.reachedEnd = true;
        }
        this.isLoading = false;
        this.loadingMore = false;
      },
      (err) => {
        console.log(err);
        this.isLoading = false;
      }
    );
  }

  onDeletePost(postId: string) {
    let dialog = this.dialogRef.open(ConfirmPopupComponent, {
      maxWidth: 500,
      width: '95%',
      panelClass: 'dialog',
    });
    dialog.afterClosed().subscribe((result) => {
      if (result == 'YES') {
        this.userPosts = this.userPosts.filter((ele) => {
          return ele.id !== postId;
        });
        this.postService.deletePost(postId).subscribe(
          (res: any) => {
            console.log(res);
          },
          (err) => {
            this.sharedService.showSnackError(err);
            console.log(err);
          }
        );
      }
    });
  }

  onEditPost(post: PostCard) {
    let dialog = this.dialogRef.open(AddPostModalComponent, {
      data: { type: 'edit', post },
      maxWidth: 500,
      width: '95%',
      panelClass: 'dialog',
    });
  }

  onScroll() {
    if (this.reachedEnd || !this.userPosts || this.userPosts.length == 0) {
      return;
    }
    this.loadingMore = true;
    this.getPostsList();
  }

  createPost() {
    let dialog = this.dialogRef.open(AddPostModalComponent, {
      data: { dialogRef: this.dialogRef },
      maxWidth: 500,
      width: '95%',
      panelClass: 'dialog',
    });
    dialog.afterClosed().subscribe((res: any) => {
      if (res == 'DONE') {
        this.pageIndex = 1;
        this.isLoading = true;
        this.getPostsList(true);
      }
    });
  }

  ngOnDestroy(){
    this.postSubscription.unsubscribe();
    this.loginSubscription.unsubscribe();
  }
}
