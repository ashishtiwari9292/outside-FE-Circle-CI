export interface User {
  id: string;
  username: string;
  fullName: string;
  email: string;
  isActive?: boolean;
  dob?: string;
  about?: string;
  location?: string;
  relationship?:string;
  profilePic?: string;
  coverPic?: string;
  followersCount?: number;
  postCount?: number;
  followingCount?: number;
}
