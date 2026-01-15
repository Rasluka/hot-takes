import request from 'supertest';
import { beforeEach, afterAll, describe, it, expect, beforeAll } from 'vitest';
import prisma from '../../prisma';
import { generateJwtToken } from '../../utils/generate-token.util';
import app from '../../app';
import {
  seedStaticData,
  clearFavoriteTakes,
  seedFavoriteTakes,
  clearTestDb,
} from '../setup/seedHelpers';
const authCookie = `token=${generateJwtToken(1, 'Admin')}`;
const favTakeApiRoute: string = '/api/v1/favorites/takes';

beforeAll(async () => {
  await clearTestDb();
  await seedStaticData();
});

beforeEach(async () => {
  await clearFavoriteTakes();
});

afterAll(async () => {
  await clearTestDb();
  await prisma.$disconnect();
});

describe('FavoriteTake API Integration', () => {
  describe('POST /favorites/takes', () => {
    it('POST /favorites/takes → 201 when valid favorite data', async () => {
      const res = await request(app)
        .post(favTakeApiRoute)
        .send({ takeId: 2 })
        .set('Cookie', authCookie);
      expect(res.status).toBe(201);
    });

    it('POST /favorites/takes → 400 when invalid takeId', async () => {
      const res = await request(app)
        .post(favTakeApiRoute)
        .send({ takeId: 'abc' })
        .set('Cookie', authCookie);
      expect(res.status).toBe(400);
    });

    it('throws 401 error when missing auth token.', async () => {
      const res = await request(app).post(favTakeApiRoute).send({ takeId: 1 });
      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Access denied. No token provided.');
    });

    it('POST /favorites/takes → 409 when takeId not found', async () => {
      const res = await request(app)
        .post(favTakeApiRoute)
        .send({ takeId: 123 })
        .set('Cookie', authCookie);
      expect(res.status).toBe(409);
      expect(res.body.message).toBe('User or take ID does not exist.');
    });

    it('POST /favorites/takes → 409 when duplicate favorite', async () => {
      await seedFavoriteTakes();
      const res = await request(app)
        .post(favTakeApiRoute)
        .send({ takeId: 1 }) // TakeId 1 already added as favorite for userId 1 (when seeding)
        .set('Cookie', authCookie);
      expect(res.status).toBe(409);
      expect(res.body.message).toBe('This take is already in your favorites.');
    });
  });

  describe('GET /favorites/takes', () => {
    it('GET /favorites/takes → 200 when user has favorites', async () => {
      await seedFavoriteTakes();
      const res = await request(app)
        .get(favTakeApiRoute)
        .set('Cookie', authCookie);

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].id).toBe(1);
    });

    it('GET /favorites/takes → 404 when user has no favorites', async () => {
      // Creating a temp token for which user has not takes added as favorites
      const tempAuthToken = `token=${generateJwtToken(4, 'User')}`;

      const res = await request(app)
        .get(favTakeApiRoute)
        .set('Cookie', tempAuthToken);

      expect(res.status).toBe(404);
      expect(res.body.message).toBe('No favorite takes found!');
    });

    it('GET /favorites/takes → 401 when no auth token', async () => {
      const res = await request(app).get(favTakeApiRoute);

      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Access denied. No token provided.');
    });
  });

  describe('DELETE /favorites/takes/:takeId', () => {
    it('DELETE /favorites/takes/:takeId → 204 when favorite deleted', async () => {
      await seedFavoriteTakes();
      const res = await request(app)
        .delete(`${favTakeApiRoute}/1`)
        .set('Cookie', authCookie);

      expect(res.status).toBe(204);
    });

    it('DELETE /favorites/takes/:takeId → 400 when invalid takeId', async () => {
      const res = await request(app)
        .delete(`${favTakeApiRoute}/abc`)
        .set('Cookie', authCookie);

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Invalid Take ID.');
    });

    it('DELETE /favorites/takes/:takeId → 404 when favorite not found', async () => {
      await seedFavoriteTakes();
      const res = await request(app)
        .delete(`${favTakeApiRoute}/8`)
        .set('Cookie', authCookie);

      expect(res.status).toBe(404);
    });
  });
});
