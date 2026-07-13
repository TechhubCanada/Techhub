import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import MarketplaceAccountModuleService from "../../../modules/marketplace-account/service";
import { MARKETPLACE_ACCOUNT_MODULE } from "../../../modules/marketplace-account";
import createMarketplaceAccountWorkflow from "../../../workflows/create-marketplace-account";
import {
  ListMarketplaceAccountsQuerySchema,
  MarketplaceAccountBody,
} from "./validators";

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const { limit, offset, q, active } = ListMarketplaceAccountsQuerySchema.parse(
    req.query,
  );
  const marketplaceAccountService: MarketplaceAccountModuleService =
    req.scope.resolve(MARKETPLACE_ACCOUNT_MODULE);

  const [marketplace_accounts, count] =
    await marketplaceAccountService.listAndCountMarketplaceAccounts(
      {
        ...(typeof active === "boolean" ? { is_active: active } : {}),
        ...(q ? { name: { $ilike: `%${q}%` } } : {}),
      },
      {
        order: { sort_order: "ASC", created_at: "DESC" },
        skip: offset,
        take: limit,
      },
    );

  res.json({
    marketplace_accounts,
    count,
    limit,
    offset,
  });
};

export const POST = async (
  req: MedusaRequest<MarketplaceAccountBody>,
  res: MedusaResponse,
) => {
  const { result } = await createMarketplaceAccountWorkflow(req.scope).run({
    input: req.validatedBody,
  });

  res.status(201).json(result);
};
