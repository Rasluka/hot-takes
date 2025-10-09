import { IUser } from '../models/interfaces';
import prisma from '../prisma';
import { formatUser } from '../utils/format-user';
import { ISignUpResult } from '../models/interfaces';
import { createUser } from '../utils/create-user';
import { sendCodeEmail } from './email-service';

export class UserService {
  constructor() {}

  async createUser(
    nickname: string,
    email: string,
    roleId: string,
  ): Promise<ISignUpResult & { emailSent: boolean }> {
    const signUpRes: ISignUpResult = await createUser(
      nickname,
      email,
      parseInt(roleId),
    );
    let emailSent = true;

    try {
      await sendCodeEmail(email, nickname, signUpRes.code);
    } catch (err) {
      emailSent = false;
    }

    return { ...signUpRes, emailSent };
  }

  async getAll(): Promise<IUser[]> {
    const users = await prisma.users.findMany({
      include: { user_roles: true },
      orderBy: { id: 'asc' },
    });

    return users.map(formatUser);
  }

  async getById(userId: string): Promise<IUser | null> {
    const user = await prisma.users.findUnique({
      include: { user_roles: true },
      where: { id: parseInt(userId) },
    });

    if (!user) {
      return null;
    }

    return formatUser(user);
  }

  async updateUserRole(userId: string, roleId: string): Promise<IUser> {
    const user = await prisma.users.update({
      where: { id: parseInt(userId) },
      data: { role_id: parseInt(roleId) },
      include: { user_roles: true },
    });

    return formatUser(user);
  }

  async deleteById(userId: string): Promise<IUser> {
    const user = await prisma.users.delete({
      where: { id: parseInt(userId) },
      include: { user_roles: true },
    });

    return formatUser(user);
  }
}
