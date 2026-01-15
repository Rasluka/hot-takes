import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { RoleResponseDto } from '../../dto/role/role-response.dto';
import { generateJwtToken } from '../../utils/generate-token.util';
// import { BadRequest } from '../../errors/bad-request.error';

const authCookie = `token=${generateJwtToken(1, 'Admin')}`;
const roleApiRoute = '/api/v1/roles';

const {
  mockGetAll,
  mockGetById,
  mockCreate,
  mockRoles,
  mockUpdateById,
  mockDeleteById,
} = vi.hoisted(() => {
  return {
    mockGetAll: vi.fn(),
    mockGetById: vi.fn(),
    mockCreate: vi.fn(),
    mockUpdateById: vi.fn(),
    mockDeleteById: vi.fn(),
    mockRoles: [
      { id: 1, name: 'Admin' },
      { id: 2, name: 'User' },
    ] as RoleResponseDto[],
  };
});

vi.mock('../../services/role.service.ts', () => ({
  RoleService: vi.fn().mockImplementation(() => ({
    getAll: mockGetAll,
    getById: mockGetById,
    create: mockCreate,
    updateById: mockUpdateById,
    deleteById: mockDeleteById,
  })),
}));

import app from '../../app';
import { NotFoundError } from '../../errors/not-found.error';

describe('RoleController', () => {
  beforeEach(() => {
    mockGetAll.mockReset();
    mockGetById.mockReset();
    mockCreate.mockReset();
    mockUpdateById.mockReset();
    mockDeleteById.mockReset();
  });

  describe('GET /roles', () => {
    it('GET /roles → 200 when roles exist', async () => {
      mockGetAll.mockResolvedValue(mockRoles);

      const res = await request(app)
        .get(roleApiRoute)
        .set('Cookie', authCookie);

      expect(res.status).toBe(200);
      expect(res.body.data).toEqual(mockRoles);
    });

    it('GET /roles → 404 when no roles found', async () => {
      mockGetAll.mockRejectedValue(new NotFoundError('No roles found!'));

      const res = await request(app)
        .get(roleApiRoute)
        .set('Cookie', authCookie);

      expect(res.status).toBe(404);
    });
  });

  describe('GET /roles/:id', () => {
    it('GET /roles/:id → 200 when valid role ID', async () => {
      mockGetById.mockResolvedValue(mockRoles[0]);

      const res = await request(app)
        .get(`${roleApiRoute}/${1}`)
        .set('Cookie', authCookie);

      expect(res.status).toBe(200);
      expect(res.body.data).toEqual(mockRoles[0]);
    });

    it('GET /roles/:id → 404 when role not found', async () => {
      mockGetById.mockRejectedValue(new NotFoundError('Role not found!'));

      const res = await request(app)
        .get(`${roleApiRoute}/${1}`)
        .set('Cookie', authCookie);

      expect(res.status).toBe(404);
    });

    it('GET /roles/:id → 400 when invalid ID format', async () => {
      const res = await request(app)
        .get(`${roleApiRoute}/asde`)
        .set('Cookie', authCookie);

      expect(res.status).toBe(400);
      expect(mockGetById).not.toHaveBeenCalled();
      expect(res.body.message).toBe('Invalid ID.');
    });
  });

  describe('POST /roles', () => {
    it('POST /roles → 201 when valid role data', async () => {
      mockCreate.mockResolvedValue(mockRoles[0]);

      const res = await request(app)
        .post(roleApiRoute)
        .send({ name: 'Admin' })
        .set('Cookie', authCookie);

      expect(res.status).toBe(201);
      expect(res.body.message).toBe('Role created successfully!');
      expect(res.body.data.name).toBe('Admin');
      expect(mockCreate).toHaveBeenCalledWith({ name: 'Admin' });
    });

    it('POST /roles → 400 when empty name', async () => {
      const res = await request(app)
        .post(roleApiRoute)
        .send({ name: '' })
        .set('Cookie', authCookie);

      expect(res.status).toBe(400);
      expect(mockCreate).not.toHaveBeenCalled();
      expect(res.body.message).toContain('Validation failed: name:');
    });

    it('POST /roles → 400 when name exceeds 50 characters', async () => {
      const res = await request(app)
        .post(roleApiRoute)
        .send({ name: 'a'.repeat(100) })
        .set('Cookie', authCookie);

      expect(res.status).toBe(400);
      expect(mockCreate).not.toHaveBeenCalled();
      expect(res.body.message).toContain('Validation failed: name:');
    });
  });

  describe('PATCH /roles/:id', () => {
    it('PATCH /roles/:id → 200 when valid update data', async () => {
      mockUpdateById.mockResolvedValue(mockRoles[0]);
      const roleId = 1;

      const res = await request(app)
        .patch(`${roleApiRoute}/${roleId}`)
        .send({ name: 'Admin' })
        .set('Cookie', authCookie);

      expect(res.status).toBe(200);
      expect(res.body.data.name).toBe('Admin');
      expect(mockUpdateById).toHaveBeenCalledWith(1, { name: 'Admin' });
      expect(mockUpdateById).toHaveBeenCalledTimes(1);
    });

    it('PATCH /roles/:id → 400 when invalid ID format', async () => {
      const res = await request(app)
        .patch(`${roleApiRoute}/one`)
        .send({ name: 'Admin' })
        .set('Cookie', authCookie);

      expect(res.status).toBe(400);
      expect(mockUpdateById).not.toHaveBeenCalled();
      expect(res.body.message).toBe('Invalid ID.');
    });

    it('PATCH /roles/:id → 404 when role not found', async () => {
      mockUpdateById.mockRejectedValue(new NotFoundError('Role not found!'));

      const res = await request(app)
        .patch(`${roleApiRoute}/2`)
        .send({ name: 'Admin' })
        .set('Cookie', authCookie);

      expect(res.status).toBe(404);
      expect(res.body.message).toBe('Role not found!');
    });

    it('GET /roles → 401 when no auth token', async () => {
      const res = await request(app).get(roleApiRoute);
      expect(res.status).toBe(401);
    });

    it('PATCH /roles/:id → 400 when empty name', async () => {
      const res = await request(app)
        .patch(`${roleApiRoute}/2`)
        .send({ name: '' })
        .set('Cookie', authCookie);

      expect(res.status).toBe(400);
      expect(mockUpdateById).not.toHaveBeenCalled();
      expect(res.body.message).toContain('Validation failed: name:');
    });

    it('PATCH /roles/:id → 400 when name exceeds 50 characters', async () => {
      const res = await request(app)
        .patch(`${roleApiRoute}/2`)
        .send({ name: 'a'.repeat(100) })
        .set('Cookie', authCookie);

      expect(res.status).toBe(400);
      expect(mockUpdateById).not.toHaveBeenCalled();
      expect(res.body.message).toContain('Validation failed: name:');
    });
  });

  describe('DELETE /roles/:id', () => {
    it('DELETE /roles/:id → 200 when valid role ID', async () => {
      mockDeleteById.mockResolvedValue(mockRoles[0]);
      const roleId = 1;

      const res = await request(app)
        .delete(`${roleApiRoute}/${roleId}`)
        .set('Cookie', authCookie);

      expect(res.status).toBe(200);
      expect(res.body.data.name).toBe('Admin');
      expect(mockDeleteById).toHaveBeenCalledWith(1);
      expect(mockDeleteById).toHaveBeenCalledTimes(1);
    });

    it('DELETE /roles/:id → 400 when invalid ID format', async () => {
      const res = await request(app)
        .delete(`${roleApiRoute}/one`)
        .set('Cookie', authCookie);

      expect(res.status).toBe(400);
      expect(mockDeleteById).not.toHaveBeenCalled();
      expect(res.body.message).toBe('Invalid ID.');
    });
  });
});
