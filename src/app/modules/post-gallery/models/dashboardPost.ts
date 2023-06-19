import { PostDetails } from "../../post/models/postData";

export interface DashboardPost {
  id: string;
  postTitle: string;
  postDesc: string;
  isLiked: boolean;
  isSaved?: boolean;
  updatedAt: string;
  postDetails: PostDetails[];
  userId: string;
  postTags? : string[];
}
