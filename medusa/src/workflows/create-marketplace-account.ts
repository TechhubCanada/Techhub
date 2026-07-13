import {
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import createMarketplaceAccountStep, {
  CreateMarketplaceAccountStepInput,
} from "./steps/create-marketplace-account";

const createMarketplaceAccountWorkflow = createWorkflow(
  "create-marketplace-account",
  function (input: CreateMarketplaceAccountStepInput) {
    const account = createMarketplaceAccountStep(input);

    return new WorkflowResponse({ account });
  },
);

export default createMarketplaceAccountWorkflow;
