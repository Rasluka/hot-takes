import { Take } from '../generated/prisma';
import { NotFound } from '../errors/not-found';
import { PrismaClient } from '@prisma/client';

export class TakeService {
  constructor(private readonly prisma: PrismaClient) {}

  async getAll(): Promise<Take[]> {
    const takes = await this.prisma.take.findMany();

    return takes;
  }

  async getById(id: number): Promise<Take | null> {
    const take = await this.prisma.take.findUnique({
      where: { id: id },
    });

    if (!take) {
      throw new NotFound('Take not found!');
    }

    return take;
  }

  async create(content: string, createdBy: number): Promise<Take> {
    const take = await this.prisma.take.create({
      data: {
        content,
        createdBy,
      },
    });

    return take;
  }

  async updateById(id: number, content: string): Promise<Take> {
    try {
      return await this.prisma.take.update({
        where: { id },
        data: { content },
      });
    } catch (err: any) {
      if (err.code === 'P2025') throw new NotFound('Take not found!');
      throw err;
    }
  }

  async deleteById(id: number): Promise<Take> {
    try {
      return await this.prisma.take.delete({ where: { id } });
    } catch (err: any) {
      if (err.code === 'P2025') throw new NotFound('Take not found!');
      throw err;
    }
  }
}
