import { createStorage } from './base';
import { StorageEnum } from './enums';
import type { User, UserStorage } from './types';

const storage = createStorage<User>(
  'userStorage',
  {
    id: '',
    email: '',
    name: '',
    image: '',
    username: '',
    role_id: '',
    updatedAt: new Date(),
    accessToken: '',
    refreshToken: '',
    expires_in: 0,
    verified: false,
    status: '',
    accessTokenExpires: 0,
  },
  {
    storageEnum: StorageEnum.Local,
    liveUpdate: true,
  }
);

export const userStorage: UserStorage = {
  ...storage,
  getAccessToken: async () => {
    const user = await storage.get();
    return user.accessToken;
  },
  getRefreshToken: async () => {
    const user = await storage.get();
    return user.refreshToken;
  },
  setTokens: async (
    accessToken: string,
    refreshToken: string,
    expires_in: number
  ) => {
    await storage.set((user) => ({
      ...user,
      accessToken,
      refreshToken,
      expires_in,
      accessTokenExpires: Date.now() + expires_in * 1000,
    }));
  },
  clear: async () => {
    await storage.set({
      id: '',
      email: '',
      name: '',
      image: '',
      username: '',
      role_id: '',
      updatedAt: new Date(),
      accessToken: '',
      refreshToken: '',
      verified: false,
      status: '',
      expires_in: 0,
      accessTokenExpires: 0,
    });
  },
  getUser: async () => {
    const user = await storage.get();
    return user;
  },
  setUser: async (user: User) => {
    await storage.set({
      ...user,
      accessTokenExpires: Date.now() + user.expires_in * 1000,
    });
  },
  getAccessTokenExpires: async () => {
    const user = await storage.get();
    return user.accessTokenExpires;
  },
};
