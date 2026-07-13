import { Metadata } from "next"
import Image from "next/image"
import { HttpTypes } from "@medusajs/types"
import { getProductTypesList } from "@lib/data/product-types"
import { getProductsList } from "@lib/data/products"
import {
  listMarketplaceAccounts,
  type MarketplaceAccount,
} from "@lib/data/marketplace-accounts"
import { listContentItems, type ContentItem } from "@lib/data/content"
import {
  getContentMetadataString,
  getSortedContentItems,
} from "@lib/util/content"
import { Layout, LayoutColumn } from "@/components/Layout"
import { LocalizedLink } from "@/components/LocalizedLink"
import { CollectionsSection } from "@/components/CollectionsSection"
import { CmsContentCard } from "@/components/CmsContentCard"
import { BrandLogo } from "@/components/BrandLogo"
import { AnimatedBrandCloud } from "@/components/AnimatedBrandCloud"
import ProductPreview from "@modules/products/components/product-preview"
import { createPageMetadata, getLocalizedPath } from "@lib/seo"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ countryCode: string }>
}): Promise<Metadata> {
  const { countryCode } = await params

  return createPageMetadata({
    title: "Computers, Repairs & Business IT",
    description:
      "Shop computers, printers, networking gear, parts, accessories, repairs, and business IT support from TechHub.",
    path: getLocalizedPath(countryCode),
    keywords: [
      "computer store",
      "laptop store",
      "printer store",
      "computer repairs",
      "business IT support",
    ],
    image: "/images/content/techhub-homepage-hero-banner.png",
  })
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
          <LocalizedLink
            href={`/store?type=${productType.value}`}
            className="group block transition-transform duration-300 hover:scale-105 focus-visible:scale-105"
          >
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
            <p className="origin-left text-xs transition-transform duration-300 group-hover:scale-105 group-focus-visible:scale-105 md:text-md">
              {productType.value}
            </p>
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

const heroCategories = [
  "Computers",
  "Networking",
  "Gaming",
  "Repairs",
  "B2B IT",
] as const

const featuredProductHandles = [
  "lenovo-thinkcentre-small-form-desktop",
  "logitech-business-keyboard-mouse-combo",
  "apple-ipad-field-service-tablet",
  "hp-elitebook-840-business-laptop",
  "ubiquiti-wifi-6-access-point",
  "brother-tn-series-toner-cartridge",
  "techhub-laptop-ssd-upgrade-kit",
  "hp-laserjet-pro-office-printer",
] as const

const carriedBrands = ["Dell", "Samsung", "Acer", "ASUS", "Microsoft"] as const

const supportPaths = [
  {
    title: "Business technology projects",
    body: "Bulk product requests, office setups, special sourcing, and business hardware planning.",
    href: "/inquiry",
    label: "Start an inquiry",
  },
  {
    title: "Need a repair or upgrade?",
    body: "Laptop, desktop, printer, and network support for devices that need service or a better setup.",
    href: "/inquiry",
    label: "Ask about service",
  },
] as const

const FeaturedProductsSection = ({
  products,
}: {
  products: HttpTypes.StoreProduct[]
}) => {
  if (products.length === 0) {
    return null
  }

  return (
    <Layout className="mb-26 gap-y-10 md:mb-36 md:gap-y-16">
      <LayoutColumn start={1} end={{ base: 13, md: 7 }}>
        <h3 className="text-md md:text-2xl">Featured products</h3>
      </LayoutColumn>
      <LayoutColumn start={{ base: 1, md: 8 }} end={13}>
        <p className="mt-3 max-w-130 text-sm leading-relaxed text-grayscale-600 md:mt-0 md:text-md">
          A quick look at products available through the TechHub store.
        </p>
      </LayoutColumn>
      {products.map((product) => (
        <LayoutColumn key={product.id} className="!col-span-6 md:!col-span-3">
          <ProductPreview product={product} isInteractive />
        </LayoutColumn>
      ))}
    </Layout>
  )
}

const HomeSupportSection = () => {
  return (
    <section className="mb-26 bg-black py-16 text-white md:mb-36 md:py-26">
      <Layout className="gap-y-12 md:gap-y-16">
        <LayoutColumn start={1} end={{ base: 13, lg: 8 }}>
          <p className="mb-4 text-xs uppercase text-white/55 md:text-sm">
            Products, sourcing, and support
          </p>
          <h3 className="max-w-180 text-xl md:text-3xl">
            From retail product requests to business technology projects,
            TechHub supports the full setup.
          </h3>
        </LayoutColumn>
        <LayoutColumn start={{ base: 1, lg: 9 }} end={13}>
          <div className="flex h-full flex-col justify-end md:text-md">
            <p className="mb-7 max-w-130 text-sm leading-relaxed text-white/70 md:text-md">
              Browse the store, ask about a specialized request, or connect with
              the team for products, repairs, and IT support.
            </p>
            <LocalizedLink
              href="/inquiry"
              className="w-fit border-b border-current pb-1 transition-colors hover:border-transparent"
            >
              Start an inquiry
            </LocalizedLink>
          </div>
        </LayoutColumn>
        <LayoutColumn>
          <div className="border-t border-white/15 pt-8 md:pt-10">
            <p className="mb-5 text-sm text-white/55 md:text-base">
              Brands we carry
            </p>
            <AnimatedBrandCloud brands={carriedBrands} />
          </div>
        </LayoutColumn>
        {supportPaths.map((path) => (
          <LayoutColumn
            key={path.title}
            start={{ base: 1, md: path.title.startsWith("Business") ? 1 : 7 }}
            end={{ base: 13, md: path.title.startsWith("Business") ? 7 : 13 }}
          >
            <div className="border-t border-white/15 pt-7">
              <h4 className="mb-4 text-md md:text-xl">{path.title}</h4>
              <p className="mb-6 max-w-140 text-sm leading-relaxed text-white/65 md:text-base">
                {path.body}
              </p>
              <LocalizedLink
                href={path.href}
                className="border-b border-current pb-1 text-sm transition-colors hover:border-transparent md:text-base"
              >
                {path.label}
              </LocalizedLink>
            </div>
          </LayoutColumn>
        ))}
      </Layout>
    </section>
  )
}

const MarketplaceSection = ({
  marketplaceAccounts,
}: {
  marketplaceAccounts: MarketplaceAccount[]
}) => {
  if (marketplaceAccounts.length === 0) {
    return null
  }

  const links = marketplaceAccounts.map((account) => ({
    id: account.id,
    name: account.name,
    platform: account.platform,
    description: account.description,
    href: account.url,
    cta_label: account.cta_label,
    sort_order: account.sort_order,
  }))

  return (
    <Layout className="mb-26 gap-y-8 md:mb-36 md:gap-y-12">
      <LayoutColumn start={1} end={{ base: 13, md: 7 }}>
        <p className="mb-4 text-xs uppercase text-grayscale-500 md:text-sm">
          Find us online
        </p>
        <h3 className="text-md md:text-2xl">
          Shop TechHub through our website and marketplace accounts.
        </h3>
      </LayoutColumn>
      <LayoutColumn start={{ base: 1, md: 8 }} end={13}>
        <p className="max-w-130 text-sm leading-relaxed text-grayscale-600 md:text-md">
          Some products are also available through partner marketplaces for
          customers who prefer shopping there.
        </p>
      </LayoutColumn>
      {links.map((marketplace) => (
        <LayoutColumn
          key={marketplace.id}
          start={{ base: 1, md: 1 }}
          end={{ base: 13, md: 7 }}
        >
          <div className="group block border-t border-grayscale-200 pt-6">
            <div className="flex items-start justify-between gap-6">
              <div>
                <h4 className="mb-3 text-md md:text-xl">{marketplace.name}</h4>
                <p className="max-w-130 text-sm leading-relaxed text-grayscale-600 md:text-base">
                  {marketplace.description}
                </p>
              </div>
              {marketplace.href ? (
                <a
                  href={marketplace.href}
                  target="_blank"
                  rel="noreferrer"
                  className="shrink-0 border-b border-current pb-1 text-sm transition-colors hover:border-transparent md:text-base"
                >
                  {marketplace.cta_label}
                </a>
              ) : (
                <span className="shrink-0 text-sm text-grayscale-500 md:text-base">
                  {marketplace.cta_label}
                </span>
              )}
            </div>
          </div>
        </LayoutColumn>
      ))}
    </Layout>
  )
}

export default async function Home() {
  const [
    bannerResponse,
    sectionResponse,
    productsResponse,
    marketplaceAccountsResponse,
  ] = await Promise.all([
    listContentItems("homepage-banners", { limit: 1 }).catch(() => null),
    listContentItems("homepage-sections", { limit: 4 }).catch(() => null),
    getProductsList({
      countryCode: "ca",
      queryParams: {
        handle: [...featuredProductHandles],
        limit: featuredProductHandles.length,
        fields: "*variants.calculated_price,+collection",
      },
    }).catch(() => null),
    listMarketplaceAccounts().catch(() => null),
  ])

  const banner = getSortedContentItems(bannerResponse?.content_items ?? [])[0]
  const sections = getSortedContentItems(sectionResponse?.content_items ?? [])
  const marketplaceAccounts =
    marketplaceAccountsResponse?.marketplace_accounts ?? []
  const featuredProducts = productsResponse?.response.products ?? []
  const featuredProductsByHandle = new Map(
    featuredProducts.map((product) => [product.handle, product])
  )
  const sortedFeaturedProducts = featuredProductHandles
    .map((handle) => featuredProductsByHandle.get(handle))
    .filter((product): product is HttpTypes.StoreProduct => Boolean(product))
  const heroImage =
    getContentMetadataString(banner?.metadata, "image_url") ??
    "/images/content/techhub-homepage-hero-banner.png"
  const heroAlt =
    getContentMetadataString(banner?.metadata, "image_alt") ??
    "TechHub desktop, laptop, monitor, keyboard, and mouse product lineup"
  const heroCtaHref = getContentMetadataString(banner?.metadata, "cta_href")
  const heroCtaLabel =
    getContentMetadataString(banner?.metadata, "cta_label") ??
    "Explore products"

  return (
    <>
      <section className="relative isolate min-h-[82svh] overflow-hidden max-md:pt-18 md:min-h-screen">
        <Image
          src={heroImage}
          width={2880}
          height={1500}
          alt={heroAlt}
          priority
          className="absolute inset-0 -z-20 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 -z-10 bg-black/50 md:bg-black/45" />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-gradient-to-t from-black/70 to-transparent" />
        <Layout className="min-h-[calc(82svh-4.5rem)] content-end pb-7 text-white md:min-h-screen md:pb-14">
          <LayoutColumn start={1} end={{ base: 13, lg: 8 }}>
            <BrandLogo
              className="mb-5 md:mb-8"
              markClassName="size-8 border-white/80 md:size-10"
              textClassName="text-lg md:text-2xl"
            />
            <p className="mb-3 text-xs uppercase tracking-[0.14em] text-white/75 md:mb-4 md:text-sm">
              Products, repairs, and business IT
            </p>
            <h1 className="max-w-190 text-xl md:text-4xl">
              {banner?.title ?? "TechHub for products, repairs, and IT setups."}
            </h1>
          </LayoutColumn>
          <LayoutColumn start={{ base: 1, lg: 9 }} end={13}>
            <div className="mt-5 flex h-full items-end md:mt-8 lg:mt-0">
              <div className="md:text-md">
                <p className="mb-4 max-w-110 text-sm text-white/85 md:mb-6 md:text-base">
                  {banner?.body ??
                    "Shop computers, networking, gaming gear, parts, and support for home, work, and client projects."}
                </p>
                <div className="mb-5 flex flex-wrap gap-2 md:mb-7">
                  {heroCategories.map((category) => (
                    <span
                      key={category}
                      className="rounded-xs border border-white/30 bg-white/10 px-2.5 py-1 text-[0.6875rem] text-white backdrop-blur md:px-3 md:py-1.5 md:text-xs"
                    >
                      {category}
                    </span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-x-5 gap-y-2">
                  <LocalizedLink
                    href={heroCtaHref ?? "/store"}
                    className="border-b border-current pb-1 transition-colors hover:border-transparent"
                  >
                    {heroCtaLabel}
                  </LocalizedLink>
                  <LocalizedLink
                    href="/inquiry"
                    className="hidden border-b border-current pb-1 transition-colors hover:border-transparent sm:inline"
                  >
                    B2B inquiries
                  </LocalizedLink>
                </div>
              </div>
            </div>
          </LayoutColumn>
        </Layout>
      </section>
      <div className="pt-8 pb-26 md:pt-26 md:pb-36">
        <HomepageCmsSections items={sections} />
        <FeaturedProductsSection products={sortedFeaturedProducts} />
        <HomeSupportSection />
        <MarketplaceSection marketplaceAccounts={marketplaceAccounts} />
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
              TechHub helps customers buy, repair, and set up everyday
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
