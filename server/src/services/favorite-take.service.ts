import { PrismaClient } from '@prisma/client';
import { FavoriteTake, Take } from '../types/take';
import { NotFoundError } from '../errors/not-found.error';
import { ConflictError } from '../errors/conflict.error';

export class FavoriteTakeService {
  constructor(private readonly prisma: PrismaClient) {}

  async getUserFavorites(userId: number): Promise<Take[]> {
    const takes = await this.prisma.take.findMany({
      where: { favoritedBy: { some: { userId } } },
    });

    if (takes.length === 0) throw new NotFoundError('No favorite takes found!');

    return takes;
  }

  async addFavorite(userId: number, takeId: number): Promise<FavoriteTake> {
    try {
      return await this.prisma.favoriteTake.create({
        data: { userId, takeId },
        include: { take: true },
      });
    } catch (err: any) {
      if (err?.code === 'P2003') {
        throw new ConflictError('User or take ID does not exist.');
      }

      if (err?.code === 'P2002') {
        const testing = await this.prisma.favoriteTake.findMany();
        throw new ConflictError(
          `This takeId ${takeId} is already in your favorites ${userId} ==> ${JSON.stringify(testing)}`,
        );
      }

      throw err;
    }
  }

  async removeFavorite(userId: number, takeId: number): Promise<FavoriteTake> {
    try {
      return await this.prisma.favoriteTake.delete({
        where: {
          userId_takeId: {
            userId: userId,
            takeId: takeId,
          },
        },
        include: { take: true },
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
