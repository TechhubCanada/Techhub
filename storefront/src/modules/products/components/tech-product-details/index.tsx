import { TechProductDetails } from "@lib/util/product-details"

const hasContent = (details: TechProductDetails) =>
  Boolean(
    details.buying_summary ||
      details.specs.length ||
      details.best_for.length ||
      details.included.length ||
      details.compatibility ||
      details.support_note
  )

const DetailList = ({ title, items }: { title: string; items: string[] }) => {
  if (!items.length) {
    return null
  }

  return (
    <div>
      <h3 className="mb-3 text-base">{title}</h3>
      <ul className="grid gap-2 text-sm text-grayscale-700">
        {items.map((item) => (
          <li key={item} className="border-b border-grayscale-200 pb-2">
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

const TechProductDetailsSection = ({
  details,
}: {
  details: TechProductDetails
}) => {
  if (!hasContent(details)) {
    return null
  }

  return (
    <section className="border-t border-grayscale-200 py-12 md:py-16">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
        <div>
          <p className="mb-3 text-xs uppercase text-grayscale-500">
            Product details
          </p>
          <h2 className="mb-4 text-md md:text-xl">Tech specs</h2>
          {details.buying_summary && (
            <p className="text-sm leading-relaxed text-grayscale-700">
              {details.buying_summary}
            </p>
          )}
        </div>

        <div className="grid gap-10">
          {details.specs.length > 0 && (
            <div>
              <h3 className="mb-3 text-base">Key specs</h3>
              <dl className="grid gap-0 border-t border-grayscale-200">
                {details.specs.map((spec) => (
                  <div
                    key={`${spec.label}-${spec.value}`}
                    className="grid gap-1 border-b border-grayscale-200 py-3 sm:grid-cols-[12rem_minmax(0,1fr)]"
                  >
                    <dt className="text-sm text-grayscale-500">{spec.label}</dt>
                    <dd className="text-sm text-black">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          <div className="grid gap-8 md:grid-cols-2">
            <DetailList title="Best for" items={details.best_for} />
            <DetailList title="What is included" items={details.included} />
          </div>

          {(details.compatibility || details.support_note) && (
            <div className="grid gap-6 md:grid-cols-2">
              {details.compatibility && (
                <div>
                  <h3 className="mb-3 text-base">Compatibility</h3>
                  <p className="text-sm leading-relaxed text-grayscale-700">
                    {details.compatibility}
                  </p>
                </div>
              )}
              {details.support_note && (
                <div>
                  <h3 className="mb-3 text-base">Tech Hub support</h3>
                  <p className="text-sm leading-relaxed text-grayscale-700">
                    {details.support_note}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default TechProductDetailsSection
