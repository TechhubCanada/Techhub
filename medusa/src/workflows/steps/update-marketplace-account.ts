import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import MarketplaceAccountModuleService from "../../modules/marketplace-account/service";
import { MARKETPLACE_ACCOUNT_MODULE } from "../../modules/marketplace-account";
import { MarketplaceAccountModelType } from "../../modules/marketplace-account/models/marketplace-account";

export type UpdateMarketplaceAccountStepInput = {
  id: string;
  name?: string;
  platform?: string;
  description?: string | null;
  url?: string;
  cta_label?: string;
  sort_order?: number;
  is_active?: boolean;
  metadata?: Record<string, unknown> | null;
};

const updateMarketplaceAccountStep = createStep(
  "update-marketplace-account",
  async (input: UpdateMarketplaceAccountStepInput, { container }) => {
    const marketplaceAccountService: MarketplaceAccountModuleService =
      container.resolve(MARKETPLACE_ACCOUNT_MODULE);
    const existingAccount =
      await marketplaceAccountService.retrieveMarketplaceAccount(input.id);

    const account =
      await marketplaceAccountService.updateMarketplaceAccounts(input);

    return new StepResponse(account, {
      id: existingAccount.id,
      name: existingAccount.name,
      platform: existingAccount.platform,
      description: existingAccount.description,
      url: existingAccount.url,
      cta_label: existingAccount.cta_label,
      sort_order: existingAccount.sort_order,
      is_active: existingAccount.is_active,
      metadata: existingAccount.metadata,
    } satisfies Partial<MarketplaceAccountModelType> & { id: string });
  },
  async (previousAccount, { container }) => {
    const marketplaceAccountService: MarketplaceAccountModuleService =
      container.resolve(MARKETPLACE_ACCOUNT_MODULE);

    await marketplaceAccountService.updateMarketplaceAccounts(previousAccount);
  },
);

export default updateMarketplaceAccountStep;
