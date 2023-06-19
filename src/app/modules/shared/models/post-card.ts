import { PostDetails } from "../../post/models/postData";

export interface PostCard {
  id: string;
  postTitle: string;
  postDesc: string;
  likeCount: number;
  isLiked: boolean;
  commentCount: number;
  updatedDate: string;
  postDetails: PostDetails[];
  userData: {
    profilePic: string;
    fullName: string;
    username: string;
  };
}
