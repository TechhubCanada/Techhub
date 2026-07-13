import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sdk } from "../lib/client";
import { MarketplaceAccountFormValues } from "../lib/marketplace-accounts";

const marketplaceAccountQueryPredicate = (query: { queryKey: unknown[] }) =>
  query.queryKey[0] === "marketplace-accounts";

export const useCreateMarketplaceAccountMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["marketplace-accounts", "create"],
    mutationFn: async (values: MarketplaceAccountFormValues) => {
      return sdk.client.fetch("/admin/marketplace-accounts", {
        method: "POST",
        body: values,
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        predicate: marketplaceAccountQueryPredicate,
      });
    },
  });
};

export const useUpdateMarketplaceAccountMutation = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["marketplace-accounts", id, "update"],
    mutationFn: async (values: MarketplaceAccountFormValues) => {
      return sdk.client.fetch(`/admin/marketplace-accounts/${id}`, {
        method: "POST",
        body: values,
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        predicate: marketplaceAccountQueryPredicate,
      });
    },
  });
};

export const useDeleteMarketplaceAccountMutation = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["marketplace-accounts", id, "delete"],
    mutationFn: async () => {
      return sdk.client.fetch(`/admin/marketplace-accounts/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        predicate: marketplaceAccountQueryPredicate,
      });
    },
  });
};
