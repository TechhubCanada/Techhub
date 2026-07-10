import { z } from '@medusajs/framework/zod';

export const CreateProductReviewSchema = z.object({
  rating: z.coerce.number().int().min(1).max(5),
  title: z.string().trim().min(1).max(120).optional(),
  content: z.string().trim().min(10).max(4000),
  customer_name: z.string().trim().min(1).max(120).optional(),
  customer_email: z.string().trim().email().optional(),
  order_id: z.string().trim().min(1).optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export type CreateProductReviewBody = z.infer<typeof CreateProductReviewSchema>;

export const ListProductReviewsQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
  offset: z.coerce.number().int().min(0).optional().default(0),
});
