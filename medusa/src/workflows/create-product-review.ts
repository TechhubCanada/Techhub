import {
  createWorkflow,
  WorkflowResponse,
} from '@medusajs/framework/workflows-sdk';
import createProductReviewStep, {
  CreateProductReviewStepInput,
} from './steps/create-product-review';

const createProductReviewWorkflow = createWorkflow(
  'create-product-review',
  function (input: CreateProductReviewStepInput) {
    const review = createProductReviewStep(input);

    return new WorkflowResponse({ review });
  },
);

export default createProductReviewWorkflow;
