import { useEffect, useState } from 'react'

/**
 * Custom hook that detects and listens to system theme changes
 * @returns 'light' | 'dark' based on system preference
 * 
 * @example
 * ```tsx
 * const theme = useSystemTheme()
 * console.log(theme) // 'dark' or 'light'
 * ```
 */
export function useSystemTheme() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    // Check if window is available (SSR safety)
    if (typeof window === 'undefined') return 'light'
    
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'
  })

  useEffect(() => {
    // Create media query
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    // Handler for theme changes
    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
      const newTheme = e.matches ? 'dark' : 'light'
      setTheme(newTheme)
      
      // Update document class
      document.documentElement.classList.remove('light', 'dark')
      document.documentElement.classList.add(newTheme)
    }
    
    // Set initial theme
    handleChange(mediaQuery)
    
    // Listen for changes
    mediaQuery.addEventListener('change', handleChange)
    
    // Cleanup
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return theme
}
