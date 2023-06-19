import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { PostData, PostLikeStatus } from '../../modules/post/models/postData';
import { AuthPopupComponent } from '../auth/auth-popup/auth-popup.component';
import { DashboardPost } from '../post-gallery/models/dashboardPost';
import { ConfirmPopupComponent } from '../shared/confirm-popup/confirm-popup.component';
import { SharedService } from '../shared/shared.service';
import { UserService } from '../user/user.service';
import { AddPostModalComponent } from './add-post-modal/add-post-modal.component';
import { PostService } from './post.service';
import { Comment } from './models/comment';
import { Subscription } from 'rxjs';
import { SocketService } from 'src/app/common/services/socket.service';
import { getVideoUrl, isImage } from 'src/app/common/helpers/helpers';
import { Location } from '@angular/common';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
})
export class PostComponent implements OnInit, OnChanges, OnDestroy {
  /** Post */
  @Input() postId: string;
  @Input() className: string;
  loginSubscription: Subscription;
  userDataSubscription: Subscription;
  isLoggedIn: boolean;
  loggedinUserData: any;
  isLoading: boolean = true;
  postData: PostData;
  isLiked: boolean;
  isFollowed: boolean;
  followLoader: boolean = false;
  saveLoader: boolean = false;
  postLikeLoader: boolean = false;
  commentLikeLoaderMap: Map<string, boolean> = new Map();
  isSaved: boolean;
  FourOFour: boolean = false;
  userId: string;
  userProfilePic: string;
  likeCount: number;
  ownPost: boolean = false;
  showLink: boolean = false;
  isPostPage: boolean = false;
  /** Similar Post */
  similarPosts: DashboardPost[];
  gridLayout: boolean = false;
  reachedEnd: boolean = false;
  loadingMore: boolean = false;
  isLoadingSimilarPosts: boolean = true;
  pageIndexPost = 1;
  pageSizePost = 12;
  /** Comments */
  isLoadingComments: boolean = false;
  isLoadingMoreComments: boolean = false;
  isLoadingChildComments: boolean = false;
  deleteCommentLoader: Map<string, boolean> = new Map();
  loadingCommentId: string;
  commentInput: string = '';
  replyInput: string = '';
  addCommentLoader: boolean = false;
  addReplyLoader: boolean = false;
  totalComments: number = 0;
  parentComments: Comment[];
  pageIndexParentComment = 1;
  pageSizeParentComment = 2;
  shownCommentsCount = 2;
  shownChildCommentsCount = 0;
  parentCommentCount: number = 0;
  showReplyField: boolean[];
  gettingChildComments = new Map();
  pageIndexChildComment = 1;
  pageSizeChildComment = 5;

  slideConfig = {
    slidesToShow: 4,
    slidesToScroll: 1,
    infinite: false,
    responsive: [
      {
        breakpoint: 1199,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 575,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };
  selectedImageIndex: number = 0;
  test: any;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sharedService: SharedService,
    private postService: PostService,
    private userService: UserService,
    private dialogRef: MatDialog,
    private socketService: SocketService,
    private _location: Location
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit(): void {
    if (this.postId) {
      this.initData();
    }
    this.isLoggedIn = this.sharedService.isLoggedIn();
    this.loginSubscription = this.sharedService.isLoggedIn$.subscribe(
      (res: any) => {
        this.isLoggedIn = res;
        this.initData();
        if (!res) this.loggedinUserData = null;
      }
    );
    this.sharedService.userData$.subscribe((res: any) => {
      if (res.username) {
        this.loggedinUserData = res;
        this.userId = res.userId || this.userId;
        this.ownPost = this.userId == this.postData?.userInfo.id ? true : false;
      }
    });
    this.userId = this.sharedService.getUserId();
    this.route.params.subscribe((data) => {
      if (data.id) {
        this.postId = atob(data.id);
        this.isPostPage = true;
        this.initData();
      }
    });
    this.socketService.emitEvent('postRoom', { postId: this.postId });
    this.manageCommentSocket();
    this.managePostSocket();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.postId) {
      this.refreshData(changes.postId.currentValue);
    }
  }

  initData() {
    this.getPostDetailsWrapper();
    this.getSimilarPosts();
    this.getParentComments();
  }

  refreshData(postId: any) {
    this.postId = postId;
    this.isLoading = true;
    this.parentComments = [];
    this.similarPosts = [];
    this.socketService.emitEvent('postRoom', { postId: this.postId });
    this.initData();
  }

  manageCommentSocket() {
    this.socketService
      .listen('comment')
      .subscribe((res: { type: string; comment: Comment }) => {
        if (res.type == 'add') {
          if (res.comment.parentId && res.comment.parentId != '0') {
            this.parentComments.forEach((comment) => {
              if (comment.id === res.comment.parentId) {
                comment?.childComments?.length
                  ? comment.childComments.unshift(res.comment)
                  : (comment.childComments = [res.comment]);
              }
              return comment;
            });
          } else {
            this.parentCommentCount++;
            this.shownCommentsCount >= 2 ? '' : this.shownCommentsCount++;
            this.parentComments?.unshift(res.comment);
            if (this.parentComments.length > 2) {
              this.parentComments.pop();
            }
          }
          this.totalComments++;
        } else if (res.type == 'delete') {
          // if(res.comment.parentId && res.comment.parentId != '0'){
          //   this.parentComments.forEach((comment) => {
          //     if(comment.id === res.comment.parentId){
          //       let index = comment.childComments.findIndex((comment) => comment.id === res.comment.id);
          //       comment.childComments[index] = res.comment;
          //     }
          //     return comment;
          //   })
          // }else {
          //   this.parentComments = this.parentComments.filter((comment) => comment.id != res.comment.id);
          // }
          // this.totalComments--;
        } else if (res.type == 'update') {
          if (res.comment.parentId && res.comment.parentId != '0') {
            this.parentComments.forEach((comment) => {
              if (comment.id === res.comment.parentId) {
                let index = comment.childComments.findIndex(
                  (comment) => comment.id === res.comment.id
                );
                comment.childComments[index] = res.comment;
              }
              return comment;
            });
          } else {
            this.parentComments[
              this.parentComments.findIndex(
                (comment) => comment.id === res.comment.id
              )
            ] = res.comment;
          }
        } else if (res.type == 'commentLike') {
          if (res.comment.parentId && res.comment.parentId != '0') {
            this.parentComments.forEach((comment) => {
              if (comment.id === res.comment.parentId) {
                let index = comment.childComments.findIndex(
                  (comment) => comment.id === res.comment.id
                );
                comment.childComments[index].likeCount = res.comment.likeCount;
              }
              return comment;
            });
          } else {
            this.parentComments[
              this.parentComments.findIndex(
                (comment) => comment.id === res.comment.commentId
              )
            ].likeCount = res.comment.likeCount;
          }
        }
      });
  }

  managePostSocket() {
    this.socketService
      .listen('postLike')
      .subscribe((res: { postId: string; likeCount: number }) => {
        if (this.postId === res.postId) {
          this.likeCount = res.likeCount;
        }
      });
  }

  onLike() {
    try {
      if (!this.isLoggedIn) {
        this.showAuthPopup();
        return;
      }
      if (this.postLikeLoader) {
        return;
      }
      this.postLikeLoader = true;
      if (this.postId) {
        if (!this.isLiked) {
          this.postService
            .likePost({ actionOn: 'post', postId: this.postId })
            .subscribe(
              (res: any) => {
                this.postLikeLoader = false;
              },
              (err) => {
                this.sharedService.showSnackError(err);
              }
            );
          this.likeCount++;
        } else {
          this.postService
            .unLikePost({ actionOn: 'post', postId: this.postId })
            .subscribe(
              (res: any) => {
                this.postLikeLoader = false;
              },
              (err) => {
                this.sharedService.showSnackError(err);
              }
            );
          this.likeCount != 0 ? this.likeCount-- : this.likeCount;
        }
        this.isLiked = !this.isLiked;
      }
    } catch (err) {
      console.log(err);
    }
  }
  onSave() {
    try {
      if (this.saveLoader) return;
      if (!this.isLoggedIn) {
        this.showAuthPopup();
        return;
      }
      this.saveLoader = true;
      if (!this.isSaved) {
        this.postService
          .savePost({ postId: this.postId, ownerId: this.postData.userInfo.id })
          .subscribe(
            (res: any) => {
              this.isSaved = !this.isSaved;
              this.saveLoader = false;
            },
            (err) => {
              this.sharedService.showSnackError(err);
              this.saveLoader = false;
            }
          );
      } else {
        this.postService.unSavePost(this.postId).subscribe(
          (res: any) => {
            this.saveLoader = false;
          },
          (err) => {
            this.sharedService.showSnackError(err);
            this.saveLoader = false;
          }
        );
      }
    } catch (err) {
      console.log(err);
    }
  }
  onFollow() {
    try {
      if (!this.isLoggedIn) {
        this.showAuthPopup();
        return;
      }
      this.followLoader = true;
      if (!this.isFollowed) {
        this.userService.followUser(this.postData.userInfo.id).subscribe(
          (res: any) => {
            console.log(res);
            this.followLoader = false;
            this.isFollowed = !this.isFollowed;
          },
          (err) => {
            this.sharedService.showSnackError(err);
            console.log(err);
            this.followLoader = false;
          }
        );
      } else {
        this.userService.unFollowUser(this.postData.userInfo.id).subscribe(
          (res: any) => {
            console.log(res);
            this.followLoader = false;
            this.isFollowed = !this.isFollowed;
          },
          (err) => {
            this.sharedService.showSnackError(err);
            console.log(err);
            this.followLoader = false;
          }
        );
      }
    } catch (err) {
      console.log(err);
    }
  }

  showAuthPopup() {
    this.dialogRef.open(AuthPopupComponent, {
      data: { popupType: 'login' },
      maxWidth: 900,
      width: '95%',
      panelClass: 'dialog',
    });
  }

  editPost() {
    let dialog = this.dialogRef.open(AddPostModalComponent, {
      data: { type: 'edit', post: { ...this.postData, id: this.postId } },
      maxWidth: 500,
      width: '95%',
      panelClass: 'dialog',
    });
    dialog.afterClosed().subscribe((result) => {
      if (result == 'DONE') {
        this.isLoading = true;
        this.getPostDetailsWrapper();
      }
    });
  }

  deletePost() {
    let dialog = this.dialogRef.open(ConfirmPopupComponent, {
      data: { type: 'edit', post: this.postData },
      maxWidth: 500,
      width: '95%',
      panelClass: 'dialog',
    });
    dialog.afterClosed().subscribe((result) => {
      if (result == 'YES') {
        this.isLoading = true;
        this.postService.deletePost(this.postId).subscribe(
          (res: any) => {
            this.isLoading = false;
            if (this.isPostPage) {
              this._location.back();
            }
          },
          (err) => {
            this.isLoading = false;
            this.sharedService.showSnackError(err);
            console.log(err);
          }
        );
      }
    });
  }

  getPostDetailsWrapper() {
    this.FourOFour = false;
    this.postService.getPostDetails(this.postId).subscribe(
      (res: any) => {
        this.setData(res);
        this.isLoading = false;
      },
      (err) => {
        if (err?.error?.message == 'failed to find post') {
          this.FourOFour = true;
        }
        this.isLoading = false;
      }
    );
  }

  setData(res: any) {
    if (res.error) {
      this.FourOFour = true;
    }
    if (res.body && this.isLoggedIn) {
      this.postData = { ...res.body };
      this.isLiked = this.postData.isLiked || false;
      this.isFollowed = this.postData.userInfo.isFollowed || false;
      this.isSaved = this.postData.isSaved || false;
      this.likeCount = this.postData.likeCount;
      this.totalComments = this.postData.commentCount;
      this.ownPost = this.userId == this.postData.userInfo.id ? true : false;
    } else if (res.body && !this.isLoggedIn) {
      this.postData = {
        ...res.body,
        postDetails: res.body.postDetails,
      };
      this.likeCount = this.postData.likeCount;
      this.totalComments = this.postData.commentCount;
    }
  }

  getSimilarPosts() {
    this.postService
      .getSimilarPosts(this.postId, this.pageIndexPost, this.pageSizePost)
      .subscribe(
        (res: any) => {
          this.isLoadingSimilarPosts = false;
          this.loadingMore = false;
          if (res.body.data?.length == 0) {
            this.reachedEnd = true;
            return;
          }
          this.similarPosts = res.body.data
            ? this.formatPostData(res.body.data)
            : this.similarPosts;
        },
        (err) => {
          console.log(err);
          this.isLoadingSimilarPosts = false;
          this.loadingMore = false;
        }
      );
  }

  onScroll() {
    if (
      this.reachedEnd ||
      !this.similarPosts ||
      this.similarPosts.length == 0
    ) {
      return;
    }
    this.pageIndexPost++;
    this.loadingMore = true;
    this.getSimilarPosts();
  }

  formatPostData(data: DashboardPost[] | any): DashboardPost[] {
    let formattedData: DashboardPost[] = [];
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
        updatedAt: ele.updatedAt || ele.updatedDate,
      };
      if (this.similarPosts && this.similarPosts.length > 0) {
        this.similarPosts.push(postData);
      } else {
        formattedData.push(postData);
      }
    });
    if (this.similarPosts && this.similarPosts.length > 0) {
      return this.similarPosts;
    }
    return formattedData;
  }

  onSaveClick(event: PostLikeStatus) {
    if (!this.isLoggedIn) {
      this.showAuthPopup();
      return;
    }
    if (!event.isSaved) {
      this.postService
        .savePost({ postId: event.postId, ownerId: this.userId })
        .subscribe(
          (res: any) => {
            console.log(res);
          },
          (err) => {
            this.sharedService.showSnackError(err);
            console.log(err);
          }
        );
    } else {
      this.postService.unSavePost(event.postId).subscribe(
        (res: any) => {
          console.log(res);
        },
        (err) => {
          this.sharedService.showSnackError(err);
          console.log(err);
        }
      );
    }
  }

  getParentComments(loadMore: boolean = false) {
    if (loadMore) {
      this.isLoadingMoreComments = true;
    } else {
      this.isLoadingComments = true;
    }
    this.postService
      .getParentComments(
        this.postId,
        this.pageIndexParentComment,
        this.pageSizeParentComment,
        this.userId
      )
      .subscribe(
        (res: any) => {
          this.isLoadingComments = false;
          this.isLoadingMoreComments = false;
          if (res.result) {
            if (this.parentComments) {
              this.parentComments = [
                ...this.parentComments,
                ...res.result.data,
              ];
            } else {
              this.parentComments = res.result.data;
            }
            this.parentCommentCount = res.result.totalLength;
            this.showReplyField = this.showReplyField
              ? this.showReplyField
              : new Array(this.parentCommentCount).fill(false);
          }
        },
        (err) => {
          this.isLoadingMoreComments = false;
          this.isLoadingComments = false;
          console.log(err);
        }
      );
  }

  getChildComments(parentId: string, pageIndex: number, pageSize: number) {
    this.isLoadingChildComments = true;
    this.loadingCommentId = parentId;
    this.postService
      .getChildComments(this.postId, parentId, pageIndex, pageSize, this.userId)
      .subscribe(
        (res: any) => {
          this.isLoadingChildComments = false;
          this.gettingChildComments.delete(parentId);
          if (res.result) {
            this.parentComments = this.parentComments.map((ele) => {
              if (ele.id == parentId) {
                if (ele.childComments) {
                  ele.childComments = [
                    ...ele.childComments,
                    ...res.result.data,
                  ];
                } else {
                  ele.childComments = res.result.data;
                }
                ele.pageIndex += 5;
              }
              return ele;
            });
          }
        },
        (err) => {
          this.gettingChildComments.delete(parentId);
          this.isLoadingChildComments = false;
          console.log(err);
        }
      );
  }

  loadParentComments() {
    this.pageIndexParentComment++;
    this.shownCommentsCount += 2;
    this.getParentComments(true);
  }

  loadChildComments(
    parentId: string,
    pageIndex: number = this.pageIndexChildComment,
    pageSize: number = this.pageSizeChildComment,
    index: number = -1,
    reset: boolean = false
  ) {
    if (this.gettingChildComments.get(parentId)) {
      return;
    } else {
      this.gettingChildComments.set(parentId, 1);
    }
    if (index != -1) {
      if (!this.showReplyField[index]) {
        this.showReplyField.fill(false);
        this.showReplyField[index] = true;
        this.shownChildCommentsCount += 5;
      } else {
        this.showReplyField.fill(false);
        this.shownChildCommentsCount -= 5;
      }
    }
    if (reset) {
      this.parentComments.forEach((ele) => {
        if (ele.id == parentId) {
          ele.childComments = [];
        }
      });
    }
    this.getChildComments(parentId, pageIndex, pageSize);
    if (index == -1) {
      this.shownChildCommentsCount += 5;
    }
    this.pageIndexChildComment++;
  }

  onCommentLike(
    id: string,
    isParent: boolean,
    indexParent: number,
    indexChild: number = 0
  ) {
    // store child comments and parent comments in hierarchy
    try {
      if (!this.isLoggedIn) {
        this.showAuthPopup();
        return;
      }
      if (this.commentLikeLoaderMap.get(id) == true) {
        return;
      }
      let isLiked = false;
      this.commentLikeLoaderMap.set(id, true);
      if (isParent) {
        isLiked = this.parentComments[indexParent].isLiked;
        isLiked
          ? this.parentComments[indexParent].likeCount--
          : this.parentComments[indexParent].likeCount++;
        this.parentComments[indexParent].isLiked =
          !this.parentComments[indexParent].isLiked;
      } else if (
        this.parentComments.length > 0 &&
        this.parentComments[indexParent] &&
        this.parentComments[indexParent].childComments &&
        this.parentComments[indexParent].childComments.length
      ) {
        isLiked =
          this.parentComments[indexParent].childComments[indexChild].isLiked;
        isLiked
          ? this.parentComments[indexParent].childComments[indexChild]
              .likeCount--
          : this.parentComments[indexParent].childComments[indexChild]
              .likeCount++;
        this.parentComments[indexParent].childComments[indexChild].isLiked =
          !this.parentComments[indexParent].childComments[indexChild].isLiked;
      }

      if (this.postId) {
        if (!isLiked) {
          this.postService
            .likeComment({
              commentId: id,
              actionOn: 'comment',
              postId: this.postId,
            })
            .subscribe(
              (res: any) => {
                this.commentLikeLoaderMap.set(id, false);
              },
              (err) => {
                this.sharedService.showSnackError(err);
                this.commentLikeLoaderMap.set(id, false);
              }
            );
        } else {
          this.postService
            .unLikeComment({
              actionOn: 'post',
              postId: this.postId,
            })
            .subscribe(
              (res: any) => {
                this.commentLikeLoaderMap.set(id, false);
              },
              (err) => {
                this.sharedService.showSnackError(err);
                this.commentLikeLoaderMap.set(id, false);
              }
            );
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  postComment() {
    if (!this.isLoggedIn) {
      this.showAuthPopup();
      return;
    }
    this.commentInput = this.commentInput.trim();
    if (this.commentInput === '') {
      return;
    }
    this.addCommentLoader = true;
    this.postService
      .postComment({
        actionOn: 'post',
        postId: this.postId,
        comment: this.commentInput,
      })
      .subscribe(
        (res: any) => {
          this.addCommentLoader = false;
          if (res.result) {
            // this.parentComments.unshift({
            //   id: res.result.id,
            //   comment: this.commentInput,
            //   commentCount: 0,
            //   likeCount: 0,
            //   profilePic:
            //     this.loggedinUserData.profilePic ||
            //     'assets/images/skelton-man-lg.png',
            //   updatedAt: res.result.updatedAt,
            //   username: this.loggedinUserData.username,
            //   pageIndex: 1,
            //   pageSize: 2,
            //   isLiked: false,
            //   childComments: [],
            // });
            // this.parentCommentCount++;
          }
          // if (this.parentComments.length > 2) {
          //   this.parentComments.pop();
          // }
          // this.totalComments++;
          this.commentInput = '';
        },
        (err) => {
          this.addCommentLoader = false;
          this.sharedService.showSnackError(err);
          console.log(err);
        }
      );
  }

  postReply(parentId: string, pageIndex: number, pageSize: number) {
    if (!this.isLoggedIn) {
      this.showAuthPopup();
      return;
    }
    this.replyInput = this.replyInput.trim();
    if (this.replyInput === '') {
      return;
    }
    this.addReplyLoader = true;
    this.postService
      .postComment({
        actionOn: 'post',
        postId: this.postId,
        comment: this.replyInput,
        parentId: parentId,
      })
      .subscribe(
        (res: any) => {
          if (!pageIndex) pageIndex = 1;
          if (!pageSize) pageSize = 5;
          this.addReplyLoader = false;
          this.parentComments = this.parentComments.map((ele) => {
            if (ele.id == parentId) {
              ele.commentCount++;
              if (res.result) {
                // ele.childComments.unshift({
                //   id: res.result.id,
                //   comment: this.replyInput,
                //   commentCount: 0,
                //   likeCount: 0,
                //   profilePic:
                //     this.loggedinUserData.profilePic ||
                //     'assets/images/skelton-man-lg.png',
                //   updatedAt: res.result.updatedAt,
                //   username: this.loggedinUserData.username,
                //   pageIndex: 1,
                //   pageSize: 2,
                //   isLiked: false,
                //   childComments: [],
                // });
                // if (ele.childComments.length > 5) {
                //   ele.childComments.pop();
                // }
              }
            }
            return ele;
          });
          this.totalComments++;
          this.replyInput = '';
        },
        (err) => {
          this.addReplyLoader = false;
          this.sharedService.showSnackError(err);
          console.log(err);
        }
      );
  }

  onUserClick(username?: string) {
    if (username) {
      this.router.navigate([`user/${username}`]);
    }
  }

  deleteComment(id: string) {
    if (this.deleteCommentLoader.get(id) == true) {
      return;
    }
    this.deleteCommentLoader.set(id, true);
    this.postService.deleteComment({ id, postId: this.postId }).subscribe(
      (res) => {
        this.deleteCommentLoader.set(id, false);
        if (res) {
          this.totalComments--;
          this.parentComments = [];
          this.pageIndexParentComment = 1;
          this.shownChildCommentsCount = 0;
          // this.shownCommentsCount = 0;
          this.getParentComments();
        }
      },
      (err) => {
        this.deleteCommentLoader.set(id, false);
        console.log(err);
      }
    );
  }

  redirectToUrl(link: string | undefined) {
    if (link) {
      window.open(link);
    }
  }

  ngOnDestroy() {
    this.loginSubscription.unsubscribe();
    this.socketService.removeAllListeners('comment');
    this.socketService.removeAllListeners('postLike');
  }

  getVideoUrl() {
    return getVideoUrl(this.postData.postDetails[0], this.postData.updatedDate);
  }

  closePost() {
    document.body.classList.remove('is-active');
  }

  isImage(url: string) {
    return isImage(url);
  }

  selectedImage(index: number) {
    this.selectedImageIndex = index;
  }

  arrowClick(type: string) {
    if ('next' === type) {
      if (this.selectedImageIndex < this.postData.postDetails.length - 1) {
        this.selectedImageIndex++;
      }
    } else {
      if (this.selectedImageIndex > 0) {
        this.selectedImageIndex--;
      }
    }
  }
}
