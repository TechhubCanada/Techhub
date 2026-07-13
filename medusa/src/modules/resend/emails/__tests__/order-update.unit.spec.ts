import React from 'react';
import { render } from '@react-email/render';
import OrderUpdateEmail from '../order-update.tsx';

describe('OrderUpdateEmail', () => {
  it('includes refunded payment status when order update data includes it', async () => {
    const html = await render(
      React.createElement(OrderUpdateEmail, {
        customer: {
          id: 'cus_123',
          email: 'customer@example.com',
          first_name: 'Jane',
          last_name: 'Customer',
        },
        order: {
          id: 'order_123',
          display_id: 42,
          currency_code: 'cad',
          payment_status: 'refunded',
          payment_total: 129.99,
          refunded_total: 129.99,
        },
      }),
    );

    expect(html).toContain('Payment update');
    expect(html).toContain('Refunded');
    expect(html).toContain('$129.99');
    expect(html).toContain('refunded');
  });
});
