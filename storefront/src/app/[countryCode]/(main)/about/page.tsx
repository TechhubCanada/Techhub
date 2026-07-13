import { Metadata } from "next"
import Image from "next/image"
import { getContentItem } from "@lib/data/content"
import { getContentMetadataString } from "@lib/util/content"
import { getStaticCountryCodes } from "@lib/util/static-country-codes"
import { Layout, LayoutColumn } from "@/components/Layout"
import { createPageMetadata, getLocalizedPath } from "@lib/seo"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ countryCode: string }>
}): Promise<Metadata> {
  const { countryCode } = await params

  return createPageMetadata({
    title: "About TechHub",
    description:
      "Learn about TechHub's computers, repairs, practical technology support, and business IT services in Markham, Ontario.",
    path: getLocalizedPath(countryCode, "about"),
    keywords: [
      "computer store Markham",
      "computer repair Markham",
      "IT support",
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

export default async function AboutPage() {
  const aboutContent = await getContentItem(
    "service-pages",
    "about-techhub"
  ).catch(() => null)
  const heroImage =
    getContentMetadataString(aboutContent?.metadata, "image_url") ??
    "/images/content/techhub-modern-workstation.png"
  const heroAlt =
    getContentMetadataString(aboutContent?.metadata, "image_alt") ??
    "Modern desktop and laptop workstation"

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
      <div className="pt-8 md:pt-26 pb-26 md:pb-36">
        <Layout>
          <LayoutColumn start={1} end={{ base: 13, lg: 7 }}>
            <h3 className="text-md max-lg:mb-6 md:text-2xl">
              {aboutContent?.title ??
                "TechHub is built around clear products, practical service, and business technology support."}
            </h3>
          </LayoutColumn>
          <LayoutColumn start={{ base: 1, lg: 8 }} end={13}>
            <div className="md:text-md lg:mt-18">
              {aboutContent?.body ? (
                <p className="whitespace-pre-line">{aboutContent.body}</p>
              ) : (
                <>
                  <p className="mb-5 lg:mb-9">
                    We help customers shop for computers, printers, tablets,
                    networking equipment, software, ink, toner, parts, and
                    accessories.
                  </p>
                  <p>
                    We also provide repair, setup, technical support, service,
                    and web development for people and businesses that need
                    practical help.
                  </p>
                </>
              )}
            </div>
          </LayoutColumn>
          <LayoutColumn>
            <Image
              src="/images/content/techhub-repair-workbench.png"
              width={2496}
              height={1404}
              alt="Computer repair bench with tools and electronics"
              className="mt-26 lg:mt-36 mb-8 lg:mb-26"
            />
          </LayoutColumn>
          <LayoutColumn start={1} end={{ base: 13, lg: 8 }}>
            <h3 className="text-md lg:mb-10 mb-6 md:text-2xl">
              We keep the shopping experience simple: useful products, clear
              information, and support when you need it.
            </h3>
          </LayoutColumn>
          <LayoutColumn start={1} end={{ base: 13, lg: 6 }}>
            <div className="mb-16 lg:mb-26">
              <p className="mb-5 md:mb-9">
                Our catalog focuses on everyday technology that customers use at
                home, at school, and at work. We carry devices, upgrades,
                replacement parts, cables, cartridges, and accessories.
              </p>
              <p>
                If something needs service, our team can help with diagnosis,
                repair, setup, and practical advice before and after purchase.
              </p>
            </div>
          </LayoutColumn>
          <LayoutColumn start={{ base: 2, lg: 1 }} end={{ base: 12, lg: 7 }}>
            <Image
              src="/images/content/techhub-motherboard-repair.png"
              width={1200}
              height={1600}
              alt="Technicians repairing a computer motherboard"
              className="mb-16 lg:mb-46"
            />
          </LayoutColumn>
          <LayoutColumn start={{ base: 1, lg: 8 }} end={13}>
            <div className="mb-6 lg:mb-20 xl:mb-36">
              <p>
                We work with customers who need a new computer, a stronger
                network, a printer that fits their workflow, or parts to keep a
                device running longer.
              </p>
            </div>
            <div className="md:text-md max-lg:mb-26">
              <p>
                The goal is simple: make technology easier to buy, easier to
                understand, and easier to maintain.
              </p>
            </div>
          </LayoutColumn>
        </Layout>
        <Image
          src="/images/content/techhub-laptop-repair-kit.png"
          width={2880}
          height={1618}
          alt="Laptop repair kit and service workbench"
          className="mb-8 lg:mb-26"
        />
        <Layout>
          <LayoutColumn start={1} end={{ base: 13, lg: 7 }}>
            <h3 className="text-md max-lg:mb-6 md:text-2xl">
              Customers come first.
            </h3>
          </LayoutColumn>
          <LayoutColumn start={{ base: 1, lg: 8 }} end={13}>
            <div className="md:text-md lg:mt-18">
              <p className="mb-5 lg:mb-9">
                Our team is here to help you choose the right product, fix a
                problem, or plan the next upgrade.
              </p>
              <p>
                Thank you for choosing TechHub for your devices, parts, repairs,
                and support.
              </p>
            </div>
          </LayoutColumn>
        </Layout>
      </div>
    </>
  )
}
