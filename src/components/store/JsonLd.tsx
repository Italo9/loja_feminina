import { store } from "@/lib/config"

interface ProductJsonLdProps {
  name: string
  description: string
  images: string[]
  price: number
  slug: string
}

export function ProductJsonLd({
  name,
  description,
  images,
  price,
  slug,
}: ProductJsonLdProps) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description: description.slice(0, 160),
    image: images.length > 0 ? images : undefined,
    offers: {
      "@type": "Offer",
      price,
      priceCurrency: "BRL",
      availability: "https://schema.org/InStock",
      url: `${store.url}/produto/${slug}`,
    },
    brand: {
      "@type": "Brand",
      name: store.name,
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

export function OrganizationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: store.name,
    url: store.url,
    logo: `${store.url}/logo.png`,
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
