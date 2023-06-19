export interface UserProfileWidget {
  fullName: string;
  username: string;
  profilePic: string;
  followersCount?: number;
  postCount?: number;
  followingCount?: number;
  coverPic?: string;
  id: string;
}