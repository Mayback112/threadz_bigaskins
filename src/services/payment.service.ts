import { api } from './api'

// Payment Types
export interface PaymentVerificationResponse {
  success: boolean
  message: string
  reference: string
  amount: number
  currency: string
  status: string
  orderId: string
  paidAt: string
  transactionId: string
  orders?: Array<{
    id?: string
    productId: string
    quantity: number
    price?: number
    shippingStreetAddress?: string
    shippingRegion?: string
    shippingCountry?: string
    shippingPostalCode?: string
  }>
}

export interface PaymentInitializationRequest {
  orderId?: string          // Single order ID (for backward compatibility)
  orderIds?: string[]       // Multiple order IDs (preferred for multiple orders)
  amount: number | string   // Accept both number and string to preserve precision
  email: string
  currency?: string
  callbackUrl?: string
  metadata?: Record<string, any>
}

export interface PaymentInitializationResponse {
  success: boolean
  message: string
  authorizationUrl?: string
  accessCode?: string
  reference?: string
  orderId?: string
  // Legacy nested structure (kept for backward compatibility)
  data?: {
    authorizationUrl: string
    accessCode: string
    reference: string
  }
}

// Payment Service
export const paymentService = {
  // Initialize payment
  async initializePayment(data: PaymentInitializationRequest): Promise<PaymentInitializationResponse> {
    // Ensure amount is sent as string to preserve precision
    const requestData = {
      ...data,
      amount: typeof data.amount === 'number' ? data.amount.toFixed(4) : data.amount
    }
    return api.post<PaymentInitializationResponse>('/api/payments/initialize', requestData)
  },

  // Verify payment
  async verifyPayment(reference: string): Promise<PaymentVerificationResponse> {
    return api.get<PaymentVerificationResponse>(`/api/payments/verify/${reference}`)
  },

  // Get payment status
  async getPaymentStatus(reference: string): Promise<PaymentVerificationResponse> {
    return api.get<PaymentVerificationResponse>(`/api/payments/status/${reference}`)
  },
}

export default paymentService
