import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Role } from '../../types/role';
import { generateJwtToken } from '../../utils/generate-token.util';

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
    ] as Role[],
  };
});

vi.mock('../services/role.service', () => ({
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
    it('returns all roles', async () => {
      mockGetAll.mockResolvedValue(mockRoles);

      const res = await request(app)
        .get(roleApiRoute)
        .set('Cookie', authCookie);

      expect(res.status).toBe(200);
      expect(res.body.data).toEqual(mockRoles);
    });

    it('throws 404 error if no roles found.', async () => {
      mockGetAll.mockRejectedValue(new NotFoundError('No roles found!'));

      const res = await request(app)
        .get(roleApiRoute)
        .set('Cookie', authCookie);

      expect(res.status).toBe(404);
    });
  });

  describe('GET /roles/:id', () => {
    it('returns role when found', async () => {
      mockGetById.mockResolvedValue(mockRoles[0]);

      const res = await request(app)
        .get(`${roleApiRoute}/${1}`)
        .set('Cookie', authCookie);

      expect(res.status).toBe(200);
      expect(res.body.data).toEqual(mockRoles[0]);
    });

    it('throws 404 error if no roles found.', async () => {
      mockGetById.mockRejectedValue(new NotFoundError('Role not found!'));

      const res = await request(app)
        .get(`${roleApiRoute}/${1}`)
        .set('Cookie', authCookie);

      expect(res.status).toBe(404);
    });

    it('throws 400 error if no valid roleId was provided.', async () => {
      const res = await request(app)
        .get(`${roleApiRoute}/asde`)
        .set('Cookie', authCookie);

      expect(res.status).toBe(400);
      expect(mockGetById).not.toHaveBeenCalled();
      expect(res.body.message).toBe('Invalid ID.');
    });
  });

  describe('POST /roles', () => {
    it('returns new role when created', async () => {
      mockCreate.mockResolvedValue(mockRoles[0]);

      const res = await request(app)
        .post(roleApiRoute)
        .send({ name: 'Admin' })
        .set('Cookie', authCookie);

      expect(res.status).toBe(201);
      expect(res.body.message).toBe('Role created successfully!');
      expect(res.body.data.name).toBe('Admin');
      expect(mockCreate).toHaveBeenCalledWith('Admin');
    });

    it('throws 400 error if no role name is provided.', async () => {
      const res = await request(app)
        .post(roleApiRoute)
        .send({})
        .set('Cookie', authCookie);

      expect(res.status).toBe(400);
      expect(mockCreate).not.toHaveBeenCalled();
      expect(res.body.message).toBe('Role name is required.');
    });
  });

  describe('PUT /roles/:id', () => {
    it('returns role when updated', async () => {
      mockUpdateById.mockResolvedValue(mockRoles[0]);
      const roleId = 1;

      const res = await request(app)
        .put(`${roleApiRoute}/${roleId}`)
        .send({ name: 'Admin' })
        .set('Cookie', authCookie);

      expect(res.status).toBe(200);
      expect(res.body.data.name).toBe('Admin');
      expect(mockUpdateById).toHaveBeenCalledWith(1, 'Admin');
      expect(mockUpdateById).toHaveBeenCalledTimes(1);
    });

    it('throws 400 error if no role name is provided.', async () => {
      const res = await request(app)
        .put(`${roleApiRoute}/1`)
        .send({ age: 2 })
        .set('Cookie', authCookie);

      expect(res.status).toBe(400);
      expect(mockUpdateById).not.toHaveBeenCalled();
      expect(res.body.message).toBe('Role name is required.');
    });

    it('throws 400 error if no roleId is provided.', async () => {
      const res = await request(app)
        .put(`${roleApiRoute}/one`)
        .send({ name: 'Admin' })
        .set('Cookie', authCookie);

      expect(res.status).toBe(400);
      expect(mockUpdateById).not.toHaveBeenCalled();
      expect(res.body.message).toBe('Invalid ID.');
    });

    it('throws 404 error if role not found when updating', async () => {
      mockUpdateById.mockRejectedValue(new NotFoundError('Role not found!'));

      const res = await request(app)
        .put(`${roleApiRoute}/1`)
        .send({ name: 'Admin' })
        .set('Cookie', authCookie);

      expect(res.status).toBe(404);
      expect(res.body.message).toBe('Role not found!');
    });

    it('returns 401 if no auth token is provided', async () => {
      const res = await request(app).get(roleApiRoute);
      expect(res.status).toBe(401);
    });
  });

  describe('DELETE /roles/:id', () => {
    it('returns role when deleted', async () => {
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

    it('throws 400 error if no roleId is provided.', async () => {
      const res = await request(app)
        .delete(`${roleApiRoute}/one`)
        .set('Cookie', authCookie);

      expect(res.status).toBe(400);
      expect(mockDeleteById).not.toHaveBeenCalled();
      expect(res.body.message).toBe('Invalid ID.');
    });
  });
});
