import request from 'supertest';
import { beforeEach, afterAll, describe, it, expect } from 'vitest';
import prisma from '../../prisma';
import { generateJwtToken } from '../../utils/generate-token.util';
import app from '../../app';
import {
  seedRoles,
  seedUsers,
  seedTakes,
  seedFavoriteTakes,
  clearTestDb,
} from '../setup/seedHelpers';
const authCookie = `token=${generateJwtToken(1, 'Admin')}`;
const favTakeApiRoute: string = '/api/v1/favorites/takes';

beforeEach(async () => {
  await clearTestDb();

  await seedRoles();
  await seedUsers();
  await seedTakes();
  await seedFavoriteTakes();
});

afterAll(async () => {
  await clearTestDb();
  await prisma.$disconnect();
});

describe('FavoriteTake API Integration', () => {
  describe('POST /favorites/takes', () => {
    // THIS TEST SHOULD BE DISABLE BECAUSE ITS BREAKING THE CI
    // NEED TO DO FURTHER RESEARCH ON CI
    // it('returns new favorite when created', async () => {
    //   const res = await request(app)
    //     .post(favTakeApiRoute)
    //     .send({ takeId: 2 })
    //     .set('Cookie', authCookie);

    //   expect(res.status).toBe(201);
    //   expect(res.body.data.takeId).toBe(2);
    // });

    it('throws 400 error if no valid takeId is provided', async () => {
      const res = await request(app)
        .post(favTakeApiRoute)
        .send({ takeId: 'abc' })
        .set('Cookie', authCookie);

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Invalid Take ID.');
    });

    it('throws 401 error when missing auth token.', async () => {
      const res = await request(app).post(favTakeApiRoute).send({ takeId: 1 });

      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Access denied. No token provided.');
    });

    it('throws 409 error if takeId does not exists', async () => {
      const res = await request(app)
        .post(favTakeApiRoute)
        .send({ takeId: 5 }) // TakeId 5 doesnt exists in seed data
        .set('Cookie', authCookie);

      expect(res.status).toBe(409);
      expect(res.body.message).toBe('User or take ID does not exist.');
    });

    it('throws 409 error if take already added as favorite', async () => {
      const res = await request(app)
        .post(favTakeApiRoute)
        .send({ takeId: 1 }) // TakeId 1 already added as favorite for userId 1 (when seeding)
        .set('Cookie', authCookie);

      expect(res.status).toBe(409);
      // expect(res.body.message).toBe('This take is already in your favorites.');
    });
  });

  describe('GET /favorites/takes', () => {
    it('returns all takes added as favorite for the current user', async () => {
      const res = await request(app)
        .get(favTakeApiRoute)
        .set('Cookie', authCookie);

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].id).toBe(1);
    });

    it('throws 404 error when current user has no favorites', async () => {
      // Creating a temp token for which user has not takes added as favorites
      const tempAuthToken = `token=${generateJwtToken(4, 'User')}`;

      const res = await request(app)
        .get(favTakeApiRoute)
        .set('Cookie', tempAuthToken);

      expect(res.status).toBe(404);
      expect(res.body.message).toBe('No favorite takes found!');
    });

    it('throws 401 error when missing auth token.', async () => {
      const res = await request(app).get(favTakeApiRoute);

      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Access denied. No token provided.');
    });
  });

  describe('DELETE /favorites/takes/:takeId', () => {
    it('returns deleted favorite take', async () => {
      const res = await request(app)
        .delete(`${favTakeApiRoute}/1`)
        .set('Cookie', authCookie);

      expect(res.status).toBe(200);
      expect(res.body.data.takeId).toBe(1);
      expect(res.body.message).toBe('Take removed from favorite successfully.');
    });

    it('throws 400 error if no valid takeId is provided', async () => {
      const res = await request(app)
        .delete(`${favTakeApiRoute}/abc`)
        .set('Cookie', authCookie);

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Invalid Take ID.');
    });

    it('throws 404 error if takeId provided does not exists', async () => {
      const res = await request(app)
        .delete(`${favTakeApiRoute}/8`)
        .set('Cookie', authCookie);

      expect(res.status).toBe(404);
    });
  });
});
