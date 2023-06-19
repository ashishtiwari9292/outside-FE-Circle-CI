export interface Notification {
  id: string;
  type: string;
  username: string;
  description: string;
  isReaded: boolean;
  postId?: string;
  userId?: string;
  photo?: string;
}

