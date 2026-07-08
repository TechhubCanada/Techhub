import { Metadata } from "next"
import { getStaticCountryCodes } from "@lib/util/static-country-codes"
import { Layout, LayoutColumn } from "@/components/Layout"
import { storeBusinessInfo } from "@lib/business-info"

export const metadata: Metadata = {
  title: "Refund & Returns Policy",
  description:
    "Tech Hub Canada return, exchange, and refund terms for online and in-store purchases.",
}

export async function generateStaticParams() {
  return getStaticCountryCodes().map((countryCode) => ({ countryCode }))
}

export default function RefundPolicyPage() {
  return (
    <Layout className="pt-30 pb-20 md:pt-47 md:pb-32">
      <LayoutColumn
        start={{ base: 1, lg: 2, xl: 3 }}
        end={{ base: 13, lg: 11, xl: 10 }}
      >
        <p className="mb-4 text-sm text-grayscale-500">
          Last updated: July 8, 2026
        </p>
        <h1 className="text-xl md:text-3xl mb-10 md:mb-16">
          Refund & Returns Policy
        </h1>
      </LayoutColumn>
      <LayoutColumn
        start={{ base: 1, lg: 2, xl: 3 }}
        end={{ base: 13, lg: 10, xl: 9 }}
        className="article"
      >
        <p>
          We want customers to be confident when shopping with Tech Hub Canada.
          This policy explains our 30-day return window and the conditions that
          apply to electronics, parts, accessories, consumables, software, and
          service work.
        </p>

        <h2>1. 30-day return window</h2>
        <p>
          Most eligible products can be returned or exchanged within 30 days of
          the purchase date or delivery date, whichever is later. A receipt,
          order confirmation, or other proof of purchase is required.
        </p>

        <h2>2. Return condition</h2>
        <p>
          Items must be returned in like-new condition with original packaging,
          manuals, accessories, cables, adapters, serial-number labels, warranty
          cards, and any included promotional items. Products with missing
          parts, damage, heavy wear, removed serial numbers, or incomplete
          packaging may be refused or may be subject to a restocking or
          replacement-part deduction.
        </p>

        <h2>3. Open-box electronics</h2>
        <p>
          Opened electronics may be inspected before approval. If the item is
          complete and in resaleable condition, we may offer a refund, exchange,
          or store credit. Opened items that cannot be resold as new may be
          subject to a restocking fee.
        </p>

        <h2>4. Non-returnable or limited-return items</h2>
        <ul>
          <li>
            Opened ink, toner, cartridges, batteries, cleaning supplies, and
            other consumables.
          </li>
          <li>
            Opened software, license keys, digital downloads, subscriptions,
            activation cards, and prepaid cards.
          </li>
          <li>
            Special-order, clearance, final-sale, custom-built, or
            custom-configured products.
          </li>
          <li>
            Products damaged by misuse, liquid, power surge, missing parts, or
            unauthorized repair.
          </li>
          <li>
            Repair labour, diagnostic fees, installation labour, data recovery,
            web development, and completed service work.
          </li>
        </ul>

        <h2>5. Defective products</h2>
        <p>
          If a product appears defective within 30 days, contact us with the
          order number and issue details. We may test the item before approving
          an exchange, refund, repair path, or manufacturer warranty direction.
          Manufacturer warranty terms may apply after the return period.
        </p>

        <h2>6. Shipping and return costs</h2>
        <p>
          Original shipping charges are generally non-refundable unless the
          return is caused by our error or an approved defective item. Customers
          are responsible for safely packing return shipments. We recommend a
          tracked shipping method because we cannot process a return we do not
          receive.
        </p>

        <h2>7. Refund timing</h2>
        <p>
          Approved refunds are issued to the original payment method where
          possible. Processing time depends on the payment provider and bank,
          but many refunds appear within 5 to 10 business days after approval.
          Store credit may be offered when the original payment method is not
          available.
        </p>

        <h2>8. How to start a return</h2>
        <p>
          Contact us before sending anything back. Include your order number,
          product name, purchase date, reason for return, photos if the item is
          damaged or defective, and your preferred outcome.
        </p>
        <p>
          Email:{" "}
          <a href={storeBusinessInfo.email.href}>
            {storeBusinessInfo.email.label}
          </a>
          <br />
          Phone:{" "}
          <a href={storeBusinessInfo.phone.href}>
            {storeBusinessInfo.phone.label}
          </a>
          <br />
          Store: {storeBusinessInfo.address.street},{" "}
          {storeBusinessInfo.address.city}, {storeBusinessInfo.address.province}{" "}
          {storeBusinessInfo.address.postalCode}
        </p>
      </LayoutColumn>
    </Layout>
  )
}
