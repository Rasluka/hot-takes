import { TakeEntity } from './take.entity';

export interface FavoriteTakeEntity {
  id: number;
  userId: number;
  takeId: number;
  take: TakeEntity;
}
