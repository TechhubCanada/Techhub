import { z } from '@medusajs/framework/zod';

export const ModerateProductReviewSchema = z.object({
  status: z.enum(['approved', 'rejected']),
  moderation_note: z.string().trim().max(1000).optional(),
});

export type ModerateProductReviewBody = z.infer<
  typeof ModerateProductReviewSchema
>;

export const ListAdminProductReviewsQuerySchema = z.object({
  product_id: z.string().trim().min(1).optional(),
  status: z.enum(['pending', 'approved', 'rejected']).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
  offset: z.coerce.number().int().min(0).optional().default(0),
});
