import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from '@medusajs/framework/http';
import moderateProductReviewWorkflow from '../../../../../workflows/moderate-product-review';
import { ModerateProductReviewBody } from '../../validators';

export const POST = async (
  req: AuthenticatedMedusaRequest<ModerateProductReviewBody>,
  res: MedusaResponse,
) => {
  const { result } = await moderateProductReviewWorkflow(req.scope).run({
    input: {
      id: req.params.id,
      ...req.validatedBody,
      moderated_by: req.auth_context.actor_id,
    },
  });

  res.status(200).json({ review: result.review });
};
