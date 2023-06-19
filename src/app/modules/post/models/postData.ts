export interface PostData {
  id: string;
  ownPost: boolean;
  postTitle: string;
  postDesc: string;
  isLiked: boolean;
  isSaved?: boolean;
  postDetails: PostDetails[];
  userId: string;
  likeCount: number;
  commentCount: number;
  postTags?: string[];
  updatedDate: string;
  updatedAt: string;
  postInfo: IPostInfo;
  userInfo: {
    id?: string;
    fullName: string;
    isFollowed: boolean;
    profilePic: string;
    userName: string;
  };
}

export interface IPostInfo {
  add_1: string;
  add_2: string;
  city: string;
  country: string;
  has_lodging: number;
  has_rv: number;
  has_tent: number;
  latitude: number;
  longitude: number;
  max_price: number;
  min_price: number;
  postal_code: number;
  sheetId: number;
  state: string;
}

export interface PostDetails {
  photoUrl: string;
  streamUrl: string;
  contentType?: string;
  redirectLink?: string;
}

export interface PostLikeStatus {
  postId: string;
  isLiked?: boolean;
  isSaved?: boolean;
}
