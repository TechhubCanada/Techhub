import * as React from 'react';
import { defineWidgetConfig } from '@medusajs/admin-sdk';
import { DetailWidgetProps, AdminProduct } from '@medusajs/framework/types';
import { Button, Container, Drawer, Heading, Text } from '@medusajs/ui';
import { PencilSquare } from '@medusajs/icons';
import { z } from 'zod';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { Form } from '../components/Form/Form';
import { InputField } from '../components/Form/InputField';
import { TextareaField } from '../components/Form/TextareaField';
import { withQueryClient } from '../components/QueryClientProvider';

const specLineSchema = z.object({
  label: z.string(),
  value: z.string(),
});

const techSpecsSchema = z.object({
  buying_summary: z.string().optional(),
  specs_text: z.string().optional(),
  best_for_text: z.string().optional(),
  included_text: z.string().optional(),
  compatibility: z.string().optional(),
  support_note: z.string().optional(),
});

type TechProductDetails = {
  buying_summary: string;
  specs: z.infer<typeof specLineSchema>[];
  best_for: string[];
  included: string[];
  compatibility: string;
  support_note: string;
};

const toLines = (value: string | undefined) =>
  (value ?? '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

const specTextToSpecs = (value: string | undefined) =>
  toLines(value).map((line) => {
    const [label, ...rest] = line.split(':');
    const parsedValue = rest.join(':').trim();

    return parsedValue
      ? { label: label.trim(), value: parsedValue }
      : { label: line, value: '' };
  });

const specsToSpecText = (specs: TechProductDetails['specs']) =>
  specs
    .map((spec) => (spec.value ? `${spec.label}: ${spec.value}` : spec.label))
    .join('\n');

const DetailList = ({ title, items }: { title: string; items: string[] }) => {
  if (!items.length) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2">
      <Text size="small" leading="compact" weight="plus">
        {title}
      </Text>
      <div className="flex flex-col gap-1">
        {items.map((item) => (
          <Text
            key={item}
            size="small"
            leading="compact"
            className="text-ui-fg-subtle"
          >
            {item}
          </Text>
        ))}
      </div>
    </div>
  );
};

const ProductTechSpecsWidget = withQueryClient(
  ({ data }: DetailWidgetProps<AdminProduct>) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const queryClient = useQueryClient();
    const formId = `product-${data.id}-tech-specs`;
    const detailsQuery = useQuery({
      queryKey: ['product', data.id, 'tech-specs'],
      queryFn: async ({ signal }) => {
        const response = await fetch(
          `/admin/custom/products/${data.id}/tech-specs`,
          {
            credentials: 'include',
            signal,
          },
        );

        return response.json() as Promise<TechProductDetails>;
      },
    });
    const details = detailsQuery.data;
    const hasDetails = Boolean(
      details &&
        (details.buying_summary ||
          details.specs.length ||
          details.best_for.length ||
          details.included.length ||
          details.compatibility ||
          details.support_note),
    );

    return (
      <Container className="divide-y p-0">
        <div className="flex items-center justify-between px-6 py-4">
          <Heading>Tech product details</Heading>
          {details && (
            <Drawer open={isOpen} onOpenChange={setIsOpen}>
              <Drawer.Trigger asChild>
                <Button size="small" variant="secondary">
                  <PencilSquare /> Edit
                </Button>
              </Drawer.Trigger>
              <Drawer.Content className="max-h-full">
                <Drawer.Header>
                  <Drawer.Title>Edit tech product details</Drawer.Title>
                </Drawer.Header>
                <Drawer.Body className="overflow-auto p-4">
                  <Form
                    schema={techSpecsSchema}
                    defaultValues={{
                      buying_summary: details.buying_summary,
                      specs_text: specsToSpecText(details.specs),
                      best_for_text: details.best_for.join('\n'),
                      included_text: details.included.join('\n'),
                      compatibility: details.compatibility,
                      support_note: details.support_note,
                    }}
                    formProps={{ id: formId }}
                    onSubmit={async (values) => {
                      const payload: TechProductDetails = {
                        buying_summary: values.buying_summary ?? '',
                        specs: specTextToSpecs(values.specs_text),
                        best_for: toLines(values.best_for_text),
                        included: toLines(values.included_text),
                        compatibility: values.compatibility ?? '',
                        support_note: values.support_note ?? '',
                      };

                      await fetch(`/admin/custom/products/${data.id}/tech-specs`, {
                        method: 'POST',
                        credentials: 'include',
                        body: JSON.stringify(payload),
                      });

                      await queryClient.invalidateQueries({
                        queryKey: ['product', data.id, 'tech-specs'],
                      });
                      setIsOpen(false);
                    }}
                  >
                    <div className="flex flex-col gap-4">
                      <TextareaField
                        name="buying_summary"
                        label="Buying summary"
                        textareaProps={{
                          placeholder:
                            'Reliable business laptop for office work, browsing, video calls, and multitasking.',
                        }}
                      />
                      <TextareaField
                        name="specs_text"
                        label="Key specs"
                        textareaProps={{
                          placeholder:
                            'Processor: Intel Core i5\nMemory: 16 GB RAM\nStorage: 512 GB SSD',
                        }}
                      />
                      <TextareaField
                        name="best_for_text"
                        label="Best for"
                        textareaProps={{
                          placeholder: 'Home office\nSchool\nBusiness',
                        }}
                      />
                      <TextareaField
                        name="included_text"
                        label="What is included"
                        textareaProps={{
                          placeholder: 'Device\nCharger\nSetup support',
                        }}
                      />
                      <TextareaField
                        name="compatibility"
                        label="Compatibility notes"
                      />
                      <InputField
                        name="support_note"
                        label="Tech Hub support note"
                      />
                    </div>
                  </Form>
                </Drawer.Body>
                <Drawer.Footer>
                  <Drawer.Close asChild>
                    <Button variant="secondary">Cancel</Button>
                  </Drawer.Close>
                  <Button type="submit" form={formId}>
                    Save
                  </Button>
                </Drawer.Footer>
              </Drawer.Content>
            </Drawer>
          )}
        </div>
        <div className="px-6 py-4">
          {detailsQuery.isLoading ? (
            <Text className="text-ui-fg-subtle">Loading...</Text>
          ) : detailsQuery.isError ? (
            <Text className="text-ui-fg-subtle">
              Unable to load tech product details.
            </Text>
          ) : !hasDetails ? (
            <Text className="text-ui-fg-subtle">
              Add specs, compatibility, and support notes for this product.
            </Text>
          ) : (
            <div className="flex flex-col gap-4">
              {details?.buying_summary && (
                <Text className="text-ui-fg-subtle">
                  {details.buying_summary}
                </Text>
              )}
              {Boolean(details?.specs.length) && (
                <div className="flex flex-col gap-2">
                  <Text size="small" leading="compact" weight="plus">
                    Key specs
                  </Text>
                  <div className="grid gap-2">
                    {details?.specs.map((spec) => (
                      <div
                        key={`${spec.label}-${spec.value}`}
                        className="grid grid-cols-[8rem_minmax(0,1fr)] gap-3"
                      >
                        <Text size="small" leading="compact" weight="plus">
                          {spec.label}
                        </Text>
                        <Text
                          size="small"
                          leading="compact"
                          className="text-ui-fg-subtle"
                        >
                          {spec.value || '-'}
                        </Text>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="grid gap-4 md:grid-cols-2">
                <DetailList title="Best for" items={details?.best_for ?? []} />
                <DetailList
                  title="What is included"
                  items={details?.included ?? []}
                />
              </div>
              {details?.compatibility && (
                <div className="flex flex-col gap-2">
                  <Text size="small" leading="compact" weight="plus">
                    Compatibility
                  </Text>
                  <Text
                    size="small"
                    leading="compact"
                    className="text-ui-fg-subtle"
                  >
                    {details.compatibility}
                  </Text>
                </div>
              )}
              {details?.support_note && (
                <div className="flex flex-col gap-2">
                  <Text size="small" leading="compact" weight="plus">
                    Tech Hub support
                  </Text>
                  <Text
                    size="small"
                    leading="compact"
                    className="text-ui-fg-subtle"
                  >
                    {details.support_note}
                  </Text>
                </div>
              )}
            </div>
          )}
        </div>
      </Container>
    );
  },
);

export const config = defineWidgetConfig({
  zone: 'product.details.after',
});

export default ProductTechSpecsWidget;
