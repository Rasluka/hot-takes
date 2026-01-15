import { z } from 'zod';

export const TakeUpdateSchema = z.object({
  content: z
    .string()
    .min(1, 'Content is required')
    .max(1000, 'Content must be 1000 characters or less'),
});

export type TakeUpdateDto = z.infer<typeof TakeUpdateSchema>;
