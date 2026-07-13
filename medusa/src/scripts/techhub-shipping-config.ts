import type { FulfillmentWorkflow } from '@medusajs/framework/types';
import { RuleOperator } from '@medusajs/framework/utils';

type ShippingOptionBuildInput = {
  currencyCode: string;
  regionId: string;
  serviceZoneId: string;
  shippingProfileId: string;
};

type ShippingOptionInput =
  FulfillmentWorkflow.CreateShippingOptionsWorkflowInput;

export const TECHHUB_REGION_NAME = 'Canada';
export const TECHHUB_CURRENCY_CODE = 'cad';
export const TECHHUB_COUNTRIES = ['ca'];
export const TECHHUB_PICKUP_COUNTRIES = ['ca'];

const storeEnabledShippingRules = [
  {
    attribute: 'enabled_in_store',
    value: '"true"',
    operator: RuleOperator.EQ,
  },
  {
    attribute: 'is_return',
    value: 'false',
    operator: RuleOperator.EQ,
  },
];

export function getTechHubGeoZones(countries: string[]) {
  return countries.map((country_code) => ({
    country_code,
    type: 'country' as const,
  }));
}

function buildFlatPrices({
  amount,
  currencyCode,
  regionId,
}: {
  amount: number;
  currencyCode: string;
  regionId: string;
}) {
  return [
    {
      currency_code: currencyCode,
      amount,
    },
    {
      region_id: regionId,
      amount,
    },
  ];
}

export function buildTechHubDeliveryShippingOptions({
  currencyCode,
  regionId,
  serviceZoneId,
  shippingProfileId,
}: ShippingOptionBuildInput): ShippingOptionInput[] {
  return [
    {
      name: 'Standard Shipping',
      price_type: 'flat',
      provider_id: 'manual_manual',
      service_zone_id: serviceZoneId,
      shipping_profile_id: shippingProfileId,
      type: {
        label: 'Standard',
        description: 'Ship in 2-5 business days.',
        code: 'standard',
      },
      prices: buildFlatPrices({
        amount: 15,
        currencyCode,
        regionId,
      }),
      rules: storeEnabledShippingRules,
    } satisfies ShippingOptionInput,
    {
      name: 'Express Shipping',
      price_type: 'flat',
      provider_id: 'manual_manual',
      service_zone_id: serviceZoneId,
      shipping_profile_id: shippingProfileId,
      type: {
        label: 'Express',
        description: 'Priority delivery for urgent orders.',
        code: 'express',
      },
      prices: buildFlatPrices({
        amount: 25,
        currencyCode,
        regionId,
      }),
      rules: storeEnabledShippingRules,
    } satisfies ShippingOptionInput,
  ];
}

export function buildTechHubPickupShippingOptions({
  currencyCode,
  regionId,
  serviceZoneId,
  shippingProfileId,
}: ShippingOptionBuildInput): ShippingOptionInput[] {
  return [
    {
      name: 'Store Pickup',
      price_type: 'flat',
      provider_id: 'manual_manual',
      service_zone_id: serviceZoneId,
      shipping_profile_id: shippingProfileId,
      type: {
        label: 'Store Pickup',
        description: 'Pick up from the TechHub store.',
        code: 'pickup',
      },
      prices: buildFlatPrices({
        amount: 0,
        currencyCode,
        regionId,
      }),
      rules: storeEnabledShippingRules,
    } satisfies ShippingOptionInput,
  ];
}
