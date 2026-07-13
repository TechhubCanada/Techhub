import { z } from "zod";

export const marketplaceAccountFormSchema = z.object({
  name: z.string().trim().min(1, "Display name is required"),
  platform: z.string().trim().min(1, "Platform is required"),
  description: z.string().trim().max(400).optional().nullable(),
  url: z.string().trim().url("Enter a valid seller account URL"),
  cta_label: z.string().trim().min(1, "Button label is required"),
  sort_order: z.coerce.number().int().min(0).default(0),
  is_active: z.coerce.boolean().default(true),
});

export type MarketplaceAccountFormValues = z.infer<
  typeof marketplaceAccountFormSchema
>;

export type MarketplaceAccount = MarketplaceAccountFormValues & {
  id: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
};

export type MarketplaceAccountsResponse = {
  marketplace_accounts: MarketplaceAccount[];
  count: number;
  limit: number;
  offset: number;
};
