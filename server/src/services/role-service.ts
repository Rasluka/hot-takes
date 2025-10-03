import { IRole } from '../models/interfaces';
import prisma from '../prisma';

export class RoleService {
  constructor() {}

  async getAll(): Promise<IRole[]> {
    const roles = await prisma.user_roles.findMany();

    return roles;
  }

  async getById(id: string): Promise<IRole | null> {
    const role = await prisma.user_roles.findUnique({
      where: { id: parseInt(id) },
    });

    return role;
  }

  async create(name: string): Promise<IRole> {
    const role = await prisma.user_roles.create({ data: { name } });

    return role;
  }

  async updateById(id: string, name: string): Promise<IRole> {
    const role = await prisma.user_roles.update({
      where: { id: parseInt(id) },
      data: { name },
    });

    return role;
  }

  async deleteById(id: string): Promise<IRole> {
    const role = await prisma.user_roles.delete({
      where: { id: parseInt(id) },
    });

    return role;
  }
}
