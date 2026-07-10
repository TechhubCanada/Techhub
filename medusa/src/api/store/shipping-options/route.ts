import { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';
import {
  ContainerRegistrationKeys,
  QueryContext,
  isDefined,
} from '@medusajs/framework/utils';

type PricedShippingOptionLike = {
  calculated_price?: {
    calculated_amount?: number;
    is_calculated_price_tax_inclusive?: boolean;
  } | null;
};

const shippingOptionFields = [
  'id',
  'name',
  'price_type',
  'service_zone_id',
  'service_zone.fulfillment_set_id',
  'service_zone.fulfillment_set.type',
  'shipping_profile_id',
  'provider_id',
  'data',
  'type.id',
  'type.label',
  'type.description',
  'type.code',
  'provider.id',
  'provider.is_enabled',
  'rules.attribute',
  'rules.value',
  'rules.operator',
  'calculated_price.*',
  'prices.*',
  'prices.price_rules.*',
];

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const { cart_id, is_return, enabled_in_store } = req.filterableFields;

  if (typeof cart_id !== 'string') {
    return res.status(400).json({
      message: 'cart_id is required',
    });
  }

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);
  const {
    data: [cart],
  } = await query.graph({
    entity: 'cart',
    fields: [
      'id',
      'currency_code',
      'region_id',
      'region.*',
      'customer_id',
      'customer.*',
      'sales_channel_id',
      'shipping_address.*',
    ],
    filters: { id: cart_id },
  });

  if (!cart) {
    return res.status(404).json({
      message: `Cart ${cart_id} was not found`,
    });
  }

  const {
    data: [salesChannel],
  } = await query.graph({
    entity: 'sales_channels',
    fields: ['stock_locations.fulfillment_sets.id'],
    filters: { id: cart.sales_channel_id },
  });

  const fulfillmentSetIds = Array.from(
    new Set(
      (salesChannel?.stock_locations ?? []).flatMap((stockLocation) =>
        (stockLocation.fulfillment_sets ?? [])
          .map((fulfillmentSet) => fulfillmentSet?.id)
          .filter(Boolean),
      ),
    ),
  );

  if (!fulfillmentSetIds.length) {
    return res.json({ shipping_options: [] });
  }

  const { data } = await query.graph({
    entity: 'shipping_options',
    fields: shippingOptionFields,
    filters: {
      fulfillment_set_id: fulfillmentSetIds,
      address: {
        country_code: cart.shipping_address?.country_code,
        province_code: cart.shipping_address?.province,
        city: cart.shipping_address?.city,
        postal_expression: cart.shipping_address?.postal_code,
      },
    } as any,
    context: {
      is_return: is_return ? 'true' : 'false',
      enabled_in_store: !isDefined(enabled_in_store)
        ? 'true'
        : enabled_in_store
          ? 'true'
          : 'false',
      calculated_price: QueryContext({
        currency_code: cart.currency_code,
        region_id: cart.region_id,
        region: cart.region,
        customer_id: cart.customer_id,
        customer: cart.customer,
      }),
    },
  });
  const shippingOptions = data as PricedShippingOptionLike[];

  res.json({
    shipping_options: shippingOptions.map((shippingOption) => {
      const price = shippingOption.calculated_price;

      return {
        ...shippingOption,
        amount: price?.calculated_amount,
        is_tax_inclusive: !!price?.is_calculated_price_tax_inclusive,
      };
    }),
  });
};
