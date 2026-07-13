import {
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import deleteMarketplaceAccountStep, {
  DeleteMarketplaceAccountStepInput,
} from "./steps/delete-marketplace-account";

const deleteMarketplaceAccountWorkflow = createWorkflow(
  "delete-marketplace-account",
  function (input: DeleteMarketplaceAccountStepInput) {
    const account = deleteMarketplaceAccountStep(input);

    return new WorkflowResponse({ account });
  },
);

export default deleteMarketplaceAccountWorkflow;
