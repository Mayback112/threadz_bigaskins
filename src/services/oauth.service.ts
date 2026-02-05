/**
 * OAuth Service for handling Google OAuth authentication
 */

/**
 * Get tenant ID (hardcoded for now, can be made dynamic later)
 * @returns {string} Tenant ID
 */
export function getTenantId(): string {
  // Hardcoded tenant ID - can be made dynamic based on subdomain or user selection
  return 'ten_001'
}

/**
 * Build OAuth authorization URL with tenant ID
 * @param {string} provider - OAuth provider (e.g., 'google', 'facebook')
 * @returns {string} Complete OAuth URL with tenant parameter
 */
export function buildOAuthUrl(provider: string): string {
  const tenantId = getTenantId()
  
  // Get backend URL (remove /api suffix if present)
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'
  const backendUrl = apiBaseUrl.replace(/\/api$/, '')
  
  // Build OAuth URL with tenant ID as query parameter
  const oauthUrl = `${backendUrl}/oauth2/authorization/${provider}?tenantId=${encodeURIComponent(tenantId)}`
  
  return oauthUrl
}

/**
 * Initiate OAuth login flow
 * @param {string} provider - OAuth provider (e.g., 'google', 'facebook')
 */
export function initiateOAuthLogin(provider: string): void {
  // Use hardcoded tenant ID
  const tenantId = getTenantId()
  
  // Build OAuth URL with tenant ID as query parameter
  const oauthUrl = buildOAuthUrl(provider)
  
  // Store tenant ID for later use (in case needed after callback)
  sessionStorage.setItem('pendingTenantId', tenantId)
  
  // Redirect to backend OAuth endpoint with tenant ID parameter
  window.location.href = oauthUrl
}

/**
 * Handle OAuth callback/redirect
 * This is called when user is redirected back from OAuth provider
 */
export function handleOAuthCallback(): void {
  // Clean up stored tenant ID
  sessionStorage.removeItem('pendingTenantId')
}

/**
 * OAuth Service object
 */
export const oauthService = {
  getTenantId,
  buildOAuthUrl,
  initiateOAuthLogin,
  handleOAuthCallback,
  
  /**
   * Initiate Google OAuth login
   */
  googleLogin: () => initiateOAuthLogin('google'),
  
  /**
   * Initiate Facebook OAuth login (if supported)
   */
  facebookLogin: () => initiateOAuthLogin('facebook'),
}
