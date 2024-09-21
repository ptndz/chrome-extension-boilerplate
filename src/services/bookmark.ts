import type { Bookmark } from '../lib/storage/types';
import { Post } from './request';
export const saveBookmark = (data: Bookmark) => {
  return Post<Bookmark>('/bookmarks', data);
};
