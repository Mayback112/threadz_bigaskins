import { api } from './api'

// Order Types
export interface ShippingAddress {
  shippingCountry: string
  shippingPostalCode?: string
  shippingStreetAddress: string
  shippingRegion?: string
  shippingGpsAddress?: string
  shippingHouseNumber?: string
}

// Single order request (backend creates one order per product)
export interface CreateOrderRequest {
  productId: string
  quantity?: number
  phoneNumber?: string
  shippingCountry: string
  shippingPostalCode?: string
  shippingStreetAddress: string
  shippingRegion?: string
  shippingGpsAddress?: string
  shippingHouseNumber?: string
}

export interface OrderItem {
  productId: string
  variantId?: string
  quantity: number
  price: number
}

export interface OrderResponse {
  id?: string // Backend returns 'id'
  orderId?: string // Some endpoints might return 'orderId'
  orderNumber?: string
  orderCode?: string // Alternative field for readable order number
  status?: string
  totalAmount?: number // Total order amount
  amount?: number // Alternative field name for amount
  expectedAmount?: number // Expected amount before payment
  amountPaid?: number // ACTUAL amount paid (use this for display!)
  currency?: string
  items?: OrderItem[]
  shippingAddress?: ShippingAddress
  shippingCost?: number // Shipping fee
  shippingFee?: number // Alternative field for shipping
  tax?: number // Tax amount
  taxAmount?: number // Alternative field for tax
  createdAt?: string
  dateCreated?: string // Backend uses this field
  updatedAt?: string
  lastModified?: string // Backend uses this field
  paymentStatus?: string
  paymentReference?: string
  paymentTimestamp?: string
  refundedAmount?: number
  customerEmail?: string
  customerFirstName?: string
  customerLastName?: string
  customerPhone?: string
  customerName?: string
  shippingCountry?: string
  shippingPostalCode?: string
  shippingStreetAddress?: string
  shippingRegion?: string
  shippingGpsAddress?: string
  shippingHouseNumber?: string
  productName?: string
  productSku?: string
  productMainImageUrl?: string
  quantityOrdered?: number
}

export interface OrderListResponse {
  orders: OrderResponse[]
  totalCount: number
  page: number
  pageSize: number
}

// Order Service
export const orderService = {
  // Create single order (one product)
  async createOrder(data: CreateOrderRequest): Promise<OrderResponse> {
    return api.post<OrderResponse>('/api/orders', data)
  },

  // Create multiple orders (for cart with multiple products)
  async createOrders(orders: CreateOrderRequest[]): Promise<OrderResponse[]> {
    const promises = orders.map(order => this.createOrder(order))
    return Promise.all(promises)
  },

  // Get all orders for current user
  async getMyOrders(page: number = 0, size: number = 10): Promise<OrderListResponse> {
    return api.get<OrderListResponse>(`/api/orders?page=${page}&size=${size}`)
  },

  // Get single order by ID
  async getOrderById(orderId: string): Promise<OrderResponse> {
    return api.get<OrderResponse>(`/api/orders/${orderId}`)
  },

  // Cancel order
  async cancelOrder(orderId: string): Promise<void> {
    return api.post<void>(`/api/orders/${orderId}/cancel`, {})
  },

  // Get order by payment reference
  async getOrderByReference(reference: string): Promise<OrderResponse> {
    return api.get<OrderResponse>(`/api/orders/reference/${reference}`)
  },
}

export default orderService
