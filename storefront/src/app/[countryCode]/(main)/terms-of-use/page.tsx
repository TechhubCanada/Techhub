import { Metadata } from "next"
import { getStaticCountryCodes } from "@lib/util/static-country-codes"
import { Layout, LayoutColumn } from "@/components/Layout"
import { storeBusinessInfo } from "@lib/business-info"

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms for using the Tech Hub Canada website.",
}

export async function generateStaticParams() {
  return getStaticCountryCodes().map((countryCode) => ({ countryCode }))
}

export default function TermsOfUsePage() {
  return (
    <Layout className="pt-30 pb-20 md:pt-47 md:pb-32">
      <LayoutColumn
        start={{ base: 1, lg: 2, xl: 3 }}
        end={{ base: 13, lg: 11, xl: 10 }}
      >
        <p className="mb-4 text-sm text-grayscale-500">
          Last updated: July 8, 2026
        </p>
        <h1 className="text-xl md:text-3xl mb-10 md:mb-16">Terms of Use</h1>
      </LayoutColumn>
      <LayoutColumn
        start={{ base: 1, lg: 2, xl: 3 }}
        end={{ base: 13, lg: 10, xl: 9 }}
        className="article"
      >
        <p>
          These terms apply when you use the Tech Hub Canada website. Tech Hub
          Canada is operated by Samsan Inc. By browsing, creating an account,
          placing an order, requesting support, or using our online services,
          you agree to use the website according to these terms.
        </p>

        <h2>1. Website use</h2>
        <p>
          You may use the website to browse products, create an account, place
          orders, request service, contact our store, and manage your customer
          information. You must not misuse the website, interfere with security,
          scrape or copy content without permission, upload malicious code,
          submit false information, or use the site for unlawful activity.
        </p>

        <h2>2. Product information</h2>
        <p>
          We try to keep product names, descriptions, images, prices,
          availability, and specifications accurate. Electronics inventory,
          supplier pricing, manufacturer details, and service availability can
          change. If a listing has an obvious error or a product is no longer
          available, we may correct the listing, contact you, cancel the order,
          or offer another option.
        </p>

        <h2>3. Orders and acceptance</h2>
        <p>
          An order confirmation means we received your order request. It does
          not always mean the order has been finally accepted or shipped. Orders
          may be reviewed for stock, payment, fraud prevention, delivery limits,
          or pricing errors. We may refuse or cancel an order where reasonably
          necessary.
        </p>

        <h2>4. Accounts</h2>
        <p>
          You are responsible for keeping account credentials secure and for
          activity under your account. Contact us promptly if you believe your
          account or order information has been used without authorization.
        </p>

        <h2>5. Payments</h2>
        <p>
          Payments are processed through third-party payment providers. Do not
          send full card numbers by email or message. Orders may be delayed or
          cancelled if payment cannot be verified or if a transaction appears
          suspicious.
        </p>

        <h2>6. Repairs, service, and support</h2>
        <p>
          Repair and technical support timelines are estimates unless confirmed
          in writing. Service work may require inspection before a final quote.
          Customers are responsible for backing up important data before
          providing a device for service. We are not responsible for
          pre-existing device issues, data loss caused by failing hardware, or
          manufacturer restrictions outside our control.
        </p>

        <h2>7. Returns and refunds</h2>
        <p>
          Returns and refunds are handled under our Refund & Returns Policy.
          Some items, opened consumables, special orders, software, licenses,
          repair labour, and final-sale products may have different limits.
        </p>

        <h2>8. Website content</h2>
        <p>
          Website text, images, branding, product organization, and other
          content belong to Tech Hub Canada, Samsan Inc., suppliers, or
          licensors. You may not copy, reproduce, or reuse site content for
          commercial purposes without permission.
        </p>

        <h2>9. Third-party links and services</h2>
        <p>
          The website may link to payment, map, delivery, manufacturer,
          warranty, or support services. Those third-party services have their
          own terms and policies.
        </p>

        <h2>10. Limitation of liability</h2>
        <p>
          The website is provided as available. To the extent permitted by law,
          Tech Hub Canada is not responsible for indirect losses, website
          interruptions, third-party service issues, or damages beyond the
          amount paid for the relevant product or service.
        </p>

        <h2>11. Contact</h2>
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
        </p>
      </LayoutColumn>
    </Layout>
  )
}
