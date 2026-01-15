import { z } from 'zod';
import { UserResponseDto } from '../user/user-response.dto';

export const SignInSchema = z.object({
  nickname: z.string().min(1, 'Nickname is required'),
  code: z.string().length(8, 'Code must be exactly 8 characters'),
});

export type SignInDto = z.infer<typeof SignInSchema>;

export interface SignInResponseDto {
  user: UserResponseDto;
  token: string;
}
