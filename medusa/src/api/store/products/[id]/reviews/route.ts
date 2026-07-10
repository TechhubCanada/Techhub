import {
  AuthenticatedMedusaRequest,
  MedusaRequest,
  MedusaResponse,
} from '@medusajs/framework/http';
import ProductReviewModuleService from '../../../../../modules/product-review/service';
import { PRODUCT_REVIEW_MODULE } from '../../../../../modules/product-review';
import createProductReviewWorkflow from '../../../../../workflows/create-product-review';
import {
  CreateProductReviewBody,
  ListProductReviewsQuerySchema,
} from './validators';

const toStoreReview = (review: {
  id: string;
  product_id: string;
  rating: number;
  title?: string | null;
  content: string;
  customer_name?: string | null;
  verified_purchase: boolean;
  status: string;
  created_at: Date;
  published_at?: Date | null;
}) => ({
  id: review.id,
  product_id: review.product_id,
  rating: review.rating,
  title: review.title,
  content: review.content,
  customer_name: review.customer_name,
  verified_purchase: review.verified_purchase,
  status: review.status,
  created_at: review.created_at,
  published_at: review.published_at,
});

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const { limit, offset } = ListProductReviewsQuerySchema.parse(req.query);
  const productReviewService: ProductReviewModuleService =
    req.scope.resolve(PRODUCT_REVIEW_MODULE);

  const [reviews, count] = await productReviewService.listAndCountProductReviews(
    {
      product_id: req.params.id,
      status: 'approved',
    },
    {
      order: { created_at: 'DESC' },
      skip: offset,
      take: limit,
    },
  );
  const ratingTotal = reviews.reduce((total, review) => total + review.rating, 0);

  res.json({
    reviews: reviews.map(toStoreReview),
    count,
    limit,
    offset,
    summary: {
      average_rating: reviews.length > 0 ? ratingTotal / reviews.length : 0,
      review_count: count,
    },
  });
};

export const POST = async (
  req: AuthenticatedMedusaRequest<CreateProductReviewBody>,
  res: MedusaResponse,
) => {
  const { result } = await createProductReviewWorkflow(req.scope).run({
    input: {
      product_id: req.params.id,
      customer_id: req.auth_context.actor_id,
      ...req.validatedBody,
    },
  });

  res.status(202).json({ review: result.review });
};
