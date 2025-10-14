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
    const users = await prisma.user.findMany({
      include: { role: true },
      orderBy: { id: 'asc' },
    });

    return users.map(formatUser);
  }

  async getById(userId: string): Promise<IUser | null> {
    const user = await prisma.user.findUnique({
      include: { role: true },
      where: { id: parseInt(userId) },
    });

    if (!user) {
      return null;
    }

    return formatUser(user);
  }

  async updateUserRole(userId: string, roleId: string): Promise<IUser> {
    const user = await prisma.user.update({
      where: { id: parseInt(userId) },
      data: { roleId: parseInt(roleId) },
      include: { role: true },
    });

    return formatUser(user);
  }

  async deleteById(userId: string): Promise<IUser> {
    const user = await prisma.user.delete({
      where: { id: parseInt(userId) },
      include: { role: true },
    });

    return formatUser(user);
  }
}
