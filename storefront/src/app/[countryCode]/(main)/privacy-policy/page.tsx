import { Metadata } from "next"
import { getStaticCountryCodes } from "@lib/util/static-country-codes"
import { Layout, LayoutColumn } from "@/components/Layout"
import { storeBusinessInfo } from "@lib/business-info"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Tech Hub Canada collects, uses, and protects customer information.",
}

export async function generateStaticParams() {
  return getStaticCountryCodes().map((countryCode) => ({ countryCode }))
}

export default function PrivacyPolicyPage() {
  return (
    <Layout className="pt-30 pb-20 md:pt-47 md:pb-32">
      <LayoutColumn
        start={{ base: 1, lg: 2, xl: 3 }}
        end={{ base: 13, lg: 11, xl: 10 }}
      >
        <p className="mb-4 text-sm text-grayscale-500">
          Last updated: July 8, 2026
        </p>
        <h1 className="text-xl md:text-3xl mb-10 md:mb-16">Privacy Policy</h1>
      </LayoutColumn>
      <LayoutColumn
        start={{ base: 1, lg: 2, xl: 3 }}
        end={{ base: 13, lg: 10, xl: 9 }}
        className="article"
      >
        <p>
          Tech Hub Canada is operated by Samsan Inc. from Markham, Ontario. We
          sell computers, printers, networking equipment, parts, accessories,
          ink, toner, software, repairs, technical support, and web development
          services. This policy explains how we handle personal information when
          you shop with us, create an account, request service, contact our
          store, or use our website.
        </p>

        <h2>1. Information we collect</h2>
        <p>We collect information needed to provide products and services:</p>
        <ul>
          <li>
            Name, email address, phone number, billing address, and shipping
            address.
          </li>
          <li>
            Order details, cart contents, payment status, pickup, delivery,
            returns, and invoices.
          </li>
          <li>
            Account login information, saved addresses, and customer preferences
            if used.
          </li>
          <li>
            Repair and support details, including device type, issue
            description, service notes, and communication history.
          </li>
          <li>
            Messages sent through forms, email, phone, newsletter signup, or
            support channels.
          </li>
          <li>
            Website data such as IP address, browser, device, pages viewed,
            referring pages, approximate location, and cookie choices.
          </li>
        </ul>

        <h2>2. How we use information</h2>
        <ul>
          <li>
            To process orders, payments, delivery, pickup, returns, exchanges,
            repairs, and support requests.
          </li>
          <li>
            To maintain accounts, carts, checkout sessions, fraud prevention,
            and website security.
          </li>
          <li>
            To contact you about orders, service status, quotes, appointments,
            policy updates, or support questions.
          </li>
          <li>
            To improve product listings, search, checkout, customer service,
            store operations, and website performance.
          </li>
          <li>
            To send newsletters or offers only where you signed up or where
            allowed by law.
          </li>
          <li>
            To meet legal, tax, accounting, chargeback, fraud prevention, and
            recordkeeping requirements.
          </li>
        </ul>

        <h2>3. Payments and sensitive information</h2>
        <p>
          Payment card processing is handled by payment providers. We do not ask
          you to email full payment card numbers. We may receive limited payment
          information such as payment status, transaction identifiers, card
          brand, or the last four digits where needed for receipts, refunds, and
          support.
        </p>

        <h2>4. Sharing information</h2>
        <p>
          We do not sell customer personal information. We share information
          only with providers that help operate the business, such as ecommerce,
          payment, fraud prevention, shipping, email, hosting, analytics,
          advertising measurement, repair, support, accounting, and professional
          service providers. We may also disclose information where required by
          law, to enforce our terms, or to protect customers, staff, systems,
          and the business.
        </p>

        <h2>5. Cookies and analytics</h2>
        <p>
          Essential cookies support cart, checkout, account security, region
          selection, and consent storage. Optional cookies for preferences,
          analytics, or marketing are controlled through the Cookie Preferences
          page. See our Cookie Policy for more detail.
        </p>

        <h2>6. Retention</h2>
        <p>
          We keep personal information only as long as needed for the purposes
          described above. Order, tax, warranty, repair, accounting, and fraud
          prevention records may be kept longer where required or reasonably
          necessary. When information is no longer needed, we delete, anonymize,
          or securely archive it.
        </p>

        <h2>7. Security</h2>
        <p>
          We use reasonable administrative, technical, and physical safeguards
          to protect personal information. No website, network, or storage
          method is completely secure, so customers should also protect
          passwords, devices, and account access.
        </p>

        <h2>8. Your privacy choices</h2>
        <p>
          You may ask to access, correct, or delete your personal information,
          subject to legal, security, and business recordkeeping limits. You may
          also unsubscribe from marketing messages and update optional cookie
          choices at any time.
        </p>

        <h2>9. Children</h2>
        <p>
          Our website is intended for customers who can make purchases or
          service requests. We do not knowingly collect personal information
          from young children. If you believe a child provided us personal
          information, contact us and we will review the request.
        </p>

        <h2>10. Contact</h2>
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
          Address: {storeBusinessInfo.address.street},{" "}
          {storeBusinessInfo.address.city}, {storeBusinessInfo.address.province}{" "}
          {storeBusinessInfo.address.postalCode},{" "}
          {storeBusinessInfo.address.country}
        </p>
      </LayoutColumn>
    </Layout>
  )
}
