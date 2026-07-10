import { Metadata } from "next"
import Image from "next/image"
import { getProductTypesList } from "@lib/data/product-types"
import { listContentItems, type ContentItem } from "@lib/data/content"
import {
  getContentMetadataString,
  getSortedContentItems,
} from "@lib/util/content"
import { Layout, LayoutColumn } from "@/components/Layout"
import { LocalizedLink } from "@/components/LocalizedLink"
import { CollectionsSection } from "@/components/CollectionsSection"
import { CmsContentCard } from "@/components/CmsContentCard"

export const metadata: Metadata = {
  title: "TechHub Canada",
  description:
    "Shop computers, printers, networking gear, parts, accessories, and repair services from TechHub Canada.",
}

const ProductTypesSection: React.FC = async () => {
  const productTypes = await getProductTypesList(0, 20, [
    "id",
    "value",
    "metadata",
  ]).catch(() => null)

  if (!productTypes) {
    return null
  }

  return (
    <Layout className="mb-26 md:mb-36 max-md:gap-x-2">
      <LayoutColumn>
        <h3 className="text-md md:text-2xl mb-8 md:mb-15">Our products</h3>
      </LayoutColumn>
      {productTypes.productTypes.map((productType, index) => (
        <LayoutColumn
          key={productType.id}
          start={index % 2 === 0 ? 1 : 7}
          end={index % 2 === 0 ? 7 : 13}
        >
          <LocalizedLink href={`/store?type=${productType.value}`}>
            {typeof productType.metadata?.image === "object" &&
              productType.metadata.image &&
              "url" in productType.metadata.image &&
              typeof productType.metadata.image.url === "string" && (
                <Image
                  src={productType.metadata.image.url}
                  width={1200}
                  height={900}
                  alt={productType.value}
                  className="mb-2 md:mb-8"
                />
              )}
            <p className="text-xs md:text-md">{productType.value}</p>
          </LocalizedLink>
        </LayoutColumn>
      ))}
    </Layout>
  )
}

const HomepageCmsSections = ({ items }: { items: ContentItem[] }) => {
  if (items.length === 0) {
    return null
  }

  return (
    <Layout className="mb-26 md:mb-36 max-md:gap-x-2">
      <LayoutColumn>
        <h3 className="text-md md:text-2xl mb-8 md:mb-15">
          Featured from TechHub
        </h3>
      </LayoutColumn>
      {items.map((item, index) => {
        const ctaHref = getContentMetadataString(item.metadata, "cta_href")
        const ctaLabel = getContentMetadataString(item.metadata, "cta_label")

        return (
          <LayoutColumn
            key={item.id}
            start={index % 2 === 0 ? 1 : 7}
            end={index % 2 === 0 ? 7 : 13}
          >
            <CmsContentCard
              item={item}
              href={ctaHref}
              label={ctaLabel ?? "Explore"}
            />
          </LayoutColumn>
        )
      })}
    </Layout>
  )
}

export default async function Home() {
  const [bannerResponse, sectionResponse] = await Promise.all([
    listContentItems("homepage-banners", { limit: 1 }).catch(() => null),
    listContentItems("homepage-sections", { limit: 4 }).catch(() => null),
  ])

  const banner = getSortedContentItems(bannerResponse?.content_items ?? [])[0]
  const sections = getSortedContentItems(sectionResponse?.content_items ?? [])
  const heroImage =
    getContentMetadataString(banner?.metadata, "image_url") ??
    "/images/content/techhub-real-store-interior-hero.png"
  const heroAlt =
    getContentMetadataString(banner?.metadata, "image_alt") ??
    "Inside Tech Hub with laptops, desktops, monitors, and accessories on display"
  const heroCtaHref = getContentMetadataString(banner?.metadata, "cta_href")
  const heroCtaLabel =
    getContentMetadataString(banner?.metadata, "cta_label") ?? "Shop now"

  return (
    <>
      <div className="max-md:pt-18">
        <Image
          src={heroImage}
          width={2880}
          height={1500}
          alt={heroAlt}
          className="md:h-screen md:object-cover"
        />
      </div>
      <div className="pt-8 pb-26 md:pt-26 md:pb-36">
        <Layout className="mb-26 md:mb-36">
          <LayoutColumn start={1} end={{ base: 13, md: 8 }}>
            <h3 className="text-md max-md:mb-6 md:text-2xl">
              {banner?.title ??
                "Computers, parts, accessories, and repair support in one place."}
            </h3>
          </LayoutColumn>
          <LayoutColumn start={{ base: 1, md: 9 }} end={13}>
            <div className="flex items-center h-full">
              <div className="md:text-md">
                <p>{banner?.body ?? "Find the tech you need."}</p>
                <LocalizedLink
                  href={heroCtaHref ?? "/store"}
                  variant="underline"
                >
                  {heroCtaLabel}
                </LocalizedLink>
              </div>
            </div>
          </LayoutColumn>
        </Layout>
        <HomepageCmsSections items={sections} />
        <ProductTypesSection />
        <CollectionsSection className="mb-22 md:mb-36" />
        <Layout>
          <LayoutColumn className="col-span-full">
            <h3 className="text-md md:text-2xl mb-8 md:mb-16">About TechHub</h3>
            <Image
              src="/images/content/techhub-laptop-display.png"
              width={2496}
              height={1400}
              alt="Laptop computers displayed on a retail table"
              className="mb-8 md:mb-16 max-md:aspect-[3/2] max-md:object-cover"
            />
          </LayoutColumn>
          <LayoutColumn start={1} end={{ base: 13, md: 7 }}>
            <h2 className="text-md md:text-2xl">
              TechHub Canada helps customers buy, repair, and set up everyday
              technology.
            </h2>
          </LayoutColumn>
          <LayoutColumn
            start={{ base: 1, md: 8 }}
            end={13}
            className="mt-6 md:mt-19"
          >
            <div className="md:text-md">
              <p className="mb-5 md:mb-9">
                Shop laptops, desktops, monitors, printers, networking products,
                ink, toner, parts, and accessories.
              </p>
              <p className="mb-5 md:mb-3">
                Need help choosing or fixing a device? Our team supports
                repairs, setup, service, and web development.
              </p>
              <LocalizedLink href="/about" variant="underline">
                Learn about TechHub
              </LocalizedLink>
            </div>
          </LayoutColumn>
        </Layout>
      </div>
    </>
  )
}
