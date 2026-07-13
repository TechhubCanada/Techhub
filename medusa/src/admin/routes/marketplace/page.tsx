import * as React from "react";
import { defineRouteConfig } from "@medusajs/admin-sdk";
import {
  ArrowUpRightOnBox,
  EllipsisHorizontal,
  PencilSquare,
  ShoppingBag,
  Trash,
} from "@medusajs/icons";
import {
  Badge,
  Button,
  Container,
  Drawer,
  DropdownMenu,
  Heading,
  IconButton,
  Prompt,
  Table,
  Text,
} from "@medusajs/ui";
import { useQuery } from "@tanstack/react-query";
import { Form } from "../../components/Form/Form";
import { InputField } from "../../components/Form/InputField";
import { TextareaField } from "../../components/Form/TextareaField";
import { SwitchField } from "../../components/Form/SwitchField";
import { withQueryClient } from "../../components/QueryClientProvider";
import {
  useCreateMarketplaceAccountMutation,
  useDeleteMarketplaceAccountMutation,
} from "../../hooks/marketplace-accounts";
import { EditMarketplaceAccountDrawer } from "../../components/EditMarketplaceAccountDrawer";
import { sdk } from "../../lib/client";
import {
  MarketplaceAccount,
  MarketplaceAccountsResponse,
  marketplaceAccountFormSchema,
} from "../../lib/marketplace-accounts";

const emptyMarketplaceAccountValues = {
  name: "",
  platform: "",
  description: "",
  url: "",
  cta_label: "",
  sort_order: 0,
  is_active: true,
};

const DeleteMarketplaceAccountPrompt: React.FC<{
  account: MarketplaceAccount;
  children: React.ReactNode;
}> = ({ account, children }) => {
  const [isPromptOpen, setIsPromptOpen] = React.useState(false);
  const deleteMutation = useDeleteMarketplaceAccountMutation(account.id);

  return (
    <Prompt open={isPromptOpen} onOpenChange={setIsPromptOpen}>
      <Prompt.Trigger asChild>{children}</Prompt.Trigger>
      <Prompt.Content>
        <Prompt.Header>
          <Prompt.Title>Delete {account.name}?</Prompt.Title>
          <Prompt.Description>
            This removes the seller account from the storefront marketplace
            section.
          </Prompt.Description>
        </Prompt.Header>
        <Prompt.Footer>
          <Prompt.Cancel>Cancel</Prompt.Cancel>
          <Prompt.Action
            onClick={async () => {
              await deleteMutation.mutateAsync();
              setIsPromptOpen(false);
            }}
          >
            Delete
          </Prompt.Action>
        </Prompt.Footer>
      </Prompt.Content>
    </Prompt>
  );
};

const MarketplaceAccountFormFields = () => (
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
);

const MarketplaceAccountsPage = () => {
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = React.useState(false);
  const createMarketplaceAccountMutation =
    useCreateMarketplaceAccountMutation();

  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["marketplace-accounts"],
    queryFn: async () => {
      return sdk.client.fetch<MarketplaceAccountsResponse>(
        "/admin/marketplace-accounts?limit=100",
      );
    },
  });

  return (
    <Container className="px-0">
      <div className="mb-4 flex items-center justify-between gap-4 px-6">
        <div>
          <Heading level="h2">Marketplace</Heading>
          <Text className="text-ui-fg-subtle" size="small">
            Manage external seller accounts shown on the storefront.
          </Text>
        </div>
        <Drawer open={isCreateDrawerOpen} onOpenChange={setIsCreateDrawerOpen}>
          <Drawer.Trigger asChild>
            <Button variant="secondary" size="small">
              Add account
            </Button>
          </Drawer.Trigger>
          <Drawer.Content>
            <Drawer.Header>
              <Drawer.Title>Add seller account</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body>
              <Form
                schema={marketplaceAccountFormSchema}
                onSubmit={async (values) => {
                  await createMarketplaceAccountMutation.mutateAsync(values);
                  setIsCreateDrawerOpen(false);
                }}
                defaultValues={emptyMarketplaceAccountValues}
                formProps={{ id: "create-marketplace-account-form" }}
              >
                <MarketplaceAccountFormFields />
              </Form>
            </Drawer.Body>
            <Drawer.Footer>
              <Drawer.Close asChild>
                <Button variant="secondary">Cancel</Button>
              </Drawer.Close>
              <Button
                type="submit"
                form="create-marketplace-account-form"
                isLoading={createMarketplaceAccountMutation.isPending}
              >
                Create
              </Button>
            </Drawer.Footer>
          </Drawer.Content>
        </Drawer>
      </div>

      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Platform</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
            <Table.HeaderCell>Sort</Table.HeaderCell>
            <Table.HeaderCell>&nbsp;</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {isLoading && (
            <Table.Row>
              {/* @ts-ignore */}
              <Table.Cell colSpan={5}>
                <Text>Loading seller accounts...</Text>
              </Table.Cell>
            </Table.Row>
          )}
          {isError && (
            <Table.Row>
              {/* @ts-ignore */}
              <Table.Cell colSpan={5}>
                <Text>Could not load seller accounts.</Text>
              </Table.Cell>
            </Table.Row>
          )}
          {isSuccess && data.marketplace_accounts.length === 0 && (
            <Table.Row>
              {/* @ts-ignore */}
              <Table.Cell colSpan={5}>
                <Text>No seller accounts added yet.</Text>
              </Table.Cell>
            </Table.Row>
          )}
          {isSuccess &&
            data.marketplace_accounts.map((account) => (
              <Table.Row key={account.id}>
                <Table.Cell>
                  <div className="flex flex-col">
                    <Text size="small" weight="plus">
                      {account.name}
                    </Text>
                    <Text
                      size="small"
                      className="max-w-[28rem] truncate text-ui-fg-subtle"
                    >
                      {account.url}
                    </Text>
                  </div>
                </Table.Cell>
                <Table.Cell>{account.platform}</Table.Cell>
                <Table.Cell>
                  <Badge color={account.is_active ? "green" : "grey"}>
                    {account.is_active ? "Active" : "Hidden"}
                  </Badge>
                </Table.Cell>
                <Table.Cell>{account.sort_order}</Table.Cell>
                <Table.Cell className="text-right">
                  <DropdownMenu>
                    <DropdownMenu.Trigger asChild>
                      <IconButton size="small" variant="transparent">
                        <EllipsisHorizontal />
                      </IconButton>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content>
                      <DropdownMenu.Item asChild>
                        <a
                          href={account.url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex w-full items-center gap-2"
                        >
                          <ArrowUpRightOnBox className="text-ui-fg-subtle" />
                          Open link
                        </a>
                      </DropdownMenu.Item>
                      <DropdownMenu.Item asChild>
                        <EditMarketplaceAccountDrawer
                          id={account.id}
                          initialValues={{
                            name: account.name,
                            platform: account.platform,
                            description: account.description ?? "",
                            url: account.url,
                            cta_label: account.cta_label,
                            sort_order: account.sort_order,
                            is_active: account.is_active,
                          }}
                        >
                          <Button
                            variant="transparent"
                            className="flex w-full items-center justify-start gap-2"
                          >
                            <PencilSquare className="text-ui-fg-subtle" />
                            Edit
                          </Button>
                        </EditMarketplaceAccountDrawer>
                      </DropdownMenu.Item>
                      <DropdownMenu.Separator />
                      <DropdownMenu.Item asChild>
                        <DeleteMarketplaceAccountPrompt account={account}>
                          <Button
                            variant="transparent"
                            className="flex w-full items-center justify-start gap-2"
                          >
                            <Trash className="text-ui-fg-subtle" />
                            Delete
                          </Button>
                        </DeleteMarketplaceAccountPrompt>
                      </DropdownMenu.Item>
                    </DropdownMenu.Content>
                  </DropdownMenu>
                </Table.Cell>
              </Table.Row>
            ))}
        </Table.Body>
      </Table>
    </Container>
  );
};

export default withQueryClient(MarketplaceAccountsPage);

export const config = defineRouteConfig({
  label: "Marketplace",
  icon: ShoppingBag,
});
