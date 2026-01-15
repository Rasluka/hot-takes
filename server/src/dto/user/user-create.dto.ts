import { UserResponseDto } from './user-response.dto';

export interface UserCreateDto {
  nickname: string;
  email: string;
  roleId?: number;
}

export interface UserCreateResponseDto {
  user: UserResponseDto;
  code: string;
  emailSent?: boolean;
}
