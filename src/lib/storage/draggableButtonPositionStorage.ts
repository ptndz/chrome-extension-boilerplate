import { createStorage } from './base';
import { StorageEnum } from './enums';
import type { DraggableButtonPositionStorage, Position } from './types';

const storage = createStorage<Position>(
  'draggableButtonPosition',
  {
    x: 1725,
    y: 345,
  },
  {
    storageEnum: StorageEnum.Local,
    liveUpdate: true,
  },
);

export const draggableButtonPositionStorage: DraggableButtonPositionStorage = {
  ...storage,
  setData: async (position: Position) => {
    await storage.set(position);
  },
};
