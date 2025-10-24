import { vi, Mock } from 'vitest';

interface PrismaModelMock {
  findMany: Mock;
  findUnique: Mock;
  create: Mock;
  update: Mock;
  delete: Mock;
}

export const createMockPrisma = (): PrismaModelMock => {
  return {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  };
};
