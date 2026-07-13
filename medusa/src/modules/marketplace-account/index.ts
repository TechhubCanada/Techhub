import { Module } from "@medusajs/framework/utils";
import MarketplaceAccountModuleService from "./service";

export const MARKETPLACE_ACCOUNT_MODULE = "marketplaceAccount";

export default Module(MARKETPLACE_ACCOUNT_MODULE, {
  service: MarketplaceAccountModuleService,
});
