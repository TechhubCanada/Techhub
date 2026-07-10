import { Metadata } from "next"
import Image from "next/image"
import { listContentItems, type ContentItem } from "@lib/data/content"
import {
  getContentMetadataString,
  getSortedContentItems,
} from "@lib/util/content"
import { getStaticCountryCodes } from "@lib/util/static-country-codes"
import { Layout, LayoutColumn } from "@/components/Layout"
import { LocalizedLink } from "@/components/LocalizedLink"
import { CollectionsSection } from "@/components/CollectionsSection"
import { CmsContentCard } from "@/components/CmsContentCard"

export const metadata: Metadata = {
  title: "Featured Tech",
  description: "Explore practical tech picks from TechHub Canada",
}

export async function generateStaticParams() {
  const countryCodes = getStaticCountryCodes()

  const staticParams = countryCodes.map((countryCode) => ({
    countryCode,
  }))

  return staticParams
}

const InspirationCmsItems = ({
  buyingGuides,
  blogPosts,
}: {
  buyingGuides: ContentItem[]
  blogPosts: ContentItem[]
}) => {
  const items = [
    ...buyingGuides.map((item) => ({
      item,
      href: `/buying-guides/${item.slug}`,
      label: "Guide",
    })),
    ...blogPosts.map((item) => ({
      item,
      href: getContentMetadataString(item.metadata, "cta_href"),
      label: getContentMetadataString(item.metadata, "cta_label") ?? "Read",
    })),
  ].slice(0, 4)

  if (items.length === 0) {
    return null
  }

  return (
    <Layout className="mb-26 md:mb-36 max-md:gap-x-2">
      <LayoutColumn>
        <h3 className="text-md md:text-2xl mb-8 md:mb-15">Guides and ideas</h3>
      </LayoutColumn>
      {items.map(({ item, href, label }, index) => (
        <LayoutColumn
          key={item.id}
          start={index % 2 === 0 ? 1 : 7}
          end={index % 2 === 0 ? 7 : 13}
        >
          <CmsContentCard item={item} href={href} label={label} />
        </LayoutColumn>
      ))}
    </Layout>
  )
}

export default async function InspirationPage() {
  const [buyingGuidesResponse, blogPostsResponse] = await Promise.all([
    listContentItems("buying-guides", { limit: 4 }).catch(() => null),
    listContentItems("blog-posts", { limit: 4 }).catch(() => null),
  ])
  const buyingGuides = getSortedContentItems(
    buyingGuidesResponse?.content_items ?? []
  )
  const blogPosts = getSortedContentItems(
    blogPostsResponse?.content_items ?? []
  )

  return (
    <>
      <div className="max-md:pt-18">
        <Image
          src="/images/content/techhub-electronics-storefront.png"
          width={2880}
          height={1500}
          alt="Electronics store exterior with large signage"
          className="md:h-screen md:object-cover mb-8 md:mb-26"
        />
      </div>
      <div className="pb-26 md:pb-36">
        <InspirationCmsItems
          buyingGuides={buyingGuides}
          blogPosts={blogPosts}
        />
        <Layout>
          <LayoutColumn start={1} end={{ base: 13, md: 8 }}>
            <h3 className="text-md mb-6 md:mb-16 md:text-2xl">
              Work-ready laptops and desktops for home, school, and business.
            </h3>
            <div className="md:text-md max-md:mb-16 max-w-135">
              <p>
                Choose reliable computers, monitors, keyboards, and accessories
                that are easy to set up and ready for daily use.
              </p>
            </div>
          </LayoutColumn>
          <LayoutColumn start={{ base: 1, md: 9 }} end={13}>
            <LocalizedLink href="/store">
              <Image
                src="/images/content/techhub-laptop-product-table.png"
                width={768}
                height={572}
                alt="Laptop computer on a product display table"
                className="mb-4 md:mb-6"
              />
              <div className="flex justify-between">
                <div>
                  <p className="mb-1">Workstations</p>
                  <p className="text-grayscale-500 text-xs">
                    Computers and displays
                  </p>
                </div>
                <div>
                  <p className="font-semibold">Shop</p>
                </div>
              </div>
            </LocalizedLink>
          </LayoutColumn>
          <LayoutColumn>
            <Image
              src="/images/content/techhub-laptop-workspace-coffee.png"
              width={2496}
              height={1404}
              alt="Laptop on a table beside a coffee cup"
              className="mt-26 md:mt-36 mb-8 md:mb-26"
            />
          </LayoutColumn>
          <LayoutColumn start={1} end={{ base: 13, md: 8 }}>
            <h3 className="text-md mb-6 md:mb-16 md:text-2xl">
              Networking gear, routers, switches, and cables for stable
              connections.
            </h3>
            <div className="md:text-md max-md:mb-16 max-w-135">
              <p>
                Build a cleaner setup at home or at work with products that keep
                devices connected and organized.
              </p>
            </div>
          </LayoutColumn>
          <LayoutColumn start={{ base: 1, md: 9 }} end={13}>
            <LocalizedLink href="/store" className="mb-8 md:mb-16 inline-block">
              <Image
                src="/images/content/techhub-ethernet-switch.png"
                width={768}
                height={572}
                alt="Ethernet switch with network cables"
                className="mb-4 md:mb-6"
              />
              <div className="flex justify-between">
                <div>
                  <p className="mb-1">Switches</p>
                  <p className="text-grayscale-500 text-xs">Wired networking</p>
                </div>
                <div>
                  <p className="font-semibold">Shop</p>
                </div>
              </div>
            </LocalizedLink>
            <LocalizedLink href="/store">
              <Image
                src="/images/content/techhub-network-router.png"
                width={768}
                height={572}
                alt="Network router close-up"
                className="mb-4 md:mb-6"
              />
              <div className="flex justify-between">
                <div>
                  <p className="mb-1">Routers</p>
                  <p className="text-grayscale-500 text-xs">
                    Wi-Fi and routing
                  </p>
                </div>
                <div>
                  <p className="font-semibold">Shop</p>
                </div>
              </div>
            </LocalizedLink>
          </LayoutColumn>
        </Layout>
        <Image
          src="/images/content/techhub-dual-monitor-workstation.png"
          width={2880}
          height={1618}
          alt="Dual monitor desk workstation"
          className="md:h-screen md:object-cover mt-26 md:mt-36 mb-8 md:mb-26"
        />
        <Layout>
          <LayoutColumn start={1} end={{ base: 13, md: 8 }}>
            <h3 className="text-md mb-6 md:mb-16 md:text-2xl">
              Gaming, audio, repairs, and accessories for a better setup.
            </h3>
            <div className="md:text-md max-md:mb-16 max-w-135">
              <p>
                Find headsets, parts, tools, and service support to keep your
                devices working the way you need.
              </p>
            </div>
          </LayoutColumn>
          <LayoutColumn start={{ base: 1, md: 9 }} end={13}>
            <LocalizedLink href="/store">
              <Image
                src="/images/content/techhub-gaming-headset.png"
                width={768}
                height={572}
                alt="Gaming headset on a desk with ambient lighting"
                className="mb-4 md:mb-6"
              />
              <div className="flex justify-between">
                <div>
                  <p className="mb-1">Gaming audio</p>
                  <p className="text-grayscale-500 text-xs">
                    Headsets and accessories
                  </p>
                </div>
                <div>
                  <p className="font-semibold">Shop</p>
                </div>
              </div>
            </LocalizedLink>
          </LayoutColumn>
        </Layout>
        <CollectionsSection className="mt-26 md:mt-36" />
      </div>
    </>
  )
}
