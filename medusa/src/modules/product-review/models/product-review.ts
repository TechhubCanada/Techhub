import { model } from '@medusajs/framework/utils';
import { InferTypeOf } from '@medusajs/framework/types';

export const PRODUCT_REVIEW_STATUSES = [
  'pending',
  'approved',
  'rejected',
] as const;
const productReviewStatusValues = [...PRODUCT_REVIEW_STATUSES];

const ProductReview = model
  .define('product_review', {
    id: model.id({ prefix: 'prev' }).primaryKey(),
    product_id: model.text(),
    customer_id: model.text().nullable(),
    order_id: model.text().nullable(),
    rating: model.number(),
    title: model.text().nullable(),
    content: model.text(),
    customer_name: model.text().nullable(),
    customer_email: model.text().nullable(),
    verified_purchase: model.boolean().default(false),
    status: model.enum(productReviewStatusValues).default('pending'),
    moderation_note: model.text().nullable(),
    moderated_by: model.text().nullable(),
    moderated_at: model.dateTime().nullable(),
    published_at: model.dateTime().nullable(),
    metadata: model.json().nullable(),
  })
  .indexes([
    {
      name: 'IDX_product_review_product_status',
      on: ['product_id', 'status'],
      unique: false,
      where: 'deleted_at IS NULL',
    },
    {
      name: 'IDX_product_review_customer',
      on: ['customer_id'],
      unique: false,
      where: 'customer_id IS NOT NULL AND deleted_at IS NULL',
    },
    {
      name: 'IDX_product_review_status',
      on: ['status'],
      unique: false,
      where: 'deleted_at IS NULL',
    },
  ]);

export type ProductReviewStatus = (typeof PRODUCT_REVIEW_STATUSES)[number];
export type ProductReviewModelType = InferTypeOf<typeof ProductReview>;

export default ProductReview;
