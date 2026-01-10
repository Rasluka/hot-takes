import type { UserType } from '@/types/user';
import type { SignInData, UserSignUpType, SignUpData } from '@/types/user';
import {
  mockEmailExistsError,
  mockNicknameExistsError,
} from '@/utils/mock-errors';

export const mockLogin = async (data: SignInData): Promise<UserType> => {
  await new Promise<void>((resolve: () => void) => setTimeout(resolve, 6000));
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
  await new Promise<void>((resolve: () => void) => setTimeout(resolve, 1000));
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

  if (data.nickname.includes('fail')) {
    throw mockNicknameExistsError();
  }

  if (data.email.includes('fail')) {
    throw mockEmailExistsError();
  }

  return mockUserSignUnResponse;
};
