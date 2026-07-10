import {
  createWorkflow,
  WorkflowResponse,
} from '@medusajs/framework/workflows-sdk';
import moderateProductReviewStep, {
  ModerateProductReviewStepInput,
} from './steps/moderate-product-review';

const moderateProductReviewWorkflow = createWorkflow(
  'moderate-product-review',
  function (input: ModerateProductReviewStepInput) {
    const review = moderateProductReviewStep(input);

    return new WorkflowResponse({ review });
  },
);

export default moderateProductReviewWorkflow;
