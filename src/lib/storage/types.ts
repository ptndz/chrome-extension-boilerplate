import type { StorageEnum } from './enums';

export type ValueOrUpdate<D> = D | ((prev: D) => Promise<D> | D);

export type BaseStorage<D> = {
  get: () => Promise<D>;
  set: (value: ValueOrUpdate<D>) => Promise<void>;
  getSnapshot: () => D | null;
  subscribe: (listener: () => void) => () => void;
};

export type Theme = 'light' | 'dark';

export interface Position {
  x: number;
  y: number;
}
export type DraggableButtonPositionStorage = BaseStorage<Position> & {
  setData: (position: Position) => Promise<void>;
};

export type ThemeStorage = BaseStorage<Theme> & {
  toggle: () => Promise<void>;
};

export interface User {
  id: string;
  email: string;
  name: string;
  image: string;
  username: string;
  role_id: string;
  updatedAt: Date;
  accessToken: string;
  refreshToken: string;
  verified: boolean;
  status: string;
  expires_in: number;
  accessTokenExpires: number;
}
export type UserStorage = BaseStorage<User> & {
  getAccessToken: () => Promise<string>;
  getRefreshToken: () => Promise<string>;
  setTokens: (
    accessToken: string,
    refreshToken: string,
    expires_in: number
  ) => Promise<void>;
  clear: () => Promise<void>;
  getUser: () => Promise<User>;
  setUser: (user: User) => Promise<void>;
  getAccessTokenExpires: () => Promise<number>;
};

export interface Bookmark {
  url: string;
  title: string;
  description?: string;
  image: string;
  tagIds?: number[];
}
export interface Media {
  id: number;
  url: string;
  name: string;
  size: number;
  type: string;
  disk: string;
  checksum: string;
  path: string;
  createAt: string;
  updateAt: string;
}
export type StorageConfig<D = string> = {
  /**
   * Assign the {@link StorageEnum} to use.
   * @default Local
   */
  storageEnum?: StorageEnum;
  /**
   * Only for {@link StorageEnum.Session}: Grant Content scripts access to storage area?
   * @default false
   */
  sessionAccessForContentScripts?: boolean;
  /**
   * Keeps state live in sync between all instances of the extension. Like between popup, side panel and content scripts.
   * To allow chrome background scripts to stay in sync as well, use {@link StorageEnum.Session} storage area with
   * {@link StorageConfig.sessionAccessForContentScripts} potentially also set to true.
   * @see https://stackoverflow.com/a/75637138/2763239
   * @default false
   */
  liveUpdate?: boolean;
  /**
   * An optional props for converting values from storage and into it.
   * @default undefined
   */
  serialization?: {
    /**
     * convert non-native values to string to be saved in storage
     */
    serialize: (value: D) => string;
    /**
     * convert string value from storage to non-native values
     */
    deserialize: (text: string) => D;
  };
};
