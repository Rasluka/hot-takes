import request from 'supertest';
import { afterAll, beforeEach, describe, expect, it } from 'vitest';
import app from '../../app';
import prisma from '../../prisma';
import { generateJwtToken } from '../../utils/generate-token.util';

const authCookie = `token=${generateJwtToken(1, 'Admin')}`;
const roleApiRoute = '/api/v1/roles';

beforeEach(async () => {
  await prisma.userRole.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('Role API Integration', () => {
  describe('POST /roles', () => {
    it('creates a new role and returns it', async () => {
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

    it('throws 400 error if no role name is provided.', async () => {
      const res = await request(app)
        .post(roleApiRoute)
        .send({ name: '' })
        .set('Cookie', authCookie);

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Role name is required.');
    });

    it('throws 401 error when missing auth token.', async () => {
      const res = await request(app)
        .post(roleApiRoute)
        .send({ name: 'Tester' });

      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Access denied. No token provided.');
    });
  });
});
