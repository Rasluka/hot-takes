import { RoleEntity } from '../entities/role.entity';
import { RoleResponseDto } from '../dto/role/role-response.dto';

export function mapToRoleResponseDto(role: RoleEntity): RoleResponseDto {
  return {
    id: role.id,
    name: role.name,
  };
}
