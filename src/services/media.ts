import { Media } from '../lib/storage/types';
import { Post } from './request';

export const uploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append('files', file);

  return await Post<Media[]>('/files', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
