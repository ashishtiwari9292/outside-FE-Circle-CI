// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  socketUrl: "https://api.outsideclouds.com/outside",
  socketioUrl: `https://api.outsideclouds.com/outside`,
  socket_port: "3000",
  cognitoUserPoolId: 'us-east-2_Ufe9SQj7i',
  cognitoAppClientId: '3mubp7j28p0ppurgavovnel3tr',
  apiUrl: 'https://api.outsideclouds.com/outside',
  // apiUrl: 'http://localhost:3000/api',
  endPoints: {
    CLEAR_NOTIFICATION: 'action/notification/clear',
    CLEAR_ALL_NOTIFICATION: 'action/notification/clear-all',
    DELETE_PHOTO: 'user/remove/image',
    FOLLOW: 'follow',
    GET_HEADER_PROFILE: 'user/header/profile/profile',
    GET_SIDEBAR_PROFILE: 'user/auth/sidebar/profile',
    GET_OWN_SIDEBAR_PROFILE: 'user/sidebar/profile',
    GET_FOLLOWERS: 'follow/followers',
    GET_FOLLOWING: 'follow/following',
    GET_PHOTOS: 'user/all/images',
    GET_SUGGESTED_USERS: 'suggested-users',
    GET_POST_DETAILS: 'post/auth/get',
    GET_SIMILAR_POST: 'post/auth/similar',
    GET_SAVED_POST: 'post/save',
    GET_MY_POST: 'post/my-post',
    GET_TIMELINE: 'post/timeline',
    GET_POSTS: 'post/auth/posts',
    GET_HOME_POST: 'post/auth/home-post',
    GET_HOME_POST_FOLLOWING: 'post/auth/home-post/following',
    GET_COMMENTS: 'action/comments',
    GET_NOTIFICATION: 'action/notification',
    LIKE: 'action/like',
    PROFILE: 'user/profile',
    POST_COMMENT: 'action/comment',
    DELETE_COMMENT: 'action/comment',
    READ_NOTIFICATION: 'action/readed',
    SEARCH_ALL: 'auth/search-all',
    SEARCH: 'search',
    POST_CREATE: 'post/create',
    POST_UPDATE: 'post/update',
    POST_DELETE: 'post/remove',
    POST_SAVE: 'post/save',
    USER_CREATE: 'user/create',
    USER_DELETE: 'user/delete',
    USER_UPDATE: 'user/update',
    UNIQUE_USERNAME: 'user/isUniqueUsername',
    UNFOLLOW: 'follow/unfollow',
    UNSET_PHOTO: 'user/unset/image',
    SET_PHOTO: 'user/set-current',
    SIGNED_URL: 'user/signed-url',
    TRENDING: 'trending',
  },
  endPointsUnauth: {
    GET_COMMENTS: 'action/comments',
    UNIQUE_USERNAME: 'user/isUniqueUsername',
    GET_SIDEBAR_PROFILE: 'user/sidebar/profile',
    PROFILE: 'user/profile',
    FOLLOW: 'follow',
    UNFOLLOW: 'follow/unfollow',
    GET_FOLLOWERS: 'follow/followers',
    GET_FOLLOWING: 'follow/following',
    GET_PHOTOS: 'user/all/images',
    SIGNED_URL: 'user/signed-url',
    GET_POST_DETAILS: 'post/get',
    GET_SIMILAR_POST: 'post/similar',
    GET_TIMELINE: 'post/timeline',
    GET_POSTS: 'post/posts',
    GET_HOME_POST: 'post/home-post',
    TRENDING: 'trending',
    SEARCH_ALL: 'search-all',
    SEARCH: 'search',
    USER_CREATE: 'user/create',
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
