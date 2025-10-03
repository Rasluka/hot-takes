// src/utils/formatUser.ts
import { IUser } from '../models/interfaces';
import { users as PrismaUser } from '../generated/prisma';

export function formatUser(
  user: PrismaUser & { user_roles: { id: number; name: string } },
): IUser {
  return {
    id: user.id,
    nickname: user.nickname,
    email: user.email,
    hashed_code: user.hashed_code,
    role_id: user.role_id,
    role: {
      id: user.user_roles.id,
      name: user.user_roles.name,
    },
  };
}
