import * as React from "react";
import { Button, Drawer } from "@medusajs/ui";
import { Form } from "./Form/Form";
import { InputField } from "./Form/InputField";
import { TextareaField } from "./Form/TextareaField";
import { SwitchField } from "./Form/SwitchField";
import { useUpdateMarketplaceAccountMutation } from "../hooks/marketplace-accounts";
import {
  MarketplaceAccountFormValues,
  marketplaceAccountFormSchema,
} from "../lib/marketplace-accounts";

export const EditMarketplaceAccountDrawer: React.FC<{
  id: string;
  initialValues: MarketplaceAccountFormValues;
  children: React.ReactNode;
}> = ({ id, initialValues, children }) => {
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const updateMarketplaceAccountMutation =
    useUpdateMarketplaceAccountMutation(id);

  return (
    <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
      <Drawer.Trigger asChild>{children}</Drawer.Trigger>
      <Drawer.Content>
        <Drawer.Header>
          <Drawer.Title>Edit seller account</Drawer.Title>
        </Drawer.Header>
        <Drawer.Body>
          <Form
            schema={marketplaceAccountFormSchema}
            onSubmit={async (values) => {
              await updateMarketplaceAccountMutation.mutateAsync(values);
              setIsDrawerOpen(false);
            }}
            formProps={{
              id: `edit-marketplace-account-${id}-form`,
            }}
            defaultValues={initialValues}
          >
            <div className="flex flex-col gap-4">
              <InputField name="name" label="Display name" isRequired />
              <InputField name="platform" label="Platform" isRequired />
              <InputField name="url" label="Seller account URL" isRequired />
              <InputField name="cta_label" label="Button label" isRequired />
              <InputField
                name="sort_order"
                label="Sort order"
                type="number"
                inputProps={{ min: 0 }}
              />
              <TextareaField
                name="description"
                label="Description"
                textareaProps={{ rows: 3 }}
              />
              <SwitchField name="is_active" label="Show on storefront" />
            </div>
          </Form>
        </Drawer.Body>
        <Drawer.Footer>
          <Drawer.Close asChild>
            <Button variant="secondary">Cancel</Button>
          </Drawer.Close>
          <Button
            type="submit"
            form={`edit-marketplace-account-${id}-form`}
            isLoading={updateMarketplaceAccountMutation.isPending}
          >
            Update
          </Button>
        </Drawer.Footer>
      </Drawer.Content>
    </Drawer>
  );
};
