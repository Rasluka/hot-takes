import { Role } from './role';

export interface User {
  id: number;
  nickname: string;
  email: string;
  role: Role;
}

export interface UserDto {
  nickname: string;
  email: string;
  roleId?: number;
}

export interface UserSignInDto {
  nickname: string;
  code: string;
}

export interface UserCreationResult {
  user: User;
  code: string;
  emailSent?: boolean;
}

export interface UserSignInResult {
  user: User;
  token: string;
}
