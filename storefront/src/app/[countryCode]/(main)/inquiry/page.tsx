import { Metadata } from "next"
import Image from "next/image"
import { getStaticCountryCodes } from "@lib/util/static-country-codes"
import { storeBusinessInfo } from "@lib/business-info"
import { Layout, LayoutColumn } from "@/components/Layout"
import { LocalizedButtonLink } from "@/components/LocalizedLink"
import { ButtonAnchor } from "@/components/Button"
import { ContactInquiryForm } from "./ContactInquiryForm"
import { createPageMetadata, getLocalizedPath } from "@lib/seo"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ countryCode: string }>
}): Promise<Metadata> {
  const { countryCode } = await params

  return createPageMetadata({
    title: "B2B Technology & Service Inquiry",
    description:
      "Contact TechHub for bulk technology orders, product sourcing, repairs, network setups, and business IT support.",
    path: getLocalizedPath(countryCode, "inquiry"),
    keywords: [
      "B2B technology",
      "bulk computer orders",
      "business IT support",
      "computer repair inquiry",
    ],
    image: "/images/content/techhub-dual-monitor-workstation.png",
  })
}

export async function generateStaticParams() {
  return getStaticCountryCodes().map((countryCode) => ({ countryCode }))
}

const inquirySubject = encodeURIComponent("B2B, store, and specialized request")
const inquiryBody = encodeURIComponent(`Hello TechHub,

I would like help with a B2B, store, or specialized request.

Company:
Name:
Phone:
Request type:
Products or service needed:
Quantity:
Timeline:
Budget range:
Additional details:`)

const inquiryHref = `${storeBusinessInfo.email.href}?subject=${inquirySubject}&body=${inquiryBody}`

const requestTypes = [
  {
    title: "Business devices",
    body: "Laptops, desktops, monitors, printers, and accessories for teams.",
  },
  {
    title: "Network setups",
    body: "Routers, switches, cabling, Wi-Fi, and office connectivity.",
  },
  {
    title: "Store requests",
    body: "Availability checks, special orders, parts, and product sourcing.",
  },
  {
    title: "Repairs and service",
    body: "Device repair, setup support, diagnostics, and refresh planning.",
  },
] as const

const featureSections = [
  {
    eyebrow: "Procurement",
    title: "Products for the way your team actually works.",
    body: "Tell us what devices, accessories, or quantities you need. We can help source everyday tech for offices, schools, contractors, and growing teams.",
    image: "/images/content/techhub-laptop-product-table.png",
    alt: "Laptop computer on a clean product display table",
  },
  {
    eyebrow: "Support",
    title: "Service support after the order.",
    body: "Add repairs, setup, networking, or device refresh planning to the same inquiry so the request is handled as one complete project.",
    image: "/images/content/techhub-repair-workbench.png",
    alt: "Computer repair workbench with tools and devices",
  },
] as const

export default function InquiryPage() {
  return (
    <>
      <section className="relative isolate overflow-hidden bg-white pt-24 pb-10 text-black md:pt-28 md:pb-12 lg:pt-10 lg:pb-4">
        <Layout className="items-center gap-y-8 lg:items-center">
          <LayoutColumn
            start={{ base: 1, lg: 1 }}
            end={{ base: 13, lg: 6 }}
            className="text-left"
          >
            <p className="mb-3 text-xs uppercase tracking-[0.16em] text-grayscale-500 md:text-sm">
              Direct intake
            </p>
            <h1 className="max-w-150 text-[2rem] leading-tight md:text-[2.75rem] lg:text-[2.25rem]">
              Product, repair, and setup requests.
            </h1>
            <p className="mt-4 max-w-120 text-sm leading-relaxed text-grayscale-600 md:text-base lg:max-w-110">
              Tell us what you need, the quantity, and the timeline. The team
              will route your request to the right next step.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <ButtonAnchor
                href={inquiryHref}
                className="bg-black text-white hover:bg-grayscale-800"
              >
                Start inquiry
              </ButtonAnchor>
              <LocalizedButtonLink
                href="/store"
                variant="outline"
                className="border-black text-black hover:border-grayscale-500 hover:text-grayscale-600"
              >
                Browse products
              </LocalizedButtonLink>
            </div>
          </LayoutColumn>
          <LayoutColumn start={{ base: 1, lg: 7 }} end={13}>
            <div className="overflow-hidden rounded-sm border border-grayscale-200 bg-white text-black shadow-xl">
              <div className="border-b border-grayscale-200 bg-grayscale-50 px-5 py-4 md:px-6 lg:py-2.5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="mb-1 text-xs uppercase tracking-[0.14em] text-grayscale-500">
                      Contact form
                    </p>
                    <h2 className="max-w-120 text-[1.35rem] leading-tight md:text-[1.5rem]">
                      Send the details directly.
                    </h2>
                  </div>
                  <ButtonAnchor
                    href={storeBusinessInfo.phone.href}
                    variant="outline"
                    size="sm"
                    className="w-fit"
                  >
                    Call {storeBusinessInfo.phone.label}
                  </ButtonAnchor>
                </div>
              </div>
              <div className="p-5 md:p-6 lg:p-3">
                <ContactInquiryForm />
              </div>
            </div>
          </LayoutColumn>
        </Layout>
      </section>

      <div className="py-20 md:py-36">
        <Layout className="mb-20 md:mb-32">
          <LayoutColumn start={{ base: 1, lg: 3 }} end={{ base: 13, lg: 11 }}>
            <h2 className="mx-auto mb-10 max-w-180 text-center text-xl md:mb-16 md:text-3xl">
              One request can cover products, quantities, service, and setup.
            </h2>
          </LayoutColumn>
          {requestTypes.map((requestType) => (
            <LayoutColumn
              key={requestType.title}
              start={{ base: 1, lg: 3 }}
              end={{ base: 13, lg: 11 }}
              className="border-t border-grayscale-200 py-6 md:py-8"
            >
              <div className="grid gap-3 md:grid-cols-[0.45fr_0.55fr] md:gap-10">
                <h3 className="text-md md:text-xl">{requestType.title}</h3>
                <p className="text-sm leading-relaxed text-grayscale-600 md:text-base">
                  {requestType.body}
                </p>
              </div>
            </LayoutColumn>
          ))}
        </Layout>

        {featureSections.map((section, index) => (
          <Layout
            key={section.title}
            className="mb-20 items-center last:mb-0 md:mb-32"
          >
            <LayoutColumn
              start={{ base: 1, lg: index % 2 === 0 ? 1 : 8 }}
              end={{ base: 13, lg: index % 2 === 0 ? 7 : 13 }}
              className={index % 2 === 0 ? "" : "lg:order-2"}
            >
              <Image
                src={section.image}
                width={1600}
                height={1200}
                alt={section.alt}
                className="aspect-[4/3] w-full rounded-md object-cover"
              />
            </LayoutColumn>
            <LayoutColumn
              start={{ base: 1, lg: index % 2 === 0 ? 8 : 2 }}
              end={{ base: 13, lg: index % 2 === 0 ? 12 : 6 }}
              className="mt-8 md:mt-10 lg:mt-0"
            >
              <p className="mb-4 text-sm text-grayscale-500">
                {section.eyebrow}
              </p>
              <h2 className="text-xl md:text-3xl">{section.title}</h2>
              <p className="mt-6 text-sm leading-relaxed text-grayscale-600 md:text-md">
                {section.body}
              </p>
            </LayoutColumn>
          </Layout>
        ))}
      </div>
    </>
  )
}
