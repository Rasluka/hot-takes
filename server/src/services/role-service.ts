import { IRole } from '../models/interfaces';
import prisma from '../prisma';

export class RoleService {
  constructor() {}

  async getAll(): Promise<IRole[]> {
    const roles = await prisma.userRole.findMany();

    return roles;
  }

  async getById(id: string): Promise<IRole | null> {
    const role = await prisma.userRole.findUnique({
      where: { id: parseInt(id) },
    });

    return role;
  }

  async create(name: string): Promise<IRole> {
    const role = await prisma.userRole.create({ data: { name } });

    return role;
  }

  async updateById(id: string, name: string): Promise<IRole> {
    const role = await prisma.userRole.update({
      where: { id: parseInt(id) },
      data: { name },
    });

    return role;
  }

  async deleteById(id: string): Promise<IRole> {
    const role = await prisma.userRole.delete({
      where: { id: parseInt(id) },
    });

    return role;
  }
}
