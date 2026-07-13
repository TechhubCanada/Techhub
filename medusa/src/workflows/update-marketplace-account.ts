import {
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import updateMarketplaceAccountStep, {
  UpdateMarketplaceAccountStepInput,
} from "./steps/update-marketplace-account";

const updateMarketplaceAccountWorkflow = createWorkflow(
  "update-marketplace-account",
  function (input: UpdateMarketplaceAccountStepInput) {
    const account = updateMarketplaceAccountStep(input);

    return new WorkflowResponse({ account });
  },
);

export default updateMarketplaceAccountWorkflow;
