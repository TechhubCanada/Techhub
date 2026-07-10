import {
  authenticate,
  MiddlewareRoute,
  validateAndTransformBody,
} from '@medusajs/framework/http';
import { CreateProductReviewSchema } from './validators';

export const productReviewStoreMiddlewares: MiddlewareRoute[] = [
  {
    matcher: '/store/products/:id/reviews',
    method: 'POST',
    middlewares: [
      authenticate('customer', ['session', 'bearer']),
      validateAndTransformBody(CreateProductReviewSchema),
    ],
  },
];
