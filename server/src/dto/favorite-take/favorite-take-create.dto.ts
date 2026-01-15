import { z } from 'zod';

export const FavoriteAddSchema = z.object({
  takeId: z.number().int().positive('Take ID must be a positive integer'),
});

export type FavoriteAddDto = z.infer<typeof FavoriteAddSchema>;
