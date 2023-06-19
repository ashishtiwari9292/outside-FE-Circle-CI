import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { getVideoUrl, isImage } from 'src/app/common/helpers/helpers';
import { DashboardPost } from '../../post-gallery/models/dashboardPost';
import { PostData, PostLikeStatus } from '../../post/models/postData';
import { SavedPost } from '../../post/models/savedPost';
import { ImageCard } from '../models/image-card';
import { SearchedPost } from '../models/searched-post';

@Component({
  selector: 'app-image-card',
  templateUrl: './image-card.component.html',
  styleUrls: ['./image-card.component.scss'],
})
export class ImageCardComponent implements OnInit {
  @Input() dashboardPostData: DashboardPost;
  @Input() savedPostData: SavedPost;
  @Input() searchedPostData: SearchedPost;
  @Output() onSave = new EventEmitter<PostLikeStatus>();
  @Output() onClick = new EventEmitter();
  @Input() isSaved: boolean;
  @Input() isLoggedIn: boolean;
  @Input() bigPlayButton: boolean;
  @Input() saveLoader: boolean = false;
  @Input() fromWishList: boolean = false;
  imageCardData: ImageCard;
  autoplay = false;
  constructor() {}

  ngOnInit(): void {
    this.formatToImageCard();
  }

  formatToImageCard() {
    this.imageCardData = {
      postTitle: this.savedPostData
        ? this.savedPostData.postTitle
        : this.dashboardPostData
        ? this.dashboardPostData.postTitle
        : this.searchedPostData.postTitle,
      postDesc: this.savedPostData
        ? this.savedPostData.postDesc
        : this.dashboardPostData
        ? this.dashboardPostData.postDesc
        : this.searchedPostData.postDesc,
      postId: this.savedPostData
        ? btoa(this.savedPostData.postId)
        : this.dashboardPostData
        ? btoa(this.dashboardPostData.id)
        : btoa(this.searchedPostData.id),
      updatedAt: this.savedPostData
        ? this.savedPostData.updatedAt
        : this.dashboardPostData
        ? this.dashboardPostData.updatedAt
        : this.searchedPostData.updatedAt,
      photoUrl: this.savedPostData
        ? this.savedPostData?.postImages[0]?.url
        : this.dashboardPostData && this.dashboardPostData.postDetails && this.dashboardPostData.postDetails.length > 0
        ? this.dashboardPostData.postDetails[0].photoUrl
        : this.searchedPostData ? this.searchedPostData.photoUrl: '',
      streamUrl: this.savedPostData
        ? this.savedPostData?.postImages[0]?.url
        : this.dashboardPostData && this.dashboardPostData.postDetails && this.dashboardPostData.postDetails.length > 0
        ? this.dashboardPostData.postDetails[0].streamUrl
        : this.searchedPostData ? this.searchedPostData.streamUrl: '',
      contentType: this.savedPostData
        ? this.savedPostData?.postImages[0]?.contentType
        : this.dashboardPostData && this.dashboardPostData.postDetails && this.dashboardPostData.postDetails.length > 0
        ? this.dashboardPostData.postDetails[0].contentType
        : this.searchedPostData ? this.searchedPostData.contentType: ''
    };
  }

  onSaveClick(postId: string) {
    postId = atob(postId);
    this.onSave.emit({ isSaved: this.isSaved, postId });
    if (this.isLoggedIn) {
      this.isSaved = !this.isSaved;
    }
  }

  getVideoUrl(){
    return getVideoUrl(this.imageCardData, this.imageCardData.updatedAt)
  }

  onCardClick(postId: string){
    this.onClick.emit(atob(postId));
  }

  onMouseHover(leave = false){
    if(leave){
      this.autoplay = false;
    }else{
      this.autoplay = true;
    }
  }

  isImage(url: string){
    return isImage(url);
  }
}
