import type { SubscriberArgs, SubscriberConfig } from "@medusajs/medusa";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";
import type { CustomerDTO } from "@medusajs/framework/types";

type PasswordResetEventData = {
  entity_id: string;
  token: string;
  actor_type: string;
};

const trimTrailingSlash = (url: string) => url.replace(/\/$/, "");

const getAdminResetUrl = (token: string) => {
  const adminUrl = process.env.ADMIN_URL
    ? trimTrailingSlash(process.env.ADMIN_URL)
    : `${trimTrailingSlash(process.env.BACKEND_URL || "http://localhost:9000")}/app`;

  return `${adminUrl}/reset-password?token=${encodeURIComponent(token)}`;
};

export default async function sendPasswordResetNotification({
  event: { data },
  container,
}: SubscriberArgs<PasswordResetEventData>) {
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const notificationModuleService = container.resolve(Modules.NOTIFICATION);

  if (data.actor_type === "user") {
    await notificationModuleService.createNotifications({
      to: data.entity_id,
      channel: "email",
      template: "auth-admin-password-reset",
      data: {
        email: data.entity_id,
        resetUrl: getAdminResetUrl(data.token),
        token: data.token,
      },
    });

    await notificationModuleService.createNotifications({
      to: "admin",
      channel: "feed",
      template: "admin-ui",
      resource_id: data.entity_id,
      resource_type: "user",
      trigger_type: "auth.password_reset",
      data: {
        title: "Admin password reset requested",
        description: `${data.entity_id} requested an Admin password reset.`,
      },
    });

    return;
  }

  const fields = [
    "id",
    "email",
    "first_name",
    "last_name",
  ] as const satisfies (keyof CustomerDTO)[];

  const { data: customers } = await query.graph({
    entity: "customer",
    fields,
    filters: { email: data.entity_id },
  });
  const customer = customers[0] as Pick<CustomerDTO, (typeof fields)[number]>;

  await notificationModuleService.createNotifications({
    to: customer.email,
    channel: "email",
    template:
      data.actor_type === "logged-in-customer"
        ? "auth-password-reset"
        : "auth-forgot-password",
    data: { customer, token: data.token },
  });

  await notificationModuleService.createNotifications({
    to: "admin",
    channel: "feed",
    template: "admin-ui",
    resource_id: customer.id,
    resource_type: "customer",
    trigger_type: "auth.password_reset",
    data: {
      title: "Customer password reset requested",
      description: `${customer.email} requested a password reset.`,
    },
  });
}

export const config: SubscriberConfig = {
  event: "auth.password_reset",
};
