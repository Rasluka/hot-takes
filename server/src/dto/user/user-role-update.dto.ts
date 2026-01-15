import { z } from 'zod';

export const UserRoleUpdateSchema = z.object({
  roleId: z.number().int().positive('Role ID must be a positive integer'),
});

export type UserRoleUpdateDto = z.infer<typeof UserRoleUpdateSchema>;
