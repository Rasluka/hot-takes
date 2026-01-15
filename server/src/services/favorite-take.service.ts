import { PrismaClient } from '@prisma/client';
import { NotFoundError } from '../errors/not-found.error';
import { ConflictError } from '../errors/conflict.error';
import { mapTakeToResponseDto } from '../utils/format-take.util';
import { FavoriteAddDto } from '../dto/favorite-take/favorite-take-create.dto';
import { TakeResponseDto } from '../dto/take/take-response.dto';

export class FavoriteTakeService {
  constructor(private readonly prisma: PrismaClient) {}

  async getUserFavorites(userId: number): Promise<TakeResponseDto[]> {
    const takes = await this.prisma.take.findMany({
      where: {
        favoritedBy: { some: { userId } },
      },
      include: {
        user: {
          select: { id: true, nickname: true },
        },
      },
    });

    if (takes.length === 0) throw new NotFoundError('No favorite takes found!');

    return takes.map(mapTakeToResponseDto);
  }

  async addFavorite(
    userId: number,
    favoriteData: FavoriteAddDto,
  ): Promise<boolean> {
    try {
      await this.prisma.favoriteTake.create({
        data: { userId, takeId: favoriteData.takeId },
      });

      return true;
    } catch (err: any) {
      if (err?.code === 'P2003') {
        throw new ConflictError('User or take ID does not exist.');
      }

      if (err?.code === 'P2002') {
        throw new ConflictError('This take is already in your favorites.');
      }

      throw err;
    }
  }

  async removeFavorite(userId: number, takeId: number): Promise<void> {
    try {
      await this.prisma.favoriteTake.delete({
        where: {
          userId_takeId: {
            userId: userId,
            takeId: takeId,
          },
        },
      });
    } catch (err: any) {
      if (err?.code === 'P2025') {
        throw new NotFoundError(
          `Favorite not found for userId=${userId} and takeId=${takeId}`,
        );
      }

      throw err;
    }
  }
}
