import { PrismaClient } from '@prisma/client';
import { NotFoundError } from '../errors/not-found.error';
import { Take } from '../types/take';

export class TakeService {
  constructor(private readonly prisma: PrismaClient) {}

  async getAll(): Promise<Take[]> {
    const takes = await this.prisma.take.findMany();

    if (takes.length === 0) throw new NotFoundError('No roles found!');

    return takes;
  }

  async getById(id: number): Promise<Take> {
    const take = await this.prisma.take.findUnique({
      where: { id: id },
    });

    if (!take) throw new NotFoundError('Take not found!');

    return take;
  }

  async create(content: string, createdBy: number): Promise<Take> {
    return this.prisma.take.create({
      data: {
        content,
        createdBy,
      },
    });
  }

  async updateById(id: number, content: string): Promise<Take> {
    try {
      return this.prisma.take.update({
        where: { id },
        data: { content },
      });
    } catch (err: any) {
      if (err.code === 'P2025') throw new NotFoundError('Take not found!');
      throw err;
    }
  }

  async deleteById(id: number): Promise<Take> {
    try {
      return this.prisma.take.delete({ where: { id } });
    } catch (err: any) {
      if (err.code === 'P2025') throw new NotFoundError('Take not found!');
      throw err;
    }
  }
}
