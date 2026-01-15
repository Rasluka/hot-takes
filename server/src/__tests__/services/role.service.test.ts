import { beforeEach, describe, expect, it, vi } from 'vitest';
import { RoleService } from '../../services/role.service';
import { NotFoundError } from '../../errors/not-found.error';
// import { BadRequest } from '../../errors/bad-request.error';
import { RoleResponseDto } from '../../dto/role/role-response.dto';
import { ConflictError } from '../../errors/conflict.error';

const mockPrisma = {
  userRole: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
};

let service: RoleService;

const roles: RoleResponseDto[] = [
  { id: 1, name: 'Admin' },
  { id: 2, name: 'User' },
];

// Reset mocks before every test
beforeEach(() => {
  Object.values(mockPrisma.userRole).forEach((fn) => (fn as any).mockReset());
  service = new RoleService(mockPrisma as any);
});

describe('RoleService', () => {
  describe('getAll', () => {
    it('getAll → 200 when roles found', async () => {
      mockPrisma.userRole.findMany.mockResolvedValue(roles);

      const result = await service.getAll();
      expect(result).toEqual(roles);
    });

    it('getAll → 404 when no roles', async () => {
      mockPrisma.userRole.findMany.mockResolvedValue([]);

      await expect(service.getAll()).rejects.toThrow(NotFoundError);
    });
  });

  describe('getById', () => {
    it('getById → 200 when role found', async () => {
      const role = { id: 1, name: 'Admin' };

      mockPrisma.userRole.findUnique.mockResolvedValue(role);
      const roleId = 1;

      const result = await service.getById(roleId);
      expect(result.name).toBe(role.name);
    });

    it('getById → 404 when role not found', async () => {
      mockPrisma.userRole.findUnique.mockResolvedValue(null);
      const roleId = 2;

      await expect(service.getById(roleId)).rejects.toThrow(NotFoundError);
    });
  });

  describe('create', () => {
    it('create → 200 when role created', async () => {
      const newRoleName = 'Superuser';
      const newRole: RoleResponseDto = { id: 3, name: newRoleName };

      mockPrisma.userRole.create.mockResolvedValue(newRole);

      const result = await service.create({ name: newRoleName });

      expect(result).toEqual(newRole);
      expect(mockPrisma.userRole.create).toHaveBeenCalledWith({
        data: { name: 'Superuser' },
      });
      expect(mockPrisma.userRole.create).toHaveBeenCalledTimes(1);
    });

    it('create → 409 when duplicate name', async () => {
      const duplicateError = {
        code: 'P2002',
        target: ['name'],
        meta: { target: ['name'] },
      };

      mockPrisma.userRole.create.mockRejectedValue(duplicateError);

      await expect(service.create({ name: 'Admin' })).rejects.toThrow(
        ConflictError,
      );
      await expect(service.create({ name: 'Admin' })).rejects.toThrow(
        'Duplicate role name.',
      );
    });
  });

  describe('updateById', () => {
    it('updateById → 200 when role updated', async () => {
      const newRoleName: string = 'Updated role';
      const role: RoleResponseDto = { id: 1, name: 'Updated role' };

      mockPrisma.userRole.update.mockResolvedValue(role);

      const result = await service.updateById(1, { name: newRoleName });

      expect(result.name).toBe(newRoleName);

      expect(mockPrisma.userRole.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { name: 'Updated role' },
      });

      expect(mockPrisma.userRole.update).toHaveBeenCalledTimes(1);
    });

    it('updateById → 404 when role not found', async () => {
      mockPrisma.userRole.update.mockRejectedValue({ code: 'P2025' });

      await expect(
        service.updateById(2, { name: 'Updated Name' }),
      ).rejects.toThrow(NotFoundError);

      expect(mockPrisma.userRole.update).toHaveBeenCalledWith({
        where: { id: 2 },
        data: { name: 'Updated Name' },
      });
      expect(mockPrisma.userRole.update).toHaveBeenCalledTimes(1);
    });

    it('updateById → 409 when duplicate name', async () => {
      const duplicateError = {
        code: 'P2002',
        target: ['name'],
        meta: { target: ['name'] },
      };

      mockPrisma.userRole.update.mockRejectedValue(duplicateError);

      await expect(
        service.updateById(1, { name: 'ExistingName' }),
      ).rejects.toThrow(ConflictError);
    });
  });

  describe('deleteById', () => {
    it('deleteById → 200 when role deleted', async () => {
      const role: RoleResponseDto = { id: 1, name: 'Deleted role' };

      mockPrisma.userRole.delete.mockResolvedValue(role);

      const result = await service.deleteById(1);

      expect(result.id).toBe(1);

      expect(mockPrisma.userRole.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(mockPrisma.userRole.delete).toHaveBeenCalledTimes(1);
    });

    it('deleteById → 404 when role not found', async () => {
      mockPrisma.userRole.delete.mockRejectedValue({ code: 'P2025' });

      await expect(service.deleteById(3)).rejects.toThrow(NotFoundError);

      expect(mockPrisma.userRole.delete).toHaveBeenCalledWith({
        where: { id: 3 },
      });
      expect(mockPrisma.userRole.delete).toHaveBeenCalledTimes(1);
    });
  });
});
