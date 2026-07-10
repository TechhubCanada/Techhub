import { Metadata } from "next"
import Image from "next/image"
import { notFound } from "next/navigation"
import { getContentItem } from "@lib/data/content"
import { getContentMetadataString, getContentSummary } from "@lib/util/content"
import { Layout, LayoutColumn } from "@/components/Layout"
import { LocalizedLink } from "@/components/LocalizedLink"

type Props = {
  params: Promise<{ countryCode: string; slug: string }>
}

export async function generateStaticParams() {
  return []
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const guide = await getContentItem("buying-guides", slug).catch(() => null)

  if (!guide) {
    return {
      title: "Buying Guide",
    }
  }

  return {
    title: `${guide.title} | TechHub Canada`,
    description: getContentSummary(guide),
  }
}

const formatPublishedDate = (value?: string | null) => {
  if (!value) {
    return undefined
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return undefined
  }

  return new Intl.DateTimeFormat("en-CA", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date)
}

export default async function BuyingGuidePage({ params }: Props) {
  const { slug } = await params
  const guide = await getContentItem("buying-guides", slug).catch(() => null)

  if (!guide) {
    notFound()
  }

  const imageUrl = getContentMetadataString(guide.metadata, "image_url")
  const imageAlt =
    getContentMetadataString(guide.metadata, "image_alt") ?? guide.title
  const publishedDate = formatPublishedDate(guide.published_at)

  return (
    <div className="pt-26 md:pt-37 pb-26 md:pb-36">
      <Layout>
        <LayoutColumn start={1} end={{ base: 13, lg: 8 }}>
          <LocalizedLink href="/inspiration" variant="underline">
            Inspiration
          </LocalizedLink>
          <h1 className="text-md md:text-2xl mt-8 mb-6">{guide.title}</h1>
          {(publishedDate || guide.tags?.length) && (
            <div className="mb-8 flex flex-wrap gap-x-6 gap-y-2 text-xs text-grayscale-500">
              {publishedDate && <p>{publishedDate}</p>}
              {guide.tags?.map((tag) => (
                <p key={tag.id}>{tag.value}</p>
              ))}
            </div>
          )}
        </LayoutColumn>
        {imageUrl && (
          <LayoutColumn>
            <div className="relative mb-8 aspect-[3/2] md:mb-20">
              <Image
                src={imageUrl}
                alt={imageAlt}
                fill
                sizes="100vw"
                className="object-cover"
              />
            </div>
          </LayoutColumn>
        )}
        {guide.body && (
          <LayoutColumn start={1} end={{ base: 13, lg: 8 }}>
            <div className="whitespace-pre-line text-base md:text-md">
              {guide.body}
            </div>
          </LayoutColumn>
        )}
      </Layout>
    </div>
  )
}
