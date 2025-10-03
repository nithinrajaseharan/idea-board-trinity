import { z } from 'zod';

export const createIdeaSchema = z.object({
  text: z.string().min(1, 'Idea cannot be empty').max(280, 'Idea must be 280 characters or less'),
});

export type CreateIdeaInput = z.infer<typeof createIdeaSchema>;

