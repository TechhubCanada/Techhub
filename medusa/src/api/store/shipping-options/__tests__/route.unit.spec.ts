jest.mock('@medusajs/core-flows', () => ({
  listShippingOptionsForCartWithPricingWorkflow: jest.fn(),
}));

import { listShippingOptionsForCartWithPricingWorkflow } from '@medusajs/core-flows';
import { GET } from '../route';

const mockWorkflowFactory =
  listShippingOptionsForCartWithPricingWorkflow as jest.Mock;
const mockWorkflowRun = jest.fn();

const createResponse = () => ({
  json: jest.fn(),
});

describe('GET /store/shipping-options', () => {
  beforeEach(() => {
    mockWorkflowFactory.mockReset();
    mockWorkflowFactory.mockReturnValue({
      run: mockWorkflowRun,
    });
    mockWorkflowRun.mockReset();
  });

  it('lists priced shipping options for the cart', async () => {
    const shippingOptions = [
      {
        id: 'so_123',
        amount: 10,
      },
    ];
    mockWorkflowRun.mockResolvedValue({ result: shippingOptions });

    const req = {
      filterableFields: {
        cart_id: 'cart_123',
        is_return: false,
      },
      queryConfig: {
        fields: ['*'],
      },
      scope: {},
    };
    const res = createResponse();

    await GET(req as any, res as any);

    expect(mockWorkflowFactory).toHaveBeenCalledWith(req.scope);
    expect(mockWorkflowRun).toHaveBeenCalledWith({
      input: {
        cart_id: 'cart_123',
        is_return: false,
      },
    });
    expect(res.json).toHaveBeenCalledWith({
      shipping_options: shippingOptions,
    });
  });
});
