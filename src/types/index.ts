export interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  compareAt: number | null
  cost: number | null
  sku: string | null
  active: boolean
  featured: boolean
  categoryId: string
  category?: Category
  images: ProductImage[]
  variants: ProductVariant[]
  tags: string
  badge: string | null
  createdAt: Date
  updatedAt: Date
}

export interface ProductImage {
  id: string
  url: string
  alt: string | null
  position: number
}

export interface ProductVariant {
  id: string
  color: string | null
  colorHex: string | null
  size: string | null
  price: number | null
  stock: number
  sku: string | null
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  image: string | null
  parentId: string | null
  children?: Category[]
  order: number
}

export interface CartItem {
  productId: string
  variantId: string | null
  name: string
  image: string | null
  price: number
  quantity: number
  variantInfo: string | null
  maxStock: number
}

export interface OrderWithItems {
  id: string
  status: string
  subtotal: number
  shippingCost: number
  discount: number
  total: number
  paymentMethod: string | null
  paymentStatus: string
  trackingCode: string | null
  notes: string | null
  shippingAddress: string
  items: {
    id: string
    productName: string
    variantInfo: string | null
    price: number
    quantity: number
    image: string | null
  }[]
  createdAt: Date
}

export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  human?: boolean
}

export interface Suggestion {
  label: string
  prompt: string
}
