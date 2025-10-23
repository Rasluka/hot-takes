import { beforeEach, describe, expect, it, vi } from 'vitest';
import { RoleService } from '../services/role.service';
import { NotFoundError } from '../errors/not-found.error';
import { Role } from '../types/role';

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

// Reset mocks before every test
beforeEach(() => {
  Object.values(mockPrisma.userRole).forEach((fn) => (fn as any).mockReset());
  service = new RoleService(mockPrisma as any);
});

describe('RoleService', () => {
  describe('getAll', () => {
    it('returns roles when found', async () => {
      const roles = [
        { id: 1, name: 'Admin' },
        { id: 2, name: 'User' },
      ];

      mockPrisma.userRole.findMany.mockResolvedValue(roles);

      const result = await service.getAll();
      expect(result).toEqual(roles);
    });

    it('throws NotFoundError if no roles', async () => {
      mockPrisma.userRole.findMany.mockResolvedValue([]);

      await expect(service.getAll()).rejects.toThrow(NotFoundError);
    });
  });

  describe('getById', () => {
    it('returns role when found', async () => {
      const role = { id: 1, name: 'Admin' };

      mockPrisma.userRole.findUnique.mockResolvedValue(role);
      const roleId = 1;

      const result = await service.getById(roleId);
      expect(result.name).toBe(role.name);
    });

    it('throws NotFoundError if no role exists with given id', async () => {
      mockPrisma.userRole.findUnique.mockResolvedValue(null);
      const roleId = 2;

      await expect(service.getById(roleId)).rejects.toThrow(NotFoundError);
    });
  });

  describe('create', () => {
    it('returns new role when created', async () => {
      const newRoleName = 'Superuser';
      const newRole: Role = { id: 3, name: newRoleName };

      mockPrisma.userRole.create.mockResolvedValue(newRole);

      const result = await service.create(newRoleName);

      expect(result).toEqual(newRole);
      expect(mockPrisma.userRole.create).toHaveBeenCalledWith({
        data: { name: newRoleName },
      });

      expect(mockPrisma.userRole.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('updateById', () => {
    it('returns updated role on success', async () => {
      const newRoleName: string = 'Updated role';
      const role: Role = { id: 1, name: 'Updated role' };

      mockPrisma.userRole.update.mockResolvedValue(role);

      const result = await service.updateById(1, newRoleName);

      expect(result.name).toBe(newRoleName);

      expect(mockPrisma.userRole.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { name: newRoleName },
      });

      expect(mockPrisma.userRole.update).toHaveBeenCalledTimes(1);
    });

    it('throws NotFoundError if no role exists with given id', async () => {
      mockPrisma.userRole.update.mockRejectedValue({ code: 'P2025' });

      await expect(service.updateById(2, 'Updated Name')).rejects.toThrow(
        NotFoundError,
      );

      expect(mockPrisma.userRole.update).toHaveBeenCalledWith({
        where: { id: 2 },
        data: { name: 'Updated Name' },
      });
      expect(mockPrisma.userRole.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('deleteById', () => {
    it('returns deleted role on success', async () => {
      const role: Role = { id: 1, name: 'Deleted role' };

      mockPrisma.userRole.delete.mockResolvedValue(role);

      const result = await service.deleteById(1);

      expect(result.id).toBe(1);

      expect(mockPrisma.userRole.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(mockPrisma.userRole.delete).toHaveBeenCalledTimes(1);
    });

    it('throws NotFoundError if no role exists with given id', async () => {
      mockPrisma.userRole.delete.mockRejectedValue({ code: 'P2025' });

      await expect(service.deleteById(3)).rejects.toThrow(NotFoundError);

      expect(mockPrisma.userRole.delete).toHaveBeenCalledWith({
        where: { id: 3 },
      });
      expect(mockPrisma.userRole.delete).toHaveBeenCalledTimes(1);
    });
  });
});
