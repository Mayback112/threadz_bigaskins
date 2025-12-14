// API Base Configuration
// If VITE_API_BASE_URL is empty string, use empty (for Vite proxy), otherwise use the value or fallback
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL !== undefined 
  ? import.meta.env.VITE_API_BASE_URL 
  : 'https://modix-market-2f56bf35c2c9.herokuapp.com'

// Debug log
console.log('🔧 API Configuration:', {
  'VITE_API_BASE_URL (env)': import.meta.env.VITE_API_BASE_URL,
  'VITE_API_BASE_URL typeof': typeof import.meta.env.VITE_API_BASE_URL,
  'VITE_API_BASE_URL === undefined': import.meta.env.VITE_API_BASE_URL === undefined,
  'API_BASE_URL (computed)': API_BASE_URL,
  'Using proxy?': API_BASE_URL === '' || API_BASE_URL === '/'
})

// API Response Types
export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}

// Generic API Request Handler
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`
  
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  }

  // Add Authorization header if access token exists
  const accessToken = localStorage.getItem('accessToken')
  if (accessToken) {
    (defaultHeaders as Record<string, string>)['Authorization'] = `Bearer ${accessToken}`
  }

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    credentials: 'include', // Important: Include cookies in requests
  }

  try {
    const response = await fetch(url, config)

    // Handle non-JSON responses
    const contentType = response.headers.get('content-type')
    if (!contentType || !contentType.includes('application/json')) {
      if (response.ok) {
        return {} as T // Return empty object for successful void responses
      }
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()

    if (!response.ok) {
      // Log full error response for debugging
      console.error('API Error Response:', {
        status: response.status,
        statusText: response.statusText,
        data: data,
        url: url
      })
      
      // Extract detailed error message with status code
      const errorMessage = data.message || data.error || data.details || response.statusText || 'Unknown error'
      const statusPrefix = `HTTP ${response.status}`
      
      // Create error with status code for better error handling
      const error = new Error(`${statusPrefix}: ${errorMessage}`)
      // Attach status code for programmatic checking
      ;(error as any).status = response.status
      ;(error as any).statusText = response.statusText
      ;(error as any).data = data
      throw error
    }

    return data
  } catch (error: any) {
    console.error('API Request Error:', error)
    console.error('Error details:', {
      message: error.message,
      url: url,
      method: config.method
    })
    throw error
  }
}

export const api = {
  get: <T>(endpoint: string, options?: RequestInit) =>
    apiRequest<T>(endpoint, { ...options, method: 'GET' }),

  post: <T>(endpoint: string, body?: any, options?: RequestInit) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    }),

  put: <T>(endpoint: string, body?: any, options?: RequestInit) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    }),

  delete: <T>(endpoint: string, options?: RequestInit) =>
    apiRequest<T>(endpoint, { ...options, method: 'DELETE' }),
}
