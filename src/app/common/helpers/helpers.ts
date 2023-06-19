import { PostDetails } from 'src/app/modules/post/models/postData';

export const debounce = (func: any, self: any, timeout = 300) => {
  return (...args: any[]) => {
    clearTimeout(self.timer);
    self.timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
};

export const closeSideBar = () => {
  document.body.className = document.body.className.replace(
    ' activesidebar',
    ''
  );
};

export const getVideoUrl = (postDetails: PostDetails, updatedAt: string) => {
  if (new Date().getTime() - new Date(updatedAt).getTime() > 60000) {
    return postDetails.streamUrl;
  }
  return postDetails.photoUrl;
};

export const isImage = (url: string) => {
  return url.match(/(.jpg|.png|.svg|.jpeg)/g) ? true : false;
}
