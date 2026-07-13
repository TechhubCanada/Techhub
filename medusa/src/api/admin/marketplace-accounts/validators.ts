import { z } from "@medusajs/framework/zod";

export const MarketplaceAccountBodySchema = z.object({
  name: z.string().trim().min(1).max(120),
  platform: z.string().trim().min(1).max(80),
  description: z.string().trim().max(400).optional().nullable(),
  url: z.string().trim().url().max(2048),
  cta_label: z.string().trim().min(1).max(80),
  sort_order: z.coerce.number().int().min(0).max(1000).optional().default(0),
  is_active: z.coerce.boolean().optional().default(true),
  metadata: z.record(z.string(), z.unknown()).optional().nullable(),
});

export type MarketplaceAccountBody = z.infer<
  typeof MarketplaceAccountBodySchema
>;

export const ListMarketplaceAccountsQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).optional().default(50),
  offset: z.coerce.number().int().min(0).optional().default(0),
  q: z.string().trim().min(1).optional(),
  active: z.coerce.boolean().optional(),
});
