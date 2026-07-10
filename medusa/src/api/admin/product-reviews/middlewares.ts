import {
  authenticate,
  MiddlewareRoute,
  validateAndTransformBody,
} from '@medusajs/framework/http';
import { ModerateProductReviewSchema } from './validators';

export const productReviewAdminMiddlewares: MiddlewareRoute[] = [
  {
    matcher: '/admin/product-reviews',
    method: 'ALL',
    middlewares: [authenticate('user', ['session', 'bearer'])],
  },
  {
    matcher: '/admin/product-reviews/:id/moderate',
    method: 'POST',
    middlewares: [
      authenticate('user', ['session', 'bearer']),
      validateAndTransformBody(ModerateProductReviewSchema),
    ],
  },
];
