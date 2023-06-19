export interface SavedPost {
  id: string;
  postTitle: string;
  postDesc: string;
  postId: string;
  isLiked?: boolean;
  isSaved?: boolean;
  updatedAt: string;
  redirectLink?: string;
  owner: {
    id: string;
    username: string;
    profileImage: string;
    contentType?: string;
  }
  postImages: [
    {
      url: string;
      contentType?: string;
    }
  ]
}

