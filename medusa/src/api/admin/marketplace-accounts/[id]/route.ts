import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import MarketplaceAccountModuleService from "../../../../modules/marketplace-account/service";
import { MARKETPLACE_ACCOUNT_MODULE } from "../../../../modules/marketplace-account";
import updateMarketplaceAccountWorkflow from "../../../../workflows/update-marketplace-account";
import deleteMarketplaceAccountWorkflow from "../../../../workflows/delete-marketplace-account";
import { MarketplaceAccountBody } from "../validators";

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const marketplaceAccountService: MarketplaceAccountModuleService =
    req.scope.resolve(MARKETPLACE_ACCOUNT_MODULE);
  const account = await marketplaceAccountService.retrieveMarketplaceAccount(
    req.params.id,
  );

  res.json({ account });
};

export const POST = async (
  req: MedusaRequest<MarketplaceAccountBody>,
  res: MedusaResponse,
) => {
  const { result } = await updateMarketplaceAccountWorkflow(req.scope).run({
    input: {
      id: req.params.id,
      ...req.validatedBody,
    },
  });

  res.json(result);
};

export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
  const { result } = await deleteMarketplaceAccountWorkflow(req.scope).run({
    input: {
      id: req.params.id,
    },
  });

  res.json(result);
};
