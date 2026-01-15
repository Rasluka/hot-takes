import { FavoriteTakeEntity } from '../entities/favorite-take.entity';
import { FavoriteTakeResponseDto } from '../dto/favorite-take/favorite-take-response.dto';
import { mapTakeToResponseDto } from './format-take.util';

export function mapToFavoriteTakeResponseDto(
  favorite: FavoriteTakeEntity,
): FavoriteTakeResponseDto {
  return {
    id: favorite.id,
    userId: favorite.userId,
    takeId: favorite.takeId,
    take: mapTakeToResponseDto(favorite.take),
  };
}
