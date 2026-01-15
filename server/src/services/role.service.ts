import { PrismaClient } from '@prisma/client';
import { RoleResponseDto } from '../dto/role/role-response.dto';
import { NotFoundError } from '../errors/not-found.error';
import { RoleCreateDto } from '../dto/role/role-create.dto';
import { RoleUpdateDto } from '../dto/role/role-update.dto';
import { mapToRoleResponseDto } from '../utils/format-role.util';
import { ConflictError } from '../errors/conflict.error';

export class RoleService {
  constructor(private readonly prisma: PrismaClient) {}

  async getAll(): Promise<RoleResponseDto[]> {
    const roles = await this.prisma.userRole.findMany();

    if (roles.length === 0) throw new NotFoundError('No roles found!');

    return roles.map(mapToRoleResponseDto);
  }

  async getById(id: number): Promise<RoleResponseDto> {
    const role = await this.prisma.userRole.findUnique({
      where: { id: id },
    });

    if (!role) throw new NotFoundError('Role not found!');

    return mapToRoleResponseDto(role);
  }

  async create(roleData: RoleCreateDto): Promise<RoleResponseDto> {
    try {
      const role = await this.prisma.userRole.create({
        data: { name: roleData.name },
      });

      return mapToRoleResponseDto(role);
    } catch (err: any) {
      if (err.code === 'P2002') throw new ConflictError('Duplicate role name.');
      throw err;
    }
  }

  async updateById(
    id: number,
    roleData: RoleUpdateDto,
  ): Promise<RoleResponseDto> {
    try {
      const role = await this.prisma.userRole.update({
        where: { id },
        data: { name: roleData.name },
      });

      return mapToRoleResponseDto(role);
    } catch (err: any) {
      if (err.code === 'P2025') throw new NotFoundError('Role not found.');
      if (err.code === 'P2002') throw new ConflictError('Duplicate role name.');
      throw err;
    }
  }

  async deleteById(id: number): Promise<RoleResponseDto> {
    try {
      const role = await this.prisma.userRole.delete({ where: { id } });

      return mapToRoleResponseDto(role);
    } catch (err: any) {
      if (err.code === 'P2025') throw new NotFoundError('Role not found');
      throw err;
    }
  }
}
