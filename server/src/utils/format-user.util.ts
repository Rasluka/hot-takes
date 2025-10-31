import { User } from '../types/user';
import { User as PrismaUserModel } from '@prisma/client';

export function formatUser(
  user: PrismaUserModel & { role: { id: number; name: string } },
): User {
  return {
    id: user.id,
    nickname: user.nickname,
    email: user.email,
    role: {
      id: user.role.id,
      name: user.role.name,
    },
  };
}
