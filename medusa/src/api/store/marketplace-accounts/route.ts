import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import MarketplaceAccountModuleService from "../../../modules/marketplace-account/service";
import { MARKETPLACE_ACCOUNT_MODULE } from "../../../modules/marketplace-account";

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const marketplaceAccountService: MarketplaceAccountModuleService =
    req.scope.resolve(MARKETPLACE_ACCOUNT_MODULE);

  const [marketplace_accounts] =
    await marketplaceAccountService.listAndCountMarketplaceAccounts(
      {
        is_active: true,
      },
      {
        order: { sort_order: "ASC", created_at: "DESC" },
        take: 50,
      },
    );

  res.json({
    marketplace_accounts: marketplace_accounts.map((account) => ({
      id: account.id,
      name: account.name,
      platform: account.platform,
      description: account.description,
      url: account.url,
      cta_label: account.cta_label,
      sort_order: account.sort_order,
    })),
  });
};
