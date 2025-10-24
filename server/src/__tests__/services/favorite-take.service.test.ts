import { beforeEach, describe, expect, it } from 'vitest';
import { FavoriteTakeService } from '../../services/favorite-take.service';
import { createMockPrisma } from '../setup/mock.prisma';
import { FavoriteTake, Take } from '../../types/take';
import { NotFoundError } from '../../errors/not-found.error';
import { ConflictError } from '../../errors/conflict.error';

const mockPrisma = {
  favoriteTake: createMockPrisma(),
  take: createMockPrisma(),
};

const mockedTakes: Take[] = [
  {
    id: 1,
    content: 'Wow is overrated (Updated from API)',
    createdAt: new Date('2025-10-15T00:49:37.866Z'),
    updatedAt: new Date('2025-10-15T00:52:29.412Z'),
    createdBy: 2,
  },
  {
    id: 2,
    content: 'Coca cola is healthy. (Updated from API)',
    createdAt: new Date('2025-10-15T00:50:02.229Z'),
    updatedAt: new Date('2025-10-15T00:50:02.229Z'),
    createdBy: 2,
  },
];

const mockedFavoriteTake: FavoriteTake = {
  id: 1,
  userId: 1,
  takeId: 2,
  take: mockedTakes[0],
};

let service: FavoriteTakeService;

beforeEach(() => {
  Object.values(mockPrisma).forEach((model) =>
    Object.values(model).forEach((fn) => fn.mockReset()),
  );

  service = new FavoriteTakeService(mockPrisma as any);
});

describe('FavoriteTakeService', () => {
  describe('getUserFavorites', () => {
    it('returns all takes added as favorite by a user', async () => {
      mockPrisma.take.findMany.mockResolvedValue(mockedTakes);

      const results = await service.getUserFavorites(1);

      expect(results).toEqual(mockedTakes);
      expect(mockPrisma.take.findMany).toHaveBeenCalledTimes(1);
      expect(mockPrisma.take.findMany).toHaveBeenCalledWith({
        where: { favoritedBy: { some: { userId: 1 } } },
      });
    });

    it('throws NotFoundError if no takes found', async () => {
      mockPrisma.take.findMany.mockResolvedValue([]);

      await expect(service.getUserFavorites(1)).rejects.toBeInstanceOf(
        NotFoundError,
      );
    });
  });

  describe('addFavorite', () => {
    it('returns new favorite when created', async () => {
      mockPrisma.favoriteTake.create.mockResolvedValue(mockedFavoriteTake);

      const result = await service.addFavorite(1, 2);

      expect(result.take).toEqual(mockedTakes[0]);
      expect(mockPrisma.favoriteTake.create).toHaveBeenCalledTimes(1);
      expect(mockPrisma.favoriteTake.create).toHaveBeenCalledWith({
        data: { userId: 1, takeId: 2 },
        include: { take: true },
      });
    });

    it('throws ConflictError if userId or takeId doesnt exists', async () => {
      mockPrisma.favoriteTake.create.mockRejectedValue({ code: 'P2003' });

      const promise = service.addFavorite(1, 133);
      await expect(promise).rejects.toBeInstanceOf(ConflictError);
      await expect(promise).rejects.toThrow('User or take ID does not exist.');
      expect(mockPrisma.favoriteTake.create).toHaveBeenCalledTimes(1);
      expect(mockPrisma.favoriteTake.create).toHaveBeenCalledWith({
        data: { userId: 1, takeId: 133 },
        include: { take: true },
      });
    });
  });

  describe('removeFavorite', () => {
    it('returns favorite when deleted', async () => {
      mockPrisma.favoriteTake.delete.mockResolvedValue(mockedFavoriteTake);

      const result = await service.removeFavorite(1, 2);

      expect(result.take).toEqual(mockedTakes[0]);
      expect(mockPrisma.favoriteTake.delete).toHaveBeenCalledTimes(1);
      expect(mockPrisma.favoriteTake.delete).toHaveBeenCalledWith({
        where: {
          userId_takeId: {
            userId: 1,
            takeId: 2,
          },
        },
        include: { take: true },
      });
    });

    it('throws NotFoundError if userId or takeId doesnt exists', async () => {
      mockPrisma.favoriteTake.delete.mockRejectedValue({ code: 'P2025' });

      const promise = service.removeFavorite(1, 133);
      await expect(promise).rejects.toBeInstanceOf(NotFoundError);
      await expect(promise).rejects.toThrow(
        `Favorite not found for userId=${1} and takeId=${133}`,
      );
      expect(mockPrisma.favoriteTake.delete).toHaveBeenCalledTimes(1);
      expect(mockPrisma.favoriteTake.delete).toHaveBeenCalledWith({
        where: {
          userId_takeId: {
            userId: 1,
            takeId: 133,
          },
        },
        include: { take: true },
      });
    });
  });
});
