import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { generateJwtToken } from '../../utils/generate-token.util';
// import { BadRequest } from '../../errors/bad-request.error';

const favoriteTakeApiRoute: string = '/api/v1/favorites/takes';
const authCookie = `token=${generateJwtToken(1, 'Admin')}`;

const { mockGetUserFavorites, mockAddFavorite, mockRemoveFavorite, mockTakes } =
  vi.hoisted(() => ({
    mockGetUserFavorites: vi.fn(),
    mockAddFavorite: vi.fn(),
    mockRemoveFavorite: vi.fn(),
    mockTakes: [
      {
        id: 1,
        content: 'Wow is overrated',
        createdAt: new Date('2025-10-15T00:49:37.866Z'),
        updatedAt: new Date('2025-10-15T00:52:29.412Z'),
        createdBy: {
          id: 1,
          nickname: 'testuser',
        },
      },
      {
        id: 2,
        content: 'Coca cola is healthy',
        createdAt: new Date('2025-10-15T00:50:02.229Z'),
        updatedAt: new Date('2025-10-15T00:50:02.229Z'),
        createdBy: {
          id: 1,
          nickname: 'testuser',
        },
      },
    ] as TakeResponseDto[],
  }));

vi.mock('../../services/favorite-take.service.ts', () => ({
  FavoriteTakeService: vi.fn().mockImplementation(() => ({
    getUserFavorites: mockGetUserFavorites,
    addFavorite: mockAddFavorite,
    removeFavorite: mockRemoveFavorite,
  })),
}));

import app from '../../app';
import { TakeResponseDto } from '../../dto/take/take-response.dto';
import { NotFoundError } from '../../errors/not-found.error';
import { BadRequest } from '../../errors/bad-request.error';

describe('FavoriteTakeController', () => {
  beforeEach(() => {
    mockAddFavorite.mockReset();
    mockGetUserFavorites.mockReset();
    mockRemoveFavorite.mockReset();
  });

  describe('POST /favorites/takes', () => {
    it('POST /favorites/takes → 201 when valid favorite data', async () => {
      mockAddFavorite.mockResolvedValue(undefined);

      const res = await request(app)
        .post(favoriteTakeApiRoute)
        .send({ takeId: 1 })
        .set('Cookie', authCookie);

      expect(res.status).toBe(201);
      expect(mockAddFavorite).toHaveBeenCalledTimes(1);
    });

    it('POST /favorites/takes → 400 when invalid takeId', async () => {
      const res = await request(app)
        .post(favoriteTakeApiRoute)
        .send({ takeId: 'as' })
        .set('Cookie', authCookie);

      expect(res.status).toBe(400);
      expect(mockAddFavorite).not.toHaveBeenCalled();
      expect(res.body.message).toContain('Validation failed: takeId:');
    });

    it('DELETE /favorites/takes → 401 when no auth token', async () => {
      const res = await request(app).delete(`${favoriteTakeApiRoute}/abc`);

      expect(res.status).toBe(401);
      expect(mockRemoveFavorite).not.toHaveBeenCalled();
      expect(res.body.message).toBe('Access denied. No token provided.');
    });

    it('DELETE /favorites/takes → 404 when favorite not found', async () => {
      mockRemoveFavorite.mockRejectedValue(
        new NotFoundError('Favorite not found.'),
      );

      const res = await request(app)
        .delete(`${favoriteTakeApiRoute}/1`)
        .set('Cookie', authCookie);

      expect(res.status).toBe(404);
      expect(res.body.message).toBe('Favorite not found.');
    });
  });
});
