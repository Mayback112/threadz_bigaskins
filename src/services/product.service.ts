import { api } from './api'

// Product Types
export interface ProductVariant {
  id: string
  productId: string
  sku: string
  variantName: string
  price: number
  costPrice: number
  compareAtPrice: number
  quantityAvailable: number
  lowStockThreshold: number
  weight: number
  imageUrl: string
  isActive: boolean
  inStock: boolean
  displayOrder: number
  barcode: string
  optionValues: Record<string, string>
  dateCreated: string
  lastModified: string
}

export interface Product {
  id: string
  sku: string
  name: string
  brand: string
  description: string
  shortDescription: string
  category: string
  costPrice: number
  discountedPrice: number
  weight: number
  length: number
  width: number
  height: number
  totalQuantity: number
  lowStockThreshold: number
  isListed: boolean
  inStock: boolean
  mainImageUrl: string
  imageUrls: string[]
  
  // Variants
  hasVariants: boolean
  variants: ProductVariant[]
  
  // SEO
  urlSlug: string
  metaTitle: string
  metaDescription: string
  metaKeywords: string
  
  // Badges
  isFeatured: boolean
  isNew: boolean
  isBestseller: boolean
  isOnSale: boolean
  
  // Inventory
  reorderPoint: number
  reorderQuantity: number
  supplierName: string
  supplierSku: string
  
  // Video
  videoUrl: string
  
  dateAdded: string
  lastModified: string
}

export interface VariantOption {
  optionName: string
  optionValues: string[]
}

// Product Service
export const productService = {
  // Get all listed products
  async getAllProducts(): Promise<Product[]> {
    return api.get<Product[]>('/api/products')
  },

  // Get new arrivals (last 10 days, max 30 items)
  async getNewArrivals(): Promise<Product[]> {
    return api.get<Product[]>('/api/products/new-arrivals')
  },

  // Get products grouped by root category
  async getProductsGroupedByCategory(): Promise<Record<string, Product[]>> {
    return api.get<Record<string, Product[]>>('/api/products/grouped-by-root')
  },

  // Get single product by ID
  async getProductById(id: string): Promise<Product> {
    return api.get<Product>(`/api/products/${id}`)
  },

  // Get variant options for a product
  async getVariantOptions(productId: string): Promise<VariantOption[]> {
    return api.get<VariantOption[]>(`/api/products/${productId}/options`)
  },

  // Helper: Get featured products
  async getFeaturedProducts(): Promise<Product[]> {
    const products = await this.getAllProducts()
    return products.filter(p => p.isFeatured)
  },

  // Helper: Get on-sale products
  async getOnSaleProducts(): Promise<Product[]> {
    const products = await this.getAllProducts()
    return products.filter(p => p.isOnSale)
  },

  // Helper: Get bestsellers
  async getBestsellers(): Promise<Product[]> {
    const products = await this.getAllProducts()
    return products.filter(p => p.isBestseller)
  },

  // Helper: Get products by category
  async getProductsByCategory(category: string): Promise<Product[]> {
    const products = await this.getAllProducts()
    return products.filter(p => p.category === category)
  },

  // Helper: Search products
  async searchProducts(query: string): Promise<Product[]> {
    const products = await this.getAllProducts()
    const lowercaseQuery = query.toLowerCase()
    return products.filter(p => 
      p.name.toLowerCase().includes(lowercaseQuery) ||
      p.description.toLowerCase().includes(lowercaseQuery) ||
      p.brand.toLowerCase().includes(lowercaseQuery) ||
      p.category.toLowerCase().includes(lowercaseQuery)
    )
  },
}

export default productService
