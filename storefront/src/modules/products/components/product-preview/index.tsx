import { HttpTypes } from "@medusajs/types"
import { twMerge } from "tailwind-merge"
import { LocalizedLink } from "@/components/LocalizedLink"
import Thumbnail from "@modules/products/components/thumbnail"
import { getProductPrice } from "@lib/util/get-product-price"

export default function ProductPreview({
  product,
  isInteractive = false,
}: {
  product: HttpTypes.StoreProduct
  isInteractive?: boolean
}) {
  const { cheapestPrice } = getProductPrice({
    product,
  })

  const hasReducedPrice =
    cheapestPrice &&
    cheapestPrice.calculated_price_number <
      (cheapestPrice?.original_price_number || 0)

  return (
    <LocalizedLink
      href={`/products/${product.handle}`}
      className={twMerge(
        "group block",
        isInteractive &&
          "rounded-sm p-2 transition-all duration-300 hover:-translate-y-1 hover:bg-grayscale-50 hover:shadow-[0_18px_45px_rgba(15,23,42,0.08)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black"
      )}
    >
      <div className={twMerge(isInteractive && "overflow-hidden rounded-sm")}>
        <Thumbnail
          thumbnail={product.thumbnail}
          images={product.images}
          size="square"
          className={twMerge(
            "mb-4 md:mb-6",
            isInteractive &&
              "transition-transform duration-500 group-hover:scale-[1.035]"
          )}
        />
      </div>
      <div className="flex justify-between gap-4 max-md:flex-col">
        <div className="max-md:text-xs">
          <p
            className={twMerge(
              "mb-1",
              isInteractive &&
                "transition-colors group-hover:text-grayscale-600"
            )}
          >
            {product.title}
          </p>
          {product.collection && (
            <p className="text-grayscale-500 text-xs max-md:hidden">
              {product.collection.title}
            </p>
          )}
          {isInteractive && (
            <p className="mt-3 hidden text-xs text-grayscale-500 transition-colors group-hover:text-black md:block">
              View product
            </p>
          )}
        </div>
        {cheapestPrice ? (
          hasReducedPrice ? (
            <div>
              <p className="font-semibold max-md:text-xs text-red-primary">
                {cheapestPrice.calculated_price}
              </p>
              <p className="max-md:text-xs text-grayscale-500 line-through">
                {cheapestPrice.original_price}
              </p>
            </div>
          ) : (
            <div>
              <p className="font-semibold max-md:text-xs">
                {cheapestPrice.calculated_price}
              </p>
            </div>
          )
        ) : null}
      </div>
    </LocalizedLink>
  )
}
