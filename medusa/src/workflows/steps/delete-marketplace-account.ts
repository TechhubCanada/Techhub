import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import MarketplaceAccountModuleService from "../../modules/marketplace-account/service";
import { MARKETPLACE_ACCOUNT_MODULE } from "../../modules/marketplace-account";

export type DeleteMarketplaceAccountStepInput = {
  id: string;
};

const deleteMarketplaceAccountStep = createStep(
  "delete-marketplace-account",
  async (input: DeleteMarketplaceAccountStepInput, { container }) => {
    const marketplaceAccountService: MarketplaceAccountModuleService =
      container.resolve(MARKETPLACE_ACCOUNT_MODULE);
    const account = await marketplaceAccountService.retrieveMarketplaceAccount(
      input.id,
    );

    await marketplaceAccountService.softDeleteMarketplaceAccounts(input.id);

    return new StepResponse({ id: input.id }, account.id);
  },
  async (id, { container }) => {
    const marketplaceAccountService: MarketplaceAccountModuleService =
      container.resolve(MARKETPLACE_ACCOUNT_MODULE);

    await marketplaceAccountService.restoreMarketplaceAccounts(id);
  },
);

export default deleteMarketplaceAccountStep;
