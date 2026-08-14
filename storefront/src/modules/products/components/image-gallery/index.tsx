import { ProductPageGallery } from "@/components/ProductPageGallery"
import { HttpTypes } from "@medusajs/types"
import Image from "next/image"

type ImageGalleryProps = {
  images: HttpTypes.StoreProductImage[]
  className?: string
}

const ImageGallery = ({ images, className }: ImageGalleryProps) => {
  const filteredImages = images.filter((image) => Boolean(image.url))

  if (!filteredImages.length) {
    return null
  }

  return (
    <ProductPageGallery className={className}>
      {filteredImages.map((image, index) => (
        <div
          key={image.id}
          className="relative aspect-square w-full bg-white overflow-hidden"
        >
          <Image
            key={image.id}
            src={image.url}
            priority={index <= 2 ? true : false}
            alt={`Product image ${index + 1}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 589px, (max-width: 1279px) 384px, 456px"
            className="object-contain p-4"
          />
        </div>
      ))}
    </ProductPageGallery>
  )
}

export default ImageGallery
