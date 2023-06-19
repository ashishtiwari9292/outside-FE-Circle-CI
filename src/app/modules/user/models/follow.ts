export interface Follow {
  fullName: string;
  photoUrl: string;
  username: string;
}

export interface FollowList {
  count: number;
  data: Follow[];
}
