"use client"

import { useParams, usePathname } from "next/navigation"
import { twMerge } from "tailwind-merge"
import { Layout, LayoutColumn } from "@/components/Layout"
import { NewsletterForm } from "@/components/NewsletterForm"
import { LocalizedLink } from "@/components/LocalizedLink"
import { BrandLogo } from "@/components/BrandLogo"
import { LinkPreview } from "@/components/ui/LinkPreview"
import { storeBusinessInfo } from "@lib/business-info"

const footerLinkClass =
  "inline-flex min-h-10 items-center text-grayscale-600 transition-colors hover:text-black md:min-h-0"

export const Footer: React.FC = () => {
  const pathName = usePathname()
  const { countryCode } = useParams()
  const currentPath = pathName.split(`/${countryCode}`)[1]

  const isAuthPage = currentPath === "/register" || currentPath === "/login"
  const addressLineOne = storeBusinessInfo.address.street
  const addressLineTwo = `${storeBusinessInfo.address.city}, ${storeBusinessInfo.address.province} ${storeBusinessInfo.address.postalCode}`

  return (
    <footer
      className={twMerge(
        "bg-grayscale-50 py-10 md:py-18",
        isAuthPage && "hidden"
      )}
    >
      <Layout>
        <LayoutColumn className="col-span-13">
          <div className="grid gap-10 max-md:px-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(20rem,0.9fr)] lg:gap-20">
            <div className="max-w-150">
              <BrandLogo
                className="mb-5 md:mb-6"
                markClassName="size-8"
                textClassName="text-lg md:text-xl"
              />
              <p className="max-w-120 text-sm leading-relaxed text-grayscale-600">
                Practical computers, networking gear, accessories, and local IT
                support from our Markham store.
              </p>

              <div className="mt-7 grid gap-5 sm:grid-cols-2">
                <address className="border-l border-grayscale-200 pl-4 text-sm leading-relaxed text-grayscale-600 not-italic">
                  <p className="mb-2 text-xs font-medium text-grayscale-800">
                    Visit us
                  </p>
                  <a
                    href={storeBusinessInfo.mapHref}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex flex-col transition-colors hover:text-black"
                  >
                    <span>{addressLineOne}</span>
                    <span>{addressLineTwo}</span>
                    <span>{storeBusinessInfo.address.country}</span>
                  </a>
                </address>

                <div className="border-l border-grayscale-200 pl-4 text-sm leading-relaxed text-grayscale-600">
                  <p className="mb-2 text-xs font-medium text-grayscale-800">
                    Contact us
                  </p>
                  <div className="flex flex-col gap-1.5">
                    <a
                      href={storeBusinessInfo.phone.href}
                      aria-label={`Call ${storeBusinessInfo.name}`}
                      className="font-medium text-grayscale-800 transition-colors hover:text-black"
                    >
                      {storeBusinessInfo.phone.label}
                    </a>
                    <a
                      href={storeBusinessInfo.email.href}
                      className="transition-colors hover:text-black"
                    >
                      {storeBusinessInfo.email.label}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <NewsletterForm className="border-t border-grayscale-200 pt-7 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0" />
          </div>

          <div className="mt-12 grid gap-x-10 gap-y-10 border-t border-grayscale-200 pt-10 max-md:px-4 sm:grid-cols-2 lg:grid-cols-[0.85fr_0.85fr_0.9fr_1.4fr]">
            <nav aria-label="Footer navigation">
              <h2 className="mb-4 text-xs font-medium text-grayscale-800">
                Shop
              </h2>
              <ul className="flex flex-col gap-1 text-sm">
                <li>
                  <LocalizedLink href="/store" className={footerLinkClass}>
                    Shop all
                  </LocalizedLink>
                </li>
                <li>
                  <LocalizedLink href="/about" className={footerLinkClass}>
                    About
                  </LocalizedLink>
                </li>
                <li>
                  <LocalizedLink
                    href="/inspiration"
                    className={footerLinkClass}
                  >
                    Featured tech
                  </LocalizedLink>
                </li>
                <li>
                  <LocalizedLink href="/account" className={footerLinkClass}>
                    Account
                  </LocalizedLink>
                </li>
              </ul>
            </nav>

            <nav aria-label="Product categories">
              <h2 className="mb-4 text-xs font-medium text-grayscale-800">
                Categories
              </h2>
              <ul className="flex flex-col gap-1 text-sm">
                <li>
                  <LocalizedLink href="/store" className={footerLinkClass}>
                    Computers
                  </LocalizedLink>
                </li>
                <li>
                  <LocalizedLink href="/store" className={footerLinkClass}>
                    Printers
                  </LocalizedLink>
                </li>
                <li>
                  <LocalizedLink href="/store" className={footerLinkClass}>
                    Networking
                  </LocalizedLink>
                </li>
                <li>
                  <LocalizedLink href="/store" className={footerLinkClass}>
                    Accessories
                  </LocalizedLink>
                </li>
              </ul>
            </nav>

            <nav aria-label="Policies">
              <h2 className="mb-4 text-xs font-medium text-grayscale-800">
                Support
              </h2>
              <ul className="flex flex-col gap-1 text-sm">
                <li>
                  <LocalizedLink
                    href="/privacy-policy"
                    className={footerLinkClass}
                  >
                    Privacy Policy
                  </LocalizedLink>
                </li>
                <li>
                  <LocalizedLink
                    href="/cookie-policy"
                    className={footerLinkClass}
                  >
                    Cookie Policy
                  </LocalizedLink>
                </li>
                <li>
                  <LocalizedLink
                    href="/terms-of-use"
                    className={footerLinkClass}
                  >
                    Terms of Use
                  </LocalizedLink>
                </li>
                <li>
                  <LocalizedLink
                    href="/refund-policy"
                    className={footerLinkClass}
                  >
                    Refund Policy
                  </LocalizedLink>
                </li>
                <li>
                  <LocalizedLink
                    href="/cookie-preferences"
                    className={footerLinkClass}
                  >
                    Cookie Preferences
                  </LocalizedLink>
                </li>
              </ul>
            </nav>

            <section aria-labelledby="footer-hours-heading">
              <h2
                id="footer-hours-heading"
                className="mb-4 text-xs font-medium text-grayscale-800"
              >
                Store hours
              </h2>
              <ul className="grid gap-2 text-sm text-grayscale-600 sm:max-w-90">
                {storeBusinessInfo.hours.map((item) => (
                  <li
                    key={item.day}
                    className="grid grid-cols-[5.75rem_1fr] gap-4"
                  >
                    <span>{item.day}</span>
                    <span className="text-grayscale-800">{item.time}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <div
            data-testid="footer-bottom"
            className="mt-10 flex items-center justify-between gap-4 border-t border-grayscale-200 pt-6 text-xs text-grayscale-500 max-sm:flex-col max-sm:items-start max-md:mx-4"
          >
            <p>&copy; 2026, TechHub 2009 - 2026 by Samsan Inc.</p>
            <div className="sm:text-right">
              Designed {"&"} developed by{" "}
              <LinkPreview
                url="https://agency.namankataria.com"
                className="font-medium text-grayscale-800 underline decoration-grayscale-400 underline-offset-4 transition-colors hover:text-black"
                width={260}
                height={160}
              >
                Agency by Naman Kataria
              </LinkPreview>
            </div>
          </div>
        </LayoutColumn>
      </Layout>
    </footer>
  )
}
