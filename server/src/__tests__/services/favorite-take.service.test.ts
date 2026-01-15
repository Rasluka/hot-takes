import { beforeEach, describe, expect, it } from 'vitest';
import { FavoriteTakeService } from '../../services/favorite-take.service';
import { createMockPrisma } from '../setup/mock.prisma';
import { NotFoundError } from '../../errors/not-found.error';
import { ConflictError } from '../../errors/conflict.error';
import { TakeEntity } from '../../entities/take.entity';
import { TakeResponseDto } from '../../dto/take/take-response.dto';

const mockPrisma = {
  favoriteTake: createMockPrisma(),
  take: createMockPrisma(),
};

const mockedTakeEntities: TakeEntity[] = [
  {
    id: 1,
    content: 'Wow is overrated.',
    createdAt: new Date('2025-10-15T00:49:37.866Z'),
    updatedAt: new Date('2025-10-15T00:52:29.412Z'),
    createdBy: 1,
    user: {
      id: 1,
      nickname: 'testuser',
    },
  },
  {
    id: 2,
    content: 'Coca cola is healthy.',
    createdAt: new Date('2025-10-15T00:50:02.229Z'),
    updatedAt: new Date('2025-10-15T00:50:02.229Z'),
    createdBy: 1,
    user: {
      id: 1,
      nickname: 'testuser',
    },
  },
];

const mockedFavoriteTakes: TakeResponseDto[] = [
  {
    id: 1,
    content: 'Wow is overrated.',
    createdAt: new Date('2025-10-15T00:49:37.866Z'),
    updatedAt: new Date('2025-10-15T00:52:29.412Z'),
    createdBy: {
      id: 1,
      nickname: 'testuser',
    },
  },
  {
    id: 2,
    content: 'Coca cola is healthy.',
    createdAt: new Date('2025-10-15T00:50:02.229Z'),
    updatedAt: new Date('2025-10-15T00:50:02.229Z'),
    createdBy: {
      id: 1,
      nickname: 'testuser',
    },
  },
];

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
      mockPrisma.take.findMany.mockResolvedValue(mockedTakeEntities);

      const results = await service.getUserFavorites(1);

      expect(results).toEqual(mockedFavoriteTakes);
      expect(mockPrisma.take.findMany).toHaveBeenCalledTimes(1);
      expect(mockPrisma.take.findMany).toHaveBeenCalledWith({
        where: { favoritedBy: { some: { userId: 1 } } },
        include: {
          user: {
            select: { id: true, nickname: true },
          },
        },
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
      mockPrisma.favoriteTake.create.mockResolvedValue({});

      const result = await service.addFavorite(2, { takeId: 5 });

      expect(result).toEqual(true);
      expect(mockPrisma.favoriteTake.create).toHaveBeenCalledTimes(1);
      expect(mockPrisma.favoriteTake.create).toHaveBeenCalledWith({
        data: { userId: 2, takeId: 5 },
      });
    });

    it('throws ConflictError if userId or takeId doesnt exists', async () => {
      mockPrisma.favoriteTake.create.mockRejectedValue({ code: 'P2003' });

      const promise = service.addFavorite(1, { takeId: 133 });
      await expect(promise).rejects.toBeInstanceOf(ConflictError);
      await expect(promise).rejects.toThrow('User or take ID does not exist.');
      expect(mockPrisma.favoriteTake.create).toHaveBeenCalledTimes(1);
      expect(mockPrisma.favoriteTake.create).toHaveBeenCalledWith({
        data: { userId: 1, takeId: 133 },
      });
    });

    it('throws ConflictError if take was already added as favorite', async () => {
      mockPrisma.favoriteTake.create.mockRejectedValue({ code: 'P2002' });

      const promise = service.addFavorite(1, { takeId: 1 });
      await expect(promise).rejects.toBeInstanceOf(ConflictError);
      await expect(promise).rejects.toThrow(
        'This take is already in your favorites.',
      );
      expect(mockPrisma.favoriteTake.create).toHaveBeenCalledTimes(1);
      expect(mockPrisma.favoriteTake.create).toHaveBeenCalledWith({
        data: { userId: 1, takeId: 1 },
      });
    });
  });

  describe('removeFavorite', () => {
    it('returns favorite when deleted', async () => {
      mockPrisma.favoriteTake.delete.mockResolvedValue({});

      await service.removeFavorite(1, 2);

      expect(mockPrisma.favoriteTake.delete).toHaveBeenCalledTimes(1);
      expect(mockPrisma.favoriteTake.delete).toHaveBeenCalledWith({
        where: {
          userId_takeId: {
            userId: 1,
            takeId: 2,
          },
        },
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
      });
    });
  });
});
