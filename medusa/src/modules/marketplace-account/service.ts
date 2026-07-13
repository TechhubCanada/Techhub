import { MedusaService } from "@medusajs/framework/utils";
import MarketplaceAccount from "./models/marketplace-account";

export default class MarketplaceAccountModuleService extends MedusaService({
  MarketplaceAccount,
}) {}
