import { listShippingOptionsForCartWithPricingWorkflow } from '@medusajs/core-flows';
import { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const { cart_id, is_return } = req.filterableFields;

  if (typeof cart_id !== 'string') {
    return res.status(400).json({
      message: 'cart_id is required',
    });
  }

  const workflow = listShippingOptionsForCartWithPricingWorkflow(req.scope);

  const { result: shipping_options } = await workflow.run({
    input: {
      cart_id,
      is_return: !!is_return,
    },
  });

  res.json({ shipping_options });
};
