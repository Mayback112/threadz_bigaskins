import { api } from './api'

// Wishlist Types
export interface WishlistRequest {
  productId: string
}

export interface WishlistItem {
  id: string
  productId: string
  productName: string
  productPrice: number
  productMainImageUrl?: string  // Backend field name
  productImage?: string          // For backwards compatibility
  productSku?: string
  inStock?: boolean
  createdAt?: string
}

export interface WishlistResponse {
  id: string
  productId: string
  productName: string
  productPrice: number
  productMainImageUrl?: string  // Backend field name
  productImage?: string          // For backwards compatibility
  productSku?: string
  inStock?: boolean
  createdAt: string
  message?: string
}

export interface WishlistPageResponse {
  items: WishlistItem[]
  totalCount: number
  page: number
  pageSize: number
}

export const wishlistService = {
  // Add product to wishlist
  async addToWishlist(productId: string): Promise<WishlistResponse> {
    return api.post<WishlistResponse>('/api/wishlist', { productId })
  },

  // Remove product from wishlist
  async removeFromWishlist(productId: string): Promise<void> {
    return api.delete<void>(`/api/wishlist/${productId}`)
  },

  // Get my wishlist with pagination
  async getMyWishlist(page: number = 0, size: number = 50): Promise<WishlistPageResponse> {
    return api.get<WishlistPageResponse>(`/api/wishlist?page=${page}&size=${size}`)
  },

  // Check if product is in wishlist
  async checkWishlist(productId: string): Promise<boolean> {
    const response = await api.get<{ inWishlist: boolean }>(`/api/wishlist/check/${productId}`)
    return response.inWishlist
  },

  // Get wishlist count
  async getWishlistCount(): Promise<number> {
    const response = await api.get<{ count: number }>('/api/wishlist/count')
    return response.count
  },

  // Clear entire wishlist
  async clearWishlist(): Promise<void> {
    return api.delete<void>('/api/wishlist')
  },
}
