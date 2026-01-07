import type { UserType } from '../types/user';
import type { SignInData, UserSignUpType, SignUpData } from '../types/user';

export const mockLogin = async (data: SignInData): Promise<UserType> => {
  // eslint-disable-next-line @typescript-eslint/typedef
  await new Promise((resolve) => setTimeout(resolve, 800));
  const mockUser: UserType = {
    id: 2,
    nickname: 'jorgeo',
    email: 'vargklee@hotmail.com',
    role: { id: 1, name: 'Admin' },
  };

  if (data.code === '1234') {
    return mockUser;
  }

  throw new Error('Invalid credentials.');
};

export const mockSignUp = async (data: SignUpData): Promise<UserSignUpType> => {
  // eslint-disable-next-line @typescript-eslint/typedef
  await new Promise((resolve) => setTimeout(resolve, 5000));
  const mockUserSignUnResponse: UserSignUpType = {
    user: {
      id: 45,
      nickname: data.nickname,
      email: data.email,
      role: { id: 1, name: 'Admin' },
    },
    code: 'HEYJUDE5',
    emailSent: false,
  };

  if (data.nickname !== 'failed') {
    return mockUserSignUnResponse;
  }

  throw new Error('Invalid credentials.');
};
