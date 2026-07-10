import { GET } from '../route';

const createResponse = () => ({
  json: jest.fn(),
  status: jest.fn().mockReturnThis(),
});

describe('GET /store/shipping-options', () => {
  it('lists priced shipping options for the cart without importing core flows', async () => {
    const query = {
      graph: jest
        .fn()
        .mockResolvedValueOnce({
          data: [
            {
              id: 'cart_123',
              currency_code: 'cad',
              region_id: 'reg_123',
              region: { id: 'reg_123' },
              sales_channel_id: 'sc_123',
              shipping_address: {
                country_code: 'ca',
              },
            },
          ],
        })
        .mockResolvedValueOnce({
          data: [
            {
              stock_locations: [
                {
                  fulfillment_sets: [{ id: 'fuset_123' }],
                },
              ],
            },
          ],
        })
        .mockResolvedValueOnce({
          data: [
            {
              id: 'so_123',
              calculated_price: {
                calculated_amount: 10,
                is_calculated_price_tax_inclusive: false,
              },
            },
          ],
        }),
    };
    const req = {
      filterableFields: {
        cart_id: 'cart_123',
        is_return: false,
      },
      scope: {
        resolve: jest.fn().mockReturnValue(query),
      },
    };
    const res = createResponse();

    await GET(req as any, res as any);

    expect(query.graph).toHaveBeenCalledTimes(3);
    expect(query.graph).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        entity: 'sales_channels',
        filters: { id: 'sc_123' },
      }),
    );
    expect(query.graph).toHaveBeenNthCalledWith(
      3,
      expect.objectContaining({
        entity: 'shipping_options',
        filters: expect.objectContaining({
          fulfillment_set_id: ['fuset_123'],
        }),
      }),
    );
    expect(res.json).toHaveBeenCalledWith({
      shipping_options: [
        {
          id: 'so_123',
          calculated_price: {
            calculated_amount: 10,
            is_calculated_price_tax_inclusive: false,
          },
          amount: 10,
          is_tax_inclusive: false,
        },
      ],
    });
  });
});
