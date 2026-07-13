import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import MarketplaceAccountModuleService from "../../modules/marketplace-account/service";
import { MARKETPLACE_ACCOUNT_MODULE } from "../../modules/marketplace-account";

export type CreateMarketplaceAccountStepInput = {
  name: string;
  platform: string;
  description?: string | null;
  url: string;
  cta_label: string;
  sort_order?: number;
  is_active?: boolean;
  metadata?: Record<string, unknown> | null;
};

const createMarketplaceAccountStep = createStep(
  "create-marketplace-account",
  async (input: CreateMarketplaceAccountStepInput, { container }) => {
    const marketplaceAccountService: MarketplaceAccountModuleService =
      container.resolve(MARKETPLACE_ACCOUNT_MODULE);

    const account =
      await marketplaceAccountService.createMarketplaceAccounts(input);

    return new StepResponse(account, account.id);
  },
  async (id, { container }) => {
    const marketplaceAccountService: MarketplaceAccountModuleService =
      container.resolve(MARKETPLACE_ACCOUNT_MODULE);

    await marketplaceAccountService.deleteMarketplaceAccounts(id);
  },
);

export default createMarketplaceAccountStep;
