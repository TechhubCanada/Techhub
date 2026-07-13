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
import { createPageMetadata, getLocalizedPath } from "@lib/seo"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ countryCode: string }>
}): Promise<Metadata> {
  const { countryCode } = await params

  return createPageMetadata({
    title: "Buying Guides & Tech Inspiration",
    description:
      "Explore practical buying guides, computer setups, networking ideas, and technology recommendations from TechHub.",
    path: getLocalizedPath(countryCode, "inspiration"),
    keywords: [
      "computer buying guides",
      "technology recommendations",
      "networking guides",
      "business technology",
    ],
    image: "/images/content/techhub-modern-workstation.png",
  })
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
          src="/images/content/techhub-modern-workstation.png"
          width={2880}
          height={1500}
          alt="Modern desk setup with a laptop, monitor, keyboard, and accessories"
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
              Practical tech for cleaner desks, faster workflows, and setups
              that stay ready every day.
            </h3>
            <div className="md:text-md max-md:mb-16 max-w-135">
              <p>
                Choose hardware, accessories, repair support, and connectivity
                products for homes, offices, and gaming spaces that need a
                better setup.
              </p>
            </div>
          </LayoutColumn>
          <LayoutColumn start={{ base: 1, md: 9 }} end={13}>
            <LocalizedLink href="/store" className="mb-8 md:mb-16 inline-block">
              <Image
                src="/images/content/techhub-ethernet-switch.png"
                width={768}
                height={572}
                alt="Connectivity hardware and organized cables"
                className="mb-4 md:mb-6"
              />
              <div className="flex justify-between">
                <div>
                  <p className="mb-1">Office setup</p>
                  <p className="text-grayscale-500 text-xs">
                    Cables and accessories
                  </p>
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
              Gaming products, repairs, and accessories for a better setup.
            </h3>
            <div className="md:text-md max-md:mb-16 max-w-135">
              <p>
                Find gaming gear, replacement parts, repair support, and
                practical accessories to keep every device ready to use.
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
