import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../prisma';
import { formatUser } from '../utils/format-user';
import { ISignUpResult, IUser } from '../models/interfaces';
import { createUser } from '../utils/create-user';
import { sendCodeEmail } from './email-service';

interface SignInResult {
  user: IUser;
  token: string;
}

export class AuthService {
  private secretKey: string;

  constructor(secretKey: string) {
    this.secretKey = secretKey;
  }

  async signUp(
    nickname: string,
    email: string,
  ): Promise<ISignUpResult & { emailSent: boolean }> {
    const signUpRes: ISignUpResult = await createUser(nickname, email, 2);
    let emailSent = true;

    try {
      await sendCodeEmail(email, nickname, signUpRes.code);
    } catch (err) {
      emailSent = false;
    }

    return { ...signUpRes, emailSent };
  }

  async signIn(nickname: string, code: string): Promise<SignInResult> {
    const user = await prisma.users.findUnique({
      where: { nickname },
      include: { user_roles: true },
    });

    // Nickname doesnt exist
    if (!user) {
      throw new Error('Invalid credentials.');
    }

    const isValidCode = await bcrypt.compare(code, user.hashed_code);

    if (!isValidCode) {
      throw new Error('Invalid credentials.');
    }

    const formattedUser: IUser = formatUser(user);

    const token = jwt.sign(
      { userId: formattedUser.id, role: formattedUser.role },
      this.secretKey,
      {
        expiresIn: '5h',
      },
    );

    delete formattedUser.hashed_code;

    return { user: formattedUser, token };
  }
}
