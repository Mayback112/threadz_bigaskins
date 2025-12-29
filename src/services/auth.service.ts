import { api } from './api'
import type { StoredUser } from '@/lib/userUtils'

// Request Types
export interface CustomerRegistrationRequest {
  firstName: string
  lastName: string
  email: string
  password: string
  phoneNumber?: string // Optional - can be added later for OAuth users
  referralSource?: string
  receiveProductUpdates?: boolean
  acceptedTerms: boolean // Required - must be true
}

export interface CustomerOtpVerificationRequest {
  email: string
  otp: string
}

export interface CustomerLoginRequest {
  email: string
  password: string
}

export interface CustomerForgotPasswordRequest {
  email: string
}

export interface CustomerPasswordResetWithOtpRequest {
  email: string
  otp: string
  newPassword: string
  confirmPassword: string
}

export interface CustomerPasswordResetRequest {
  email: string
  newPassword: string
  confirmPassword: string
}

// Response Types
export interface LoginResponse {
  accessToken: string
  refreshToken: string
  user: {
    firstName: string
    lastName: string
    email: string
    phone: string
    referralSource: string
    receiveProductUpdates: boolean
    emailVerified: boolean
    userId: string
    role: string
    tenantId?: string
  }
}

export interface CustomerProfileResponse {
  firstName: string
  lastName: string
  email: string
  phone: string
  referralSource: string
  receiveProductUpdates: boolean
  emailVerified: boolean
  userId: string
  role?: string
  tenantId?: string
}

// Auth Service
export const authService = {
  // Register new customer (sends OTP)
  async register(data: CustomerRegistrationRequest): Promise<void> {
    return api.post('/api/customer/auth/register', data)
  },

  // Verify OTP and complete registration
  async verifyOtp(data: CustomerOtpVerificationRequest): Promise<LoginResponse> {
    return api.post<LoginResponse>('/api/customer/auth/verify-otp', data)
  },

  // Login customer
  async login(data: CustomerLoginRequest): Promise<LoginResponse> {
    return api.post<LoginResponse>('/api/customer/auth/login', data)
  },

  // Logout customer
  async logout(): Promise<void> {
    return api.post('/api/customer/auth/logout')
  },

  // Forgot password - sends OTP to email
  async forgotPassword(data: CustomerForgotPasswordRequest): Promise<void> {
    return api.post('/api/customer/auth/forgot-password', data)
  },

  // Reset password with OTP
  async resetPasswordWithOtp(data: CustomerPasswordResetWithOtpRequest): Promise<void> {
    return api.post('/api/customer/auth/reset-password', data)
  },

  /**
   * @deprecated Use forgotPassword and resetPasswordWithOtp instead
   * Direct password reset without OTP verification
   */
  async resetPasswordDirect(data: CustomerPasswordResetRequest): Promise<void> {
    return api.post('/api/customer/auth/reset-password-direct', data)
  },

  // Get customer profile
  async getProfile(): Promise<CustomerProfileResponse> {
    return api.get<CustomerProfileResponse>('/api/customer/auth/profile')
  },

  // Update customer profile
  async updateProfile(data: Partial<CustomerProfileResponse>): Promise<CustomerProfileResponse> {
    return api.put<CustomerProfileResponse>('/api/customer/auth/profile', data)
  },

  // Refresh access token
  async refreshToken(): Promise<LoginResponse> {
    return api.post<LoginResponse>('/api/customer/auth/refresh')
  },

  // Convert API response to StoredUser format
  convertToStoredUser(profile: any): StoredUser {
    // Handle both nested and flat response structures
    const data = profile || {}
    
    return {
      firstName: data.firstName || '',
      lastName: data.lastName || '',
      email: data.email || '',
      phone: data.phone || data.phoneNumber || '',
      referralSource: data.referralSource || '',
      receiveProductUpdates: data.receiveProductUpdates || false,
      emailVerified: data.emailVerified || false,
      userId: data.userId || data.id || '',
      role: data.role || data.roles?.[0] || 'CUSTOMER',
      tenantId: data.tenantId || '',
      id: data.userId || data.id || '',
      roles: data.roles || (data.role ? [data.role] : []),
    }
  },
}
