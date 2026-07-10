import { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';
import ProductReviewModuleService from '../../../modules/product-review/service';
import { PRODUCT_REVIEW_MODULE } from '../../../modules/product-review';
import { ListAdminProductReviewsQuerySchema } from './validators';

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const { limit, offset, product_id, status } =
    ListAdminProductReviewsQuerySchema.parse(req.query);
  const productReviewService: ProductReviewModuleService =
    req.scope.resolve(PRODUCT_REVIEW_MODULE);

  const [reviews, count] = await productReviewService.listAndCountProductReviews(
    {
      ...(product_id ? { product_id } : {}),
      ...(status ? { status } : {}),
    },
    {
      order: { created_at: 'DESC' },
      skip: offset,
      take: limit,
    },
  );

  res.json({
    reviews,
    count,
    limit,
    offset,
  });
};
