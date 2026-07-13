import {
  TECHHUB_COUNTRIES,
  TECHHUB_CURRENCY_CODE,
  TECHHUB_PICKUP_COUNTRIES,
  TECHHUB_REGION_NAME,
  buildTechHubDeliveryShippingOptions,
  buildTechHubPickupShippingOptions,
  getTechHubGeoZones,
} from '../techhub-shipping-config';

describe('TechHub shipping seed configuration', () => {
  it('seeds a Canadian CAD region for production checkout', () => {
    expect(TECHHUB_REGION_NAME).toBe('Canada');
    expect(TECHHUB_CURRENCY_CODE).toBe('cad');
    expect(TECHHUB_COUNTRIES).toContain('ca');
  });

  it('creates Canadian shipping and pickup geo zones', () => {
    expect(getTechHubGeoZones(TECHHUB_COUNTRIES)).toEqual([
      {
        country_code: 'ca',
        type: 'country',
      },
    ]);
    expect(getTechHubGeoZones(TECHHUB_PICKUP_COUNTRIES)).toEqual([
      {
        country_code: 'ca',
        type: 'country',
      },
    ]);
  });

  it('creates store-enabled Canadian delivery and pickup options', () => {
    const deliveryOptions = buildTechHubDeliveryShippingOptions({
      currencyCode: TECHHUB_CURRENCY_CODE,
      regionId: 'reg_ca',
      serviceZoneId: 'serzo_delivery_ca',
      shippingProfileId: 'sp_default',
    });
    const pickupOptions = buildTechHubPickupShippingOptions({
      currencyCode: TECHHUB_CURRENCY_CODE,
      regionId: 'reg_ca',
      serviceZoneId: 'serzo_pickup_ca',
      shippingProfileId: 'sp_default',
    });
    const options = [...deliveryOptions, ...pickupOptions];

    expect(deliveryOptions).toEqual([
      expect.objectContaining({
        name: 'Standard Shipping',
        service_zone_id: 'serzo_delivery_ca',
        prices: expect.arrayContaining([
          { currency_code: 'cad', amount: 15 },
          { region_id: 'reg_ca', amount: 15 },
        ]),
      }),
      expect.objectContaining({
        name: 'Express Shipping',
        service_zone_id: 'serzo_delivery_ca',
        prices: expect.arrayContaining([
          { currency_code: 'cad', amount: 25 },
          { region_id: 'reg_ca', amount: 25 },
        ]),
      }),
    ]);
    expect(pickupOptions).toEqual([
      expect.objectContaining({
        name: 'Store Pickup',
        service_zone_id: 'serzo_pickup_ca',
        prices: expect.arrayContaining([
          { currency_code: 'cad', amount: 0 },
          { region_id: 'reg_ca', amount: 0 },
        ]),
      }),
    ]);

    options.forEach((option) => {
      expect(option.rules).toEqual(
        expect.arrayContaining([
          {
            attribute: 'enabled_in_store',
            value: '"true"',
            operator: 'eq',
          },
          {
            attribute: 'is_return',
            value: 'false',
            operator: 'eq',
          },
        ]),
      );
    });
  });
});
