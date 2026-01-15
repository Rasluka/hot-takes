import { TakeUpdateDto } from './../dto/take/take-update.dto';
import { PrismaClient } from '@prisma/client';
import { NotFoundError } from '../errors/not-found.error';
import { TakeResponseDto } from '../dto/take/take-response.dto';
import { TakeCreateDto } from '../dto/take/take-create.dto';
import { mapTakeToResponseDto } from '../utils/format-take.util';

export class TakeService {
  constructor(private readonly prisma: PrismaClient) {}

  async getAll(): Promise<TakeResponseDto[]> {
    const takes = await this.prisma.take.findMany({
      include: {
        user: {
          select: {
            id: true,
            nickname: true,
          },
        },
      },
    });

    if (takes.length === 0) throw new NotFoundError('No takes found!');

    return takes.map(mapTakeToResponseDto);
  }

  async getById(id: number): Promise<TakeResponseDto> {
    const take = await this.prisma.take.findUnique({
      where: { id: id },
      include: {
        user: {
          select: {
            id: true,
            nickname: true,
          },
        },
      },
    });

    if (!take) throw new NotFoundError('Take not found!');

    return mapTakeToResponseDto(take);
  }

  async create(
    takeData: TakeCreateDto,
    createdBy: number,
  ): Promise<TakeResponseDto> {
    const take = await this.prisma.take.create({
      data: {
        content: takeData.content,
        createdBy,
      },
      include: {
        user: {
          select: {
            id: true,
            nickname: true,
          },
        },
      },
    });

    return mapTakeToResponseDto(take);
  }

  async updateById(
    id: number,
    takeData: TakeUpdateDto,
  ): Promise<TakeResponseDto> {
    try {
      const take = await this.prisma.take.update({
        where: { id },
        data: { content: takeData.content },
        include: {
          user: {
            select: {
              id: true,
              nickname: true,
            },
          },
        },
      });

      return mapTakeToResponseDto(take);
    } catch (err: any) {
      if (err.code === 'P2025') throw new NotFoundError('Take not found!');
      throw err;
    }
  }

  async deleteById(id: number): Promise<TakeResponseDto> {
    try {
      const take = await this.prisma.take.delete({
        where: { id },
        include: {
          user: {
            select: {
              id: true,
              nickname: true,
            },
          },
        },
      });

      return mapTakeToResponseDto(take);
    } catch (err: any) {
      if (err.code === 'P2025') throw new NotFoundError('Take not found!');
      throw err;
    }
  }
}
