import {
  createStep,
  StepResponse,
} from '@medusajs/framework/workflows-sdk';
import ProductReviewModuleService from '../../modules/product-review/service';
import { PRODUCT_REVIEW_MODULE } from '../../modules/product-review';

export type CreateProductReviewStepInput = {
  product_id: string;
  customer_id?: string | null;
  order_id?: string | null;
  rating: number;
  title?: string | null;
  content: string;
  customer_name?: string | null;
  customer_email?: string | null;
  metadata?: Record<string, unknown> | null;
};

const createProductReviewStep = createStep(
  'create-product-review',
  async (input: CreateProductReviewStepInput, { container }) => {
    const productReviewService: ProductReviewModuleService =
      container.resolve(PRODUCT_REVIEW_MODULE);

    const review = await productReviewService.createProductReviews({
      ...input,
      status: 'pending',
      verified_purchase: Boolean(input.order_id),
    });

    return new StepResponse(review, review.id);
  },
  async (id, { container }) => {
    const productReviewService: ProductReviewModuleService =
      container.resolve(PRODUCT_REVIEW_MODULE);

    await productReviewService.deleteProductReviews(id);
  },
);

export default createProductReviewStep;
