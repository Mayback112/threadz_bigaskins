import { useEffect } from 'react'

/**
 * Hook that automatically syncs page theme with system preferences
 * Use this in your App component or layout to enable automatic theme switching
 * 
 * @example
 * ```tsx
 * function App() {
 *   useThemeSync() // That's it!
 *   return <YourApp />
 * }
 * ```
 */
export function useThemeSync() {
  useEffect(() => {
    // Get system preference
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    // Apply theme to document
    const applyTheme = (isDark: boolean) => {
      const root = document.documentElement
      root.classList.remove('light', 'dark')
      root.classList.add(isDark ? 'dark' : 'light')
      
      // Optional: Also set data attribute for other libraries
      root.setAttribute('data-theme', isDark ? 'dark' : 'light')
    }
    
    // Set initial theme
    applyTheme(mediaQuery.matches)
    
    // Listen for system theme changes
    const handleChange = (e: MediaQueryListEvent) => {
      applyTheme(e.matches)
      console.log(`Theme switched to: ${e.matches ? 'dark' : 'light'}`)
    }
    
    mediaQuery.addEventListener('change', handleChange)
    
    // Cleanup
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])
}
