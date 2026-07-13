// External packages
import React from 'react';
import { Text, Heading, Button, Section } from '@react-email/components';

// Types
import { CustomerDTO, OrderDTO } from '@medusajs/framework/types';

// Components
import EmailLayout, { EmailLayoutProps } from './components/EmailLayout';

type Props = {
  customer: Pick<CustomerDTO, 'id' | 'email' | 'first_name' | 'last_name'>;
  order: Pick<OrderDTO, 'id' | 'display_id'> & {
    currency_code?: string;
    payment_status?: string;
    payment_total?: number;
    refunded_total?: number;
  };
};

const getPaymentStatusLabel = (paymentStatus?: string) => {
  if (paymentStatus === 'refunded') {
    return 'Refunded';
  }

  if (paymentStatus === 'partially_refunded') {
    return 'Partially refunded';
  }

  if (paymentStatus === 'authorized') {
    return 'Authorized';
  }

  return 'Paid';
};

export default function OrderUpdateEmail({
  customer,
  order,
  ...emailLayoutProps
}: Props & EmailLayoutProps) {
  const formatter = order.currency_code
    ? new Intl.NumberFormat([], {
        style: 'currency',
        currencyDisplay: 'narrowSymbol',
        currency: order.currency_code,
      })
    : null;
  const showPaymentUpdate =
    Boolean(order.payment_status) &&
    (order.payment_status === 'refunded' ||
      order.payment_status === 'partially_refunded' ||
      typeof order.refunded_total === 'number');

  return (
    <EmailLayout {...emailLayoutProps}>
      <Heading className="text-2xl mt-0 mb-10 font-medium">
        Shipping update
      </Heading>
      <Text className="text-md !mb-8">
        Great news! Your order #{order.display_id} is now on its way to you.
        <br />
        Here are the shipping details.
      </Text>
      <Text className="text-md !mb-10">
        You can track your package by clicking below:
      </Text>
      {showPaymentUpdate && (
        <Section className="border border-solid border-grayscale-200 rounded-xs p-4 mb-10">
          <Text className="text-grayscale-500 !mt-0 !mb-2">
            Payment update
          </Text>
          <Text className="text-md !mt-0 !mb-2">
            {getPaymentStatusLabel(order.payment_status)}
          </Text>
          {formatter && typeof order.payment_total === 'number' && (
            <Text className="m-0">
              {formatter.format(order.payment_total)} paid
            </Text>
          )}
          {formatter &&
            typeof order.refunded_total === 'number' &&
            order.refunded_total > 0 && (
              <Text className="m-0">
                {formatter.format(order.refunded_total)} refunded
              </Text>
            )}
        </Section>
      )}
      <Button
        href={`${
          process.env.STOREFRONT_URL || 'http://localhost:8000'
        }/account/my-orders/${order.id}`}
        className="inline-flex items-center rounded-xs justify-center bg-black text-white h-10 px-6 mb-10"
      >
        Order details
      </Button>
      <Text className="text-md m-0">
        Thank you for choosing TechHub. We&apos;re getting your order ready for
        the next step.
      </Text>
    </EmailLayout>
  );
}

OrderUpdateEmail.PreviewProps = {
  customer: {
    id: '1',
    email: 'example@medusa.local',
    first_name: 'John',
    last_name: 'Doe',
  },
  order: {
    id: 'order_01JCNYH6VADAK90W7CBSPV5BT6',
    display_id: 1,
    currency_code: 'cad',
    payment_status: 'refunded',
    payment_total: 129.99,
    refunded_total: 129.99,
  },
} satisfies Props;
