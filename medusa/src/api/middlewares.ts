import { defineMiddlewares } from '@medusajs/medusa';
import { adminProductTypeRoutesMiddlewares } from './store/custom/product-types/middlewares';
import { authenticate } from '@medusajs/framework';
import { productReviewStoreMiddlewares } from './store/products/[id]/reviews/middlewares';
import { productReviewAdminMiddlewares } from './admin/product-reviews/middlewares';

export default defineMiddlewares([
  ...adminProductTypeRoutesMiddlewares,
  ...productReviewStoreMiddlewares,
  ...productReviewAdminMiddlewares,
  {
    method: 'ALL',
    matcher: '/store/custom/customer/*',
    middlewares: [authenticate('customer', ['session', 'bearer'])],
  },
]);
