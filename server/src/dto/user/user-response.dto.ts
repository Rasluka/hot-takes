import { RoleResponseDto } from '../role/role-response.dto';

export interface UserResponseDto {
  id: number;
  nickname: string;
  email: string;
  role: RoleResponseDto;
}
