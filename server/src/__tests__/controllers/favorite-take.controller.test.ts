import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { generateJwtToken } from '../../utils/generate-token.util';
import { BadRequest } from '../../errors/bad-request.error';

const favoriteTakeApiRoute: string = '/api/v1/favorites/takes';
const authCookie = `token=${generateJwtToken(1, 'Admin')}`;

const {
  mockGetUserFavorites,
  mockAddFavorite,
  mockRemoveFavorite,
  mockTakes,
  mockFavoriteTake,
} = vi.hoisted(() => ({
  mockGetUserFavorites: vi.fn(),
  mockAddFavorite: vi.fn(),
  mockRemoveFavorite: vi.fn(),
  mockTakes: [
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
  ] as Take[],
  mockFavoriteTake: {
    id: 1,
    userId: 1,
    takeId: 2,
    take: {
      id: 1,
      content: 'Wow is overrated (Updated from API)',
      createdAt: new Date('2025-10-15T00:49:37.866Z'),
      updatedAt: new Date('2025-10-15T00:52:29.412Z'),
      createdBy: 2,
    },
  },
}));

vi.mock('../../services/favorite-take.service.ts', () => ({
  FavoriteTakeService: vi.fn().mockImplementation(() => ({
    getUserFavorites: mockGetUserFavorites,
    addFavorite: mockAddFavorite,
    removeFavorite: mockRemoveFavorite,
  })),
}));

import app from '../../app';
import { Take } from '../../types/take';
import { NotFoundError } from '../../errors/not-found.error';

describe('FavoriteTakeController', () => {
  beforeEach(() => {
    mockAddFavorite.mockReset();
    mockGetUserFavorites.mockReset();
    mockRemoveFavorite.mockReset();
  });

  describe('POST /favorites/takes', () => {
    it('returns new favorite when created', async () => {
      mockAddFavorite.mockResolvedValue(mockFavoriteTake);

      const res = await request(app)
        .post(favoriteTakeApiRoute)
        .send({ takeId: 1 })
        .set('Cookie', authCookie);

      expect(res.status).toBe(201);
      expect(res.body.data.id).toEqual(mockFavoriteTake.id);
      expect(mockAddFavorite).toHaveBeenCalledTimes(1);
    });

    it('throws 400 error if no valid takeId is provided', async () => {
      const res = await request(app)
        .post(favoriteTakeApiRoute)
        .send({ takeId: 'as' })
        .set('Cookie', authCookie);

      expect(res.status).toBe(400);
      expect(mockAddFavorite).not.toHaveBeenCalled();
      expect(res.body.message).toBe('Invalid Take ID.');
    });

    it('throws 401 error if no valid token is provided', async () => {
      const res = await request(app)
        .post(favoriteTakeApiRoute)
        .send({ takeId: 1 });

      expect(res.status).toBe(401);
      expect(mockAddFavorite).not.toHaveBeenCalled();
      expect(res.body.message).toBe('Access denied. No token provided.');
    });
  });

  describe('GET /favorites/takes', () => {
    it('returns all takes added as favorite by a user', async () => {
      mockGetUserFavorites.mockResolvedValue(mockTakes);

      const res = await request(app)
        .get(favoriteTakeApiRoute)
        .set('Cookie', authCookie);

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(mockTakes.length);
      expect(mockGetUserFavorites).toHaveBeenCalledTimes(1);
    });

    it('throws 401 if no valid token is provided', async () => {
      const res = await request(app).get(favoriteTakeApiRoute);

      expect(res.status).toBe(401);
      expect(mockGetUserFavorites).not.toHaveBeenCalled();
      expect(res.body.message).toBe('Access denied. No token provided.');
    });

    it('throws 400 if service throws BadRequest', async () => {
      mockGetUserFavorites.mockRejectedValue(
        new BadRequest('Invalid User ID.'),
      );

      const res = await request(app)
        .get(favoriteTakeApiRoute)
        .set('Cookie', authCookie);

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Invalid User ID.');
    });
  });

  describe('DELETE /favorites/takes', () => {
    it('removes favorite successfully', async () => {
      mockRemoveFavorite.mockResolvedValue(mockFavoriteTake);

      const res = await request(app)
        .delete(`${favoriteTakeApiRoute}/1`)
        .set('Cookie', authCookie);

      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe(mockFavoriteTake.id);
      expect(mockRemoveFavorite).toHaveBeenCalledTimes(1);
    });

    it('throws 400 if invalid takeId is provided', async () => {
      const res = await request(app)
        .delete(`${favoriteTakeApiRoute}/abc`)
        .set('Cookie', authCookie);

      expect(res.status).toBe(400);
      expect(mockRemoveFavorite).not.toHaveBeenCalled();
      expect(res.body.message).toBe('Invalid Take ID.');
    });

    it('throws 401 error if no valid token is provided', async () => {
      const res = await request(app).delete(`${favoriteTakeApiRoute}/abc`);

      expect(res.status).toBe(401);
      expect(mockRemoveFavorite).not.toHaveBeenCalled();
      expect(res.body.message).toBe('Access denied. No token provided.');
    });

    it('throws 404 if favorite not found', async () => {
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
