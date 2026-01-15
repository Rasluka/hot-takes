import { TakeResponseDto } from '../take/take-response.dto';

export interface FavoriteTakeResponseDto {
  id: number;
  userId: number;
  takeId: number;
  take: TakeResponseDto;
}
