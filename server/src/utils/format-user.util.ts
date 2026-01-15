import { UserEntity } from '../entities/user.entity';
import { UserResponseDto } from '../dto/user/user-response.dto';

export function mapToUserResponseDto(user: UserEntity): UserResponseDto {
  return {
    id: user.id,
    nickname: user.nickname,
    email: user.email,
    role: {
      id: user.role.id,
      name: user.role.name,
    },
  };
}
