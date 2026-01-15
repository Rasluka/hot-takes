import { z } from 'zod';
import { UserResponseDto } from './user-response.dto';

export const UserCreateSchema = z.object({
  nickname: z
    .string()
    .min(1, 'Nickname is required')
    .max(50, 'Nickname must be 50 characters or less'),
  email: z.string().email('Invalid email format'),
  roleId: z.number().int().positive().optional(),
});

export type UserCreateDto = z.infer<typeof UserCreateSchema>;

export interface UserCreateResponseDto {
  user: UserResponseDto;
  code: string;
  emailSent?: boolean;
}
