import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { PostData, PostLikeStatus } from 'src/app/modules/post/models/postData';
import { SharedService } from 'src/app/modules/shared/shared.service';
import { PostService } from '../post/post.service';
import { DashboardService } from './post-gallery.service';
import { MatDialog } from '@angular/material/dialog';
import { AuthPopupComponent } from '../auth/auth-popup/auth-popup.component';
import { DashboardPost } from './models/dashboardPost';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackBarService } from 'src/app/common/services/snack-bar.service';
import { Subscription } from 'rxjs';
import { PostComponent } from '../post/post.component';

@Component({
  selector: 'app-post-gallery',
  templateUrl: './post-gallery.component.html',
  styleUrls: ['./post-gallery.component.scss'],
})
export class PostGalleryComponent implements OnInit, OnDestroy {
  @ViewChild('postComp') postCompRef: PostComponent;
  loginSubscription: Subscription;
  masonryOptions = {};
  allPosts: DashboardPost[];
  isLoggedIn: boolean;
  gridLayout: boolean = false;
  pageIndex = 1;
  pageSize = 12;
  isLoading: boolean = true;
  reachedEnd: boolean = false;
  loadingMore: boolean = false;
  userId: string;
  followingPostsFinished: boolean = false;
  selectedPostId: string;
  forceRefreshPost: boolean = false;
  updateMasonryLayout: boolean = false;
  saveLoaderMap: Map<string,boolean> = new Map();
  category: string | null;
  constructor(
    private dashboardService: DashboardService,
    private sharedService: SharedService,
    private postService: PostService,
    private dialogRef: MatDialog,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.sharedService.isLoggedIn();
    this.route.queryParamMap.subscribe((params) => {
      this.category = params.get('category');
      this.pageIndex = 1;
      this.allPosts = [];
      this.isLoading = true;
      this.getPosts();
    })
    this.loginSubscription = this.sharedService.isLoggedIn$.subscribe((res) => {
      this.isLoggedIn = res;
      this.pageIndex = 1;
      this.allPosts = [];
      this.isLoading = true;
      this.reachedEnd = false;
      this.followingPostsFinished = false;
      this.getPosts();
    });
    this.userId = this.sharedService.getUserId();
  }
  formatPostData(data: DashboardPost[] | any): DashboardPost[] {
    let formattedData: DashboardPost[] = [];
    if (data.length > 0) {
      data.forEach((ele: any) => {
        let postData = {
          id: ele.id,
          postTitle: ele.postTitle,
          postDesc: ele.postDesc,
          isLiked: ele.isLiked || false,
          isSaved: ele.isSaved || false,
          postDetails: ele.postDetails,
          userId: ele.userId,
          tags: ele.postTags || [],
          updatedAt: ele.updatedAt
        };
        if (this.allPosts && this.allPosts.length > 0) {
          this.allPosts.push(postData);
        } else {
          formattedData.push(postData);
        }
      });
    }
    return formattedData;
  }

  onSaveClick(event: PostLikeStatus) {
    if (!this.isLoggedIn) {
      let dialog = this.dialogRef.open(AuthPopupComponent, {
        data: { popupType: 'login' },
        maxWidth: 900,
        width: '95%',
        panelClass: 'dialog',
      });
      dialog.afterClosed().subscribe((result) => {
        if (result == 'DONE') {
          this.router.navigate([`post/${btoa(event.postId)}`]);
        }
      });
      return;
    }
    if(this.saveLoaderMap.get(event.postId) == true){
      return;
    }
    this.saveLoaderMap.set(event.postId, true);
    if (!event.isSaved) {
      this.postService
        .savePost({ postId: event.postId, ownerId: this.userId })
        .subscribe(
          (res) => {
            this.saveLoaderMap.set(event.postId, false);
          },
          (err) => {
            this.sharedService.showSnackError(err);
            this.saveLoaderMap.set(event.postId, false);
          }
        );
    } else {
      this.postService.unSavePost(event.postId).subscribe(
        (res) => {
          this.saveLoaderMap.set(event.postId, false);
        },
        (err) => {
          this.sharedService.showSnackError(err);
          this.saveLoaderMap.set(event.postId, false);
        }
      );
    }
  }
  onScroll() {
    if (this.reachedEnd || !this.allPosts || this.allPosts.length == 0) {
      return;
    }
    this.pageIndex++;
    this.loadingMore = true;
    this.getPosts();
  }

  getPosts() {
    if (!this.isLoggedIn) {
      this.dashboardService
        .getPosts(this.pageIndex, this.pageSize, this.category)
        .pipe()
        .subscribe((data: any) => {
          this.setData(data);
          this.loadingMore = false;
          this.isLoading = false;
        });
        return;
    }
    if (!this.followingPostsFinished) {
      this.dashboardService
        .getPostsOfFollowingForAuth(this.pageIndex, this.pageSize, this.category)
        .pipe()
        .subscribe((data: any) => {
          if (data.body && data.body.data && data.body.data.length == 0) {
            this.followingPostsFinished = true;
            this.pageIndex = 1;
            this.getPosts();
            return;
          }
          this.setData(data);
          this.isLoading = false;
        });
    } else {
      this.dashboardService
        .getPosts(this.pageIndex, this.pageSize, this.category)
        .pipe()
        .subscribe((data: any) => {
          this.setData(data);
          if (data.body && data.body.data && data.body.data.length == 0) {
            this.reachedEnd = true;
          }
          this.loadingMore = false;
          this.isLoading = false;
        });
    }
  }

  setData(data: any){
    if (this.allPosts && this.allPosts.length > 0) {
      this.formatPostData(data.body.data);
    } else {
      this.allPosts = data.body.data
        ? this.formatPostData(data.body.data)
        : [];
    }
    /** Masonry updates layout if it detects change in this variable */
    setTimeout(() => {
      this.updateMasonryLayout = false;
      setTimeout(() => {
        this.updateMasonryLayout = true;
      }, 100);
    }, 100);
  }

  onCardClick(postId: string){
    if(this.selectedPostId == postId){
      this.postCompRef.refreshData(postId);
    }
    this.selectedPostId = postId;
    document.body.classList.add('is-active');
  }

  closePost(){
    document.body.classList.remove('is-active');
  }

  ngOnDestroy(){
    this.loginSubscription.unsubscribe();
  }
}
