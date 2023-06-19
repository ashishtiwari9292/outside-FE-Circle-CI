export interface Comment {
  id: string;
  commentId?: string;
  comment: string;
  commentCount: number;
  likeCount: number;
  profilePic: string;
  updatedAt: string;
  username: string;
  pageIndex: number;
  pageSize: number;
  isLiked: boolean;
  parentId?: string;
  childComments: Comment[];
}