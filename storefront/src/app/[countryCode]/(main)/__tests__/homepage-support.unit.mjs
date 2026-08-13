import assert from "node:assert/strict"
import { existsSync, readFileSync } from "node:fs"
import { resolve } from "node:path"

const repoRoot = resolve(import.meta.dirname, "../../../../../..")
const homepageSource = readFileSync(
  resolve(repoRoot, "storefront/src/app/[countryCode]/(main)/page.tsx"),
  "utf8"
)
const animatedBrandSource = readFileSync(
  resolve(repoRoot, "storefront/src/components/AnimatedBrandCloud.tsx"),
  "utf8"
)
const storeProductsSource = readFileSync(
  resolve(
    repoRoot,
    "storefront/src/modules/store/templates/paginated-products.tsx"
  ),
  "utf8"
)
const relatedProductsSource = readFileSync(
  resolve(
    repoRoot,
    "storefront/src/modules/products/components/related-products/index.tsx"
  ),
  "utf8"
)
const productPreviewSource = readFileSync(
  resolve(
    repoRoot,
    "storefront/src/modules/products/components/product-preview/index.tsx"
  ),
  "utf8"
)
const linkPreviewSource = readFileSync(
  resolve(repoRoot, "storefront/src/components/ui/LinkPreview.tsx"),
  "utf8"
)
const collectionsSectionSource = readFileSync(
  resolve(repoRoot, "storefront/src/components/CollectionsSection.tsx"),
  "utf8"
)
const footerSource = readFileSync(
  resolve(repoRoot, "storefront/src/components/Footer.tsx"),
  "utf8"
)

assert.equal(
  existsSync(
    resolve(repoRoot, "storefront/src/components/AnimatedBrandCloud.tsx")
  ),
  true
)
assert.equal(homepageSource.includes("AnimatedBrandCloud"), true)
assert.equal(homepageSource.includes("fallbackMarketplaceLinks"), false)
assert.equal(homepageSource.includes("marketplaceAccounts.length === 0"), true)
assert.equal(homepageSource.includes("Best Buy Marketplace"), false)
assert.equal(homepageSource.includes("Add Amazon link"), false)
assert.equal(homepageSource.includes("hover:scale-105"), true)
assert.equal(productPreviewSource.includes("LinkPreview"), false)
assert.equal(productPreviewSource.includes("previewImage"), false)
assert.equal(collectionsSectionSource.includes("LinkPreview"), true)
assert.equal(collectionsSectionSource.includes("imageSrc={imageUrl}"), true)
assert.equal(collectionsSectionSource.includes("width={260}"), true)
assert.equal(collectionsSectionSource.includes("height={340}"), true)
assert.equal(linkPreviewSource.includes("useCountryCode"), true)
assert.equal(linkPreviewSource.includes("const href ="), true)
assert.equal(linkPreviewSource.includes("previewContent"), true)
assert.equal(linkPreviewSource.includes("useReducedMotion"), true)
assert.equal(linkPreviewSource.includes("scale: 0.96"), true)
assert.equal(linkPreviewSource.includes("ease: [0.16, 1, 0.3, 1]"), true)
assert.equal(
  linkPreviewSource.includes("x: shouldReduceMotion ? 0 : translateX"),
  true
)
assert.equal(footerSource.includes("previewContent={"), false)
assert.equal(footerSource.includes("width={320}"), true)
assert.equal(footerSource.includes("height={200}"), true)
assert.equal(footerSource.includes("Agency by Naman Kataria"), true)
assert.equal(footerSource.includes("group relative inline-flex"), true)
assert.equal(footerSource.includes("focus-visible:ring-2"), true)
assert.equal(
  storeProductsSource.includes("<ProductPreview product={p} isInteractive />"),
  true
)
assert.equal(
  relatedProductsSource.includes("<Product product={product} isInteractive />"),
  true
)
assert.equal(homepageSource.includes("AllProductsSection"), true)
assert.equal(homepageSource.includes("allProductsResponse"), true)
assert.equal(homepageSource.includes("Shop all products"), true)
assert.equal(homepageSource.includes("limit: 100"), true)
assert.equal(homepageSource.includes("allProductsCount"), true)
assert.equal(homepageSource.includes("totalCount={allProductsCount}"), true)
assert.equal(
  homepageSource.indexOf("<HomeSupportSection />") <
    homepageSource.indexOf("<AllProductsSection"),
  true
)

const homeAboutImagePath =
  "/images/content/techhub-canadian-excellence-hero.png"
const homeStart = homepageSource.indexOf("export default async function Home")
const heroStart = homepageSource.indexOf("<section", homeStart)
const heroEnd = homepageSource.indexOf("</section>", heroStart)
const heroSource = homepageSource.slice(heroStart, heroEnd)
const normalizedHomepageSource = homepageSource.replace(/\s+/g, " ")

assert.equal(
  existsSync(resolve(repoRoot, `storefront/public${homeAboutImagePath}`)),
  true
)
assert.equal(homepageSource.includes(`"${homeAboutImagePath}"`), true)
assert.equal(
  normalizedHomepageSource.includes(
    "Since 2009, serving customers and businesses with reliable devices without paying new-retail prices."
  ),
  true
)
assert.equal(heroSource.includes("<BrandLogo"), false)

for (const brand of [
  "Dell",
  "HP",
  "Lenovo",
  "Panasonic",
  "Apple",
  "Samsung",
  "Microsoft",
  "ASUS",
  "Acer",
]) {
  assert.equal(homepageSource.includes(`"${brand}"`), true)
}

assert.equal(animatedBrandSource.includes('"use client"'), true)
assert.equal(animatedBrandSource.includes("AnimatePresence"), false)
assert.equal(animatedBrandSource.includes('filter: "blur(12px)"'), true)
assert.equal(animatedBrandSource.includes("We carry"), false)
assert.equal(
  animatedBrandSource.includes(
    'aria-label={`Carried brands: ${brands.join(", ")}.`}'
  ),
  true
)
assert.equal(animatedBrandSource.includes("Brands we carry:"), false)
assert.equal(animatedBrandSource.includes("brands.map"), true)
assert.equal(animatedBrandSource.includes("key={brand}"), true)
