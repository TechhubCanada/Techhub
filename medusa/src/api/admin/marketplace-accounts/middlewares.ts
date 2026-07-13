import {
  authenticate,
  MiddlewareRoute,
  validateAndTransformBody,
} from "@medusajs/framework/http";
import { MarketplaceAccountBodySchema } from "./validators";

export const marketplaceAccountAdminMiddlewares: MiddlewareRoute[] = [
  {
    matcher: "/admin/marketplace-accounts",
    method: "ALL",
    middlewares: [authenticate("user", ["session", "bearer"])],
  },
  {
    matcher: "/admin/marketplace-accounts/:id",
    method: "ALL",
    middlewares: [authenticate("user", ["session", "bearer"])],
  },
  {
    matcher: "/admin/marketplace-accounts",
    method: "POST",
    middlewares: [validateAndTransformBody(MarketplaceAccountBodySchema)],
  },
  {
    matcher: "/admin/marketplace-accounts/:id",
    method: "POST",
    middlewares: [validateAndTransformBody(MarketplaceAccountBodySchema)],
  },
];
