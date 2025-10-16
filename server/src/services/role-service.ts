import { PrismaClient } from '@prisma/client';
import { Role } from '../types/role';
import { NotFoundError } from '../errors/not-found-error';

export class RoleService {
  constructor(private readonly prisma: PrismaClient) {}

  async getAll(): Promise<Role[]> {
    const roles = await this.prisma.userRole.findMany();

    if (roles.length === 0) throw new NotFoundError('No roles found!');

    return roles;
  }

  async getById(id: number): Promise<Role> {
    const role = await this.prisma.userRole.findUnique({
      where: { id: id },
    });

    if (!role) throw new NotFoundError('Role not found!');

    return role;
  }

  async create(name: string): Promise<Role> {
    return this.prisma.userRole.create({ data: { name } });
  }

  async updateById(id: number, name: string): Promise<Role> {
    try {
      return await this.prisma.userRole.update({
        where: { id },
        data: { name },
      });
    } catch (err: any) {
      if (err.code === 'P2025') throw new NotFoundError('Role not found!');
      throw err;
    }
  }

  async deleteById(id: number): Promise<Role> {
    try {
      return await this.prisma.userRole.delete({ where: { id } });
    } catch (err: any) {
      if (err.code === 'P2025') throw new NotFoundError('Role not found!');
      throw err;
    }
  }
}
