import { userStorage } from '../lib/storage';
import type { User } from '../lib/storage/types';
import { Get, Post } from './request';
export const getUserInfo = (disableErrorNotification?: boolean) => {
  return Get<User>('/auth/me', { disableErrorNotification });
};

export const login = (username: string, password: string) => {
  return Post<User>('/auth/login', {
    username: username,
    password: password,
  });
};
export const refreshAccessToken = async () => {
  const refreshToken = await userStorage.getRefreshToken();

  return Post<User>('/auth/refresh-token', {
    refreshToken: refreshToken,
  });
};
