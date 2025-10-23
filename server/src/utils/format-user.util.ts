import { User } from '../types/user';
import { User as PrismaUser } from '../generated/prisma';

export function formatUser(
  user: PrismaUser & { role: { id: number; name: string } },
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
