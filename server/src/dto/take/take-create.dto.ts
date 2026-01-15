import { z } from 'zod';

export const TakeCreateSchema = z.object({
  content: z
    .string()
    .min(1, 'Content is required')
    .max(1000, 'Content must be 1000 characters or less'),
});

export type TakeCreateDto = z.infer<typeof TakeCreateSchema>;
