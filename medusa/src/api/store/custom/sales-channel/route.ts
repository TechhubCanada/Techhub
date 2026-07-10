import { MedusaRequest, MedusaResponse } from '@medusajs/framework';

type PublishableKeyRequest = MedusaRequest & {
  publishable_key_context?: {
    sales_channel_ids?: string[];
  };
};

export const GET = async (
  req: PublishableKeyRequest,
  res: MedusaResponse,
) => {
  const [salesChannelId] = req.publishable_key_context?.sales_channel_ids ?? [];

  if (!salesChannelId) {
    res.status(400).json({
      message:
        'No sales channel is linked to the storefront publishable API key.',
    });
    return;
  }

  res.status(200).json({
    sales_channel_id: salesChannelId,
  });
};
