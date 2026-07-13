import { model } from "@medusajs/framework/utils";
import { InferTypeOf } from "@medusajs/framework/types";

const MarketplaceAccount = model
  .define("marketplace_account", {
    id: model.id({ prefix: "macc" }).primaryKey(),
    name: model.text(),
    platform: model.text(),
    description: model.text().nullable(),
    url: model.text(),
    cta_label: model.text(),
    sort_order: model.number().default(0),
    is_active: model.boolean().default(true),
    metadata: model.json().nullable(),
  })
  .indexes([
    {
      name: "IDX_marketplace_account_active_sort",
      on: ["is_active", "sort_order"],
      unique: false,
      where: "deleted_at IS NULL",
    },
    {
      name: "IDX_marketplace_account_platform",
      on: ["platform"],
      unique: false,
      where: "deleted_at IS NULL",
    },
  ]);

export type MarketplaceAccountModelType = InferTypeOf<
  typeof MarketplaceAccount
>;

export default MarketplaceAccount;
