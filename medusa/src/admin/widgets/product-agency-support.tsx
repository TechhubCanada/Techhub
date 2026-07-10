import { defineWidgetConfig } from '@medusajs/admin-sdk';
import { Button, Container, Heading, Text } from '@medusajs/ui';
import { ArrowUpRightOnBox } from '@medusajs/icons';

const ProductAgencySupportWidget = () => {
  return (
    <Container className="divide-y p-0">
      <div className="px-6 py-4">
        <Heading>Agency support</Heading>
      </div>
      <div className="flex flex-col gap-4 px-6 py-4">
        <Text className="text-ui-fg-subtle">
          Need help with product content, image library updates, storefront
          design, or Admin support? Contact Agency by Naman Kataria.
        </Text>
        <a
          href="https://agency.namankataria.com/"
          target="_blank"
          rel="noreferrer"
          className="w-fit"
        >
          <Button size="small" variant="secondary">
            Visit agency website <ArrowUpRightOnBox />
          </Button>
        </a>
      </div>
    </Container>
  );
};

export const config = defineWidgetConfig({
  zone: ['product.details.after', 'product.details.side.after'],
});

export default ProductAgencySupportWidget;
