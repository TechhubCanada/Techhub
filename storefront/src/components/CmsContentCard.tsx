import Image from "next/image"
import type { ContentItem } from "@lib/data/content"
import { getContentMetadataString, getContentSummary } from "@lib/util/content"
import { LocalizedLink } from "@/components/LocalizedLink"

type CmsContentCardProps = {
  item: ContentItem
  href?: string
  label?: string
  className?: string
}

export const CmsContentCard = ({
  item,
  href,
  label = "Read",
  className,
}: CmsContentCardProps) => {
  const imageUrl = getContentMetadataString(item.metadata, "image_url")
  const imageAlt =
    getContentMetadataString(item.metadata, "image_alt") ?? item.title
  const summary = getContentSummary(item)

  const content = (
    <article className={className}>
      {imageUrl && (
        <div className="relative mb-4 aspect-[4/3] overflow-hidden md:mb-6">
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          />
        </div>
      )}
      <div className="flex justify-between gap-6">
        <div>
          <h3 className="mb-2 text-base md:text-md">{item.title}</h3>
          {summary && <p className="text-xs text-grayscale-500">{summary}</p>}
        </div>
        {href && <p className="font-semibold">{label}</p>}
      </div>
    </article>
  )

  if (!href) {
    return content
  }

  return (
    <LocalizedLink href={href} className="group block">
      {content}
    </LocalizedLink>
  )
}
