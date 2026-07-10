import { defineRouteConfig } from '@medusajs/admin-sdk';
import { ArrowUpRightOnBox, PencilSquare } from '@medusajs/icons';
import { Button, Container, Heading, Text } from '@medusajs/ui';

const productHighlights = [
  {
    label: 'Purpose',
    value:
      'A Tech Hub Canada commerce workspace for catalog operations, product enrichment, order support, and storefront coordination.',
  },
  {
    label: 'Commerce stack',
    value:
      'Medusa 2 powers the backend and Admin, while the storefront is built with Next.js for a fast customer shopping experience.',
  },
  {
    label: 'Merchant focus',
    value:
      'The product is shaped around computers, printers, networking, cartridges, accessories, repairs, and technical services.',
  },
];

const agencyDetails = [
  'Product strategy and commerce workflow planning',
  'Medusa Admin customization and operational tooling',
  'Storefront experience design for Tech Hub Canada customers',
  'Catalog presentation, product detail structure, and support workflows',
];

const AboutProductPage = () => {
  return (
    <div className="flex flex-col gap-6">
      <Container className="divide-y p-0">
        <div className="flex flex-col gap-2 px-6 py-4">
          <Heading level="h1">About This Product</Heading>
          <Text size="small" leading="compact" className="text-ui-fg-subtle">
            Made for Tech Hub Canada by Agency by Naman Kataria.
          </Text>
        </div>
        <div className="flex flex-col gap-4 px-6 py-4">
          <Text size="small" leading="compact" className="text-ui-fg-subtle">
            This Admin experience documents the ecommerce product, its operating
            goals, and the agency partner behind the build.
          </Text>
          <div className="grid gap-px bg-ui-border-base md:grid-cols-3">
            {productHighlights.map((item) => (
              <div
                key={item.label}
                className="flex flex-col gap-2 bg-ui-bg-base px-4 py-3"
              >
                <Text size="small" leading="compact" weight="plus">
                  {item.label}
                </Text>
                <Text
                  size="small"
                  leading="compact"
                  className="text-ui-fg-subtle"
                >
                  {item.value}
                </Text>
              </div>
            ))}
          </div>
        </div>
      </Container>

      <Container className="divide-y p-0">
        <div className="px-6 py-4">
          <Heading level="h2">Agency by Naman Kataria</Heading>
        </div>
        <div className="flex flex-col gap-4 px-6 py-4">
          <Text size="small" leading="compact" className="text-ui-fg-subtle">
            Agency by Naman Kataria is credited for product direction, Medusa
            Admin customization, and the commerce experience built around Tech
            Hub Canada's product and service catalog.
          </Text>
          <div className="grid gap-3 md:grid-cols-2">
            {agencyDetails.map((detail) => (
              <div key={detail} className="flex items-start gap-3">
                <div className="mt-1 size-2 rounded-full bg-ui-fg-interactive" />
                <Text size="small" leading="compact">
                  {detail}
                </Text>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
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
        </div>
      </Container>
    </div>
  );
};

export const config = defineRouteConfig({
  label: 'About Product',
  icon: PencilSquare,
});

export default AboutProductPage;
