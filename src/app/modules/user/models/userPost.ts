import { PostDetails } from "../../post/models/postData";

export interface UserPost {
  id: string;
  commentCount: number;
  isLiked: boolean;
  likeCount: number;
  postDesc: string;
  postTitle: string;
  postTags: string[];
  postDetails: PostDetails[];
  updatedDate: string;
  updatedAt: string;
  userInfo: {
    id?: string;
    fullName: string;
    isFollowed: boolean;
    profilePic: string;
    userName: string;
  };
}
