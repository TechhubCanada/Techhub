import * as React from "react"
import { Metadata } from "next"
import { redirect } from "next/navigation"

import { ButtonAnchor, ButtonLink } from "@/components/Button"
import { getCustomer } from "@lib/data/customer"
import { listOrders } from "@lib/data/orders"

export const metadata: Metadata = {
  title: "Account - Invoices",
  description: "Download invoices for your Tech Hub Canada orders",
}

export default async function AccountInvoicesPage() {
  const customer = await getCustomer().catch(() => null)

  if (!customer) {
    redirect(`/`)
  }

  const { orders } = await listOrders(50, 0)

  return (
    <>
      <h1 className="text-md md:text-lg mb-8 md:mb-13">Invoices</h1>
      {orders.length > 0 ? (
        <div className="flex flex-col gap-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-xs border border-grayscale-200 flex max-sm:flex-col items-start justify-between gap-4 p-4"
            >
              <div>
                <p className="font-semibold">Order {order.display_id}</p>
                <p className="mt-1 text-xs text-grayscale-500">
                  {new Date(order.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <ButtonAnchor
                  href={`/api/orders/${order.id}/invoice`}
                  target="_blank"
                  rel="noreferrer"
                  variant="outline"
                  size="sm"
                  iconName="receipt"
                >
                  Download invoice
                </ButtonAnchor>
                <ButtonLink
                  href={`/account/my-orders/${order.id}`}
                  variant="outline"
                  size="sm"
                >
                  Order details
                </ButtonLink>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-md mt-16">
          You don&apos;t have any invoices yet.
        </p>
      )}
    </>
  )
}
