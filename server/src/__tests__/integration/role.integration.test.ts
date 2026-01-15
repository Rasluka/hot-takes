import request from 'supertest';
import { afterAll, beforeEach, describe, expect, it } from 'vitest';
import app from '../../app';
import prisma from '../../prisma';
import { generateJwtToken } from '../../utils/generate-token.util';
import { clearTestDb } from '../setup/seedHelpers';

const authCookie = `token=${generateJwtToken(1, 'Admin')}`;
const roleApiRoute = '/api/v1/roles';

beforeEach(async () => {
  await clearTestDb();
});

afterAll(async () => {
  await clearTestDb();
  await prisma.$disconnect();
});

describe('Role API Integration', () => {
  describe('POST /roles', () => {
    it('POST /roles → 201 when valid role data', async () => {
      const res = await request(app)
        .post(roleApiRoute)
        .send({ name: 'Tester' })
        .set('Cookie', authCookie);

      expect(res.status).toBe(201);

      expect(res.body.data.name).toBe('Tester');
      const dbRole = await prisma.userRole.findUnique({
        where: { id: res.body.data.id },
      });
      expect(dbRole).not.toBeNull();
    });

    it('POST /roles → 400 when empty name', async () => {
      const res = await request(app)
        .post(roleApiRoute)
        .send({ name: '' })
        .set('Cookie', authCookie);

      expect(res.status).toBe(400);
    });

    it('POST /roles → 401 when no auth token', async () => {
      const res = await request(app)
        .post(roleApiRoute)
        .send({ name: 'Tester' });

      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Access denied. No token provided.');
    });
  });
});
