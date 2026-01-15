import { UserResponseDto } from '../user/user-response.dto';

export interface SignInDto {
  nickname: string;
  code: string;
}

export interface SignInResponseDto {
  user: UserResponseDto;
  token: string;
}
