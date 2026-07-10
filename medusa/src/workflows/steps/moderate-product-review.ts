import {
  createStep,
  StepResponse,
} from '@medusajs/framework/workflows-sdk';
import ProductReviewModuleService from '../../modules/product-review/service';
import { PRODUCT_REVIEW_MODULE } from '../../modules/product-review';
import { ProductReviewStatus } from '../../modules/product-review/models/product-review';

export type ModerateProductReviewStepInput = {
  id: string;
  status: Extract<ProductReviewStatus, 'approved' | 'rejected'>;
  moderation_note?: string | null;
  moderated_by?: string | null;
};

const moderateProductReviewStep = createStep(
  'moderate-product-review',
  async (input: ModerateProductReviewStepInput, { container }) => {
    const productReviewService: ProductReviewModuleService =
      container.resolve(PRODUCT_REVIEW_MODULE);
    const existingReview = await productReviewService.retrieveProductReview(
      input.id,
    );

    const review = await productReviewService.updateProductReviews({
      id: input.id,
      status: input.status,
      moderation_note: input.moderation_note ?? null,
      moderated_by: input.moderated_by ?? null,
      moderated_at: new Date(),
      published_at: input.status === 'approved' ? new Date() : null,
    });

    return new StepResponse(review, {
      id: existingReview.id,
      status: existingReview.status,
      moderation_note: existingReview.moderation_note,
      moderated_by: existingReview.moderated_by,
      moderated_at: existingReview.moderated_at,
      published_at: existingReview.published_at,
    });
  },
  async (previousReview, { container }) => {
    const productReviewService: ProductReviewModuleService =
      container.resolve(PRODUCT_REVIEW_MODULE);

    await productReviewService.updateProductReviews(previousReview);
  },
);

export default moderateProductReviewStep;
