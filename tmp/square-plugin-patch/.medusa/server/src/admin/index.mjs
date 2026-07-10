import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { defineRouteConfig } from "@medusajs/admin-sdk";
import { CheckCircleSolid, SquaresPlus } from "@medusajs/icons";
import { createDataTableColumnHelper, usePrompt, toast, Button, useDataTable, Container, Heading, Badge, Switch, Label, DataTable, Input, Select, clx, Divider, Tabs, Toaster } from "@medusajs/ui";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { useState, useMemo, useEffect } from "react";
import Medusa from "@medusajs/js-sdk";
const sdk = new Medusa({
  baseUrl: "/",
  debug: false,
  auth: {
    type: "session"
  }
});
const getCurrentSearchParams = () => new URLSearchParams(window.location.search);
const replaceCurrentSearchParams = (params) => {
  const query = params.toString();
  const nextUrl = `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`;
  window.history.replaceState(window.history.state, "", nextUrl);
};
const createColumns = (main_location_id) => {
  const columnHelper = createDataTableColumnHelper();
  return [
    columnHelper.accessor("name", {
      header: "Name"
    }),
    columnHelper.accessor("address.address_line_1", {
      header: "Address"
    }),
    columnHelper.accessor("currency", {
      header: "Currency"
    }),
    columnHelper.display({
      id: "status",
      header: "Status",
      cell: ({ row }) => {
        if (row.original.id === main_location_id) {
          return /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-ui-fg-subtle", children: [
            /* @__PURE__ */ jsx(CheckCircleSolid, { className: "text-ui-fg-interactive" }),
            /* @__PURE__ */ jsx("span", { className: "text-sm", children: "Main Location" })
          ] });
        }
        return null;
      }
    }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => /* @__PURE__ */ jsx(
        SetMainLocationButton,
        {
          location: row.original,
          isMain: row.original.id === main_location_id
        }
      )
    })
  ];
};
const SetMainLocationButton = ({
  location,
  isMain
}) => {
  const dialog = usePrompt();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async ({ locationId, currency }) => {
      return sdk.client.fetch("/admin/square/locations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: { location_id: locationId, currency }
      });
    },
    onSuccess: () => {
      toast.success("Main location updated successfully");
      queryClient.invalidateQueries({ queryKey: [["locations", "config"]] });
      window.location.reload();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update main location");
    }
  });
  const handleSetMain = async () => {
    const confirmed = await dialog({
      title: "Set as Main Location",
      description: `Are you sure you want to set "${location.name}" as the main location? This will be used for all payment processing.`,
      variant: "confirmation",
      confirmText: "Set as Main",
      cancelText: "Cancel"
    });
    if (confirmed) {
      mutation.mutate({ locationId: location.id, currency: location.currency });
    }
  };
  if (isMain) {
    return null;
  }
  return /* @__PURE__ */ jsx(
    Button,
    {
      size: "small",
      variant: "secondary",
      onClick: handleSetMain,
      isLoading: mutation.isPending,
      children: "Set as Main"
    }
  );
};
const AccountTab = () => {
  var _a;
  const queryClient = useQueryClient();
  const dialog = usePrompt();
  const [isSandbox, setIsSandbox] = useState(true);
  const { data, isLoading } = useQuery({
    queryFn: () => sdk.client.fetch("/admin/square/config"),
    queryKey: [["config"]]
  });
  const {
    data: locationsData,
    isLoading: isLoadingLocations,
    isError
  } = useQuery({
    queryFn: () => sdk.client.fetch("/admin/square/locations"),
    queryKey: [["locations"]]
  });
  const disconnectMutation = useMutation({
    mutationFn: async () => {
      return sdk.client.fetch("/admin/square/oauth/revoke", {
        method: "DELETE"
      });
    },
    onSuccess: () => {
      toast.success("Successfully disconnected from Square");
      queryClient.invalidateQueries({ queryKey: [["config"]] });
      queryClient.invalidateQueries({ queryKey: [["locations"]] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to disconnect from Square");
    }
  });
  const handleDisconnect = async () => {
    const confirmed = await dialog({
      title: "Disconnect from Square",
      description: "Are you sure you want to disconnect your Square account? This will revoke the access token and remove the configuration.",
      variant: "confirmation",
      confirmText: "Disconnect",
      cancelText: "Cancel"
    });
    if (confirmed) {
      disconnectMutation.mutate();
    }
  };
  const columns = useMemo(
    () => createColumns((locationsData == null ? void 0 : locationsData.main_location_id) ?? null),
    [locationsData == null ? void 0 : locationsData.main_location_id]
  );
  const table = useDataTable({
    columns,
    data: (locationsData == null ? void 0 : locationsData.locations) || [],
    getRowId: (location) => location.id,
    rowCount: locationsData ? locationsData.locations.length : 0,
    isLoading: isLoadingLocations
  });
  const oauthUrl = `/admin/square/oauth/start?is_sandbox=${isSandbox}`;
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-8", children: [
    /* @__PURE__ */ jsxs(Container, { children: [
      /* @__PURE__ */ jsx(Heading, { className: "mb-3", children: "Square Config" }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-row items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
          /* @__PURE__ */ jsx("p", { children: "Link your Square account" }),
          data && /* @__PURE__ */ jsx(Badge, { color: data.is_sandbox ? "orange" : "green", children: data.is_sandbox ? "Sandbox" : "Production" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex items-center gap-4", children: data ? /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(Button, { disabled: true, isLoading, children: "Account linked" }),
          /* @__PURE__ */ jsx(
            Button,
            {
              variant: "danger",
              onClick: handleDisconnect,
              isLoading: disconnectMutation.isPending,
              children: "Disconnect"
            }
          )
        ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(
              Switch,
              {
                id: "sandbox-toggle",
                checked: isSandbox,
                onCheckedChange: setIsSandbox
              }
            ),
            /* @__PURE__ */ jsx(Label, { htmlFor: "sandbox-toggle", children: "Sandbox" })
          ] }),
          /* @__PURE__ */ jsx(Button, { isLoading, asChild: true, children: /* @__PURE__ */ jsx("a", { href: oauthUrl, children: "Link your account" }) })
        ] }) })
      ] })
    ] }),
    data && /* @__PURE__ */ jsxs(Container, { children: [
      /* @__PURE__ */ jsxs(Heading, { className: "flex justify-between mb-3 gap-2", children: [
        "Select main location",
        ((_a = data == null ? void 0 : data.location_id) == null ? void 0 : _a.length) === 0 && /* @__PURE__ */ jsx(Badge, { color: "orange", children: "Pick a location to finish setting up your Square sync." })
      ] }),
      !isError ? /* @__PURE__ */ jsxs(DataTable, { instance: table, children: [
        /* @__PURE__ */ jsx(DataTable.Toolbar, { className: "flex flex-col items-start justify-between gap-2 md:flex-row md:items-center", children: /* @__PURE__ */ jsx(Heading, { children: "Locations" }) }),
        /* @__PURE__ */ jsx(DataTable.Table, {})
      ] }) : /* @__PURE__ */ jsx("p", { children: "We were unable to list the locations associated with your Square account" })
    ] })
  ] });
};
const ApplePayTab = () => {
  const [domain, setDomain] = useState("");
  const queryClient = useQueryClient();
  const { data: config2 } = useQuery({
    queryFn: () => sdk.client.fetch("/admin/square/config"),
    queryKey: [["config"]]
  });
  const registerMutation = useMutation({
    mutationFn: async (domainName) => {
      return sdk.client.fetch("/admin/square/config/apple", {
        method: "POST",
        body: { domain_name: domainName }
      });
    },
    onSuccess: () => {
      toast.success("Domain registered for Apple Pay");
      setDomain("");
      queryClient.invalidateQueries({ queryKey: [["config"]] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to register domain");
    }
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!domain.trim()) return;
    registerMutation.mutate(domain.trim());
  };
  return /* @__PURE__ */ jsxs(Container, { children: [
    /* @__PURE__ */ jsx(Heading, { className: "mb-3", children: "Apple Pay Configuration" }),
    /* @__PURE__ */ jsx("p", { className: "mb-4 text-ui-fg-subtle", children: "Register your domain to enable Apple Pay through Square." }),
    (config2 == null ? void 0 : config2.apple_pay_domain) && /* @__PURE__ */ jsxs("div", { className: "mb-4 flex items-center gap-2", children: [
      /* @__PURE__ */ jsx("span", { className: "text-ui-fg-subtle", children: "Registered domain:" }),
      /* @__PURE__ */ jsx(Badge, { color: "green", children: config2.apple_pay_domain })
    ] }),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "flex flex-col gap-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2 w-64", children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "domain", children: "Domain" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            id: "domain",
            placeholder: "example.com",
            value: domain,
            onChange: (e) => setDomain(e.target.value)
          }
        )
      ] }),
      /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
        Button,
        {
          type: "submit",
          isLoading: registerMutation.isPending,
          disabled: !domain.trim(),
          children: "Register Domain"
        }
      ) })
    ] })
  ] });
};
const SOURCE = {
  SQUARE: "square",
  MEDUSA: "medusa"
};
const DEFAULT_SETTINGS = {
  sync_source: "",
  sync_orders: false,
  sync_catalog: false,
  sync_customers: false,
  is_synchronizing: false
};
const SettingsTab = () => {
  const [metadata, setMetadata] = useState(DEFAULT_SETTINGS);
  const queryClient = useQueryClient();
  const { data: config2 } = useQuery({
    queryFn: () => sdk.client.fetch("/admin/square/config"),
    queryKey: [["config"]]
  });
  const updateSettingsMutation = useMutation({
    mutationFn: async (body) => {
      return sdk.client.fetch("/admin/square/config", {
        method: "POST",
        body
      });
    },
    onSuccess: () => {
      toast.success("Settings updated successfully");
      queryClient.invalidateQueries({ queryKey: [["config"]] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update settings");
    }
  });
  const handleChangeData = (key, value) => {
    setMetadata((prevMetadata) => ({
      ...prevMetadata,
      [key]: value
    }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    updateSettingsMutation.mutate(metadata);
  };
  const handleStopSync = async (e) => {
    toast.success("Stopping sync...");
    e.preventDefault();
    handleChangeData("is_synchronizing", false);
    updateSettingsMutation.mutate({ ...metadata, is_synchronizing: false });
  };
  const handleStartSync = async () => {
    var _a;
    toast.success("Starting sync...");
    handleChangeData("is_synchronizing", true);
    const workflow = metadata.sync_source === SOURCE.SQUARE ? "sync-square-medusa-workflow" : "sync-medusa-square-workflow";
    const execution = await sdk.client.fetch(`/admin/workflows-executions/${workflow}/run`, {
      method: "POST"
    });
    if ((_a = execution == null ? void 0 : execution.acknowledgement) == null ? void 0 : _a.hasFailed) {
      handleChangeData("is_synchronizing", false);
      toast.success("Failed to start sync");
    }
  };
  const { is_synchronizing: _, ...localClean } = metadata;
  const { is_synchronizing: __, ...serverClean } = (config2 == null ? void 0 : config2.metadata) ?? {};
  const disableSync = JSON.stringify(localClean) !== JSON.stringify(serverClean);
  useEffect(() => {
    setMetadata((config2 == null ? void 0 : config2.metadata) ?? {});
  }, [config2]);
  return /* @__PURE__ */ jsx(Container, { className: "flex flex-col gap-5", children: /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "flex flex-col gap-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2", children: [
      /* @__PURE__ */ jsx(Heading, { className: "flex gap-2 items-center", children: "Data Source" }),
      /* @__PURE__ */ jsx("p", { className: "text-ui-fg-subtle", children: "Choose your primary data source: Square or Medusa" }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
        /* @__PURE__ */ jsx("div", { className: "w-64", children: /* @__PURE__ */ jsxs(
          Select,
          {
            value: metadata == null ? void 0 : metadata.sync_source,
            disabled: metadata == null ? void 0 : metadata.is_synchronizing,
            onValueChange: (value) => value.length && handleChangeData("sync_source", value),
            children: [
              /* @__PURE__ */ jsx(Select.Trigger, { children: /* @__PURE__ */ jsx(Select.Value, { placeholder: "Select a source" }) }),
              /* @__PURE__ */ jsx(Select.Content, { children: Object.values(SOURCE).map((item) => /* @__PURE__ */ jsx(Select.Item, { value: item, className: "capitalize", children: item }, item)) })
            ]
          }
        ) }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2 items-end", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
            metadata.is_synchronizing && /* @__PURE__ */ jsx(
              Button,
              {
                type: "button",
                variant: "danger",
                onClick: handleStopSync,
                children: "Stop Synchronization"
              }
            ),
            /* @__PURE__ */ jsx(
              Button,
              {
                type: "button",
                disabled: disableSync || (metadata == null ? void 0 : metadata.is_synchronizing) || (config2 == null ? void 0 : config2.metadata) === null,
                onClick: handleStartSync,
                className: clx((metadata == null ? void 0 : metadata.is_synchronizing) && "animate-pulse"),
                children: (metadata == null ? void 0 : metadata.is_synchronizing) ? "Updating your catalog..." : "Run Synchronization"
              }
            )
          ] }),
          disableSync && /* @__PURE__ */ jsx("p", { className: "text-ui-tag-orange-text", children: "Changes must be saved before running the Square sync" })
        ] })
      ] }),
      /* @__PURE__ */ jsx(Divider, { className: "mt-2" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2", children: [
      /* @__PURE__ */ jsx(Heading, { children: "What should we sync?" }),
      /* @__PURE__ */ jsx("p", { className: "text-ui-fg-subtle", children: "Toggle the data you want to keep updated" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsx(
        Switch,
        {
          id: "sync_catalog",
          checked: metadata == null ? void 0 : metadata.sync_catalog,
          onCheckedChange: (checked) => handleChangeData("sync_catalog", checked)
        }
      ),
      /* @__PURE__ */ jsx(Label, { htmlFor: "sync_catalog", children: "Catalog" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsx(
        Switch,
        {
          id: "sync_customers",
          checked: metadata == null ? void 0 : metadata.sync_customers,
          onCheckedChange: (checked) => handleChangeData("sync_customers", checked)
        }
      ),
      /* @__PURE__ */ jsx(Label, { htmlFor: "sync_customers", children: "Customers" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex gap-4 items-center justify-between", children: [
      /* @__PURE__ */ jsxs("p", { className: "text-ui-fg-subtle", children: [
        /* @__PURE__ */ jsx("strong", { children: "Note:" }),
        " Orders are automatically synced from Medusa to Square by default. No manual configuration or activation is required."
      ] }),
      /* @__PURE__ */ jsx(
        Button,
        {
          type: "submit",
          className: "min-w-fit",
          isLoading: updateSettingsMutation == null ? void 0 : updateSettingsMutation.isPending,
          children: "Save Changes"
        }
      )
    ] })
  ] }) });
};
const SquarePage = () => {
  var _a;
  const { data } = useQuery({
    queryFn: () => sdk.client.fetch("/admin/square/config"),
    queryKey: [["config"]]
  });
  useEffect(() => {
    const searchParams = getCurrentSearchParams();
    const status = searchParams.get("status");
    if (status === "ok") {
      toast.success("Successfully linked to Square");
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.delete("status");
      replaceCurrentSearchParams(newSearchParams);
    }
  }, []);
  const showTabs = (data == null ? void 0 : data.integration_key) && ((_a = data == null ? void 0 : data.location_id) == null ? void 0 : _a.length) > 0;
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(Tabs, { defaultValue: "account", children: [
      /* @__PURE__ */ jsxs(Tabs.List, { children: [
        /* @__PURE__ */ jsx(Tabs.Trigger, { value: "account", children: "Account" }),
        showTabs && /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(Tabs.Trigger, { value: "apple-pay", children: "Apple Pay" }),
          /* @__PURE__ */ jsx(Tabs.Trigger, { value: "settings", children: "Sync Settings" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-4", children: [
        /* @__PURE__ */ jsx(Tabs.Content, { value: "account", children: /* @__PURE__ */ jsx(AccountTab, {}) }),
        showTabs && /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(Tabs.Content, { value: "apple-pay", children: /* @__PURE__ */ jsx(ApplePayTab, {}) }),
          /* @__PURE__ */ jsx(Tabs.Content, { value: "settings", children: /* @__PURE__ */ jsx(SettingsTab, {}) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx(Toaster, {})
  ] });
};
const handle = {
  breadcrumb: () => "Square"
};
const config = defineRouteConfig({
  label: "Square",
  icon: SquaresPlus
});
const i18nTranslations0 = {};
const widgetModule = { widgets: [] };
const routeModule = {
  routes: [
    {
      Component: SquarePage,
      path: "/square",
      handle
    }
  ]
};
const menuItemModule = {
  menuItems: [
    {
      label: config.label,
      icon: config.icon,
      path: "/square",
      nested: void 0
    }
  ]
};
const formModule = { customFields: {} };
const displayModule = {
  displays: {}
};
const i18nModule = { resources: i18nTranslations0 };
const plugin = {
  widgetModule,
  routeModule,
  menuItemModule,
  formModule,
  displayModule,
  i18nModule
};
export {
  plugin as default
};
