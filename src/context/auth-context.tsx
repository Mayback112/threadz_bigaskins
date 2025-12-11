import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { StoredUser } from '@/lib/userUtils'
import { getUserFromStorage, saveUserToStorage, clearUserFromStorage, getUserFullName } from '@/lib/userUtils'

interface AuthContextType {
  user: StoredUser | null
  isAuthenticated: boolean
  login: (user: StoredUser) => void
  logout: () => void
  updateUser: (user: Partial<StoredUser>) => void
  getUserName: () => string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<StoredUser | null>(() => getUserFromStorage())

  const isAuthenticated = user !== null

  useEffect(() => {
    // Sync user state with localStorage
    if (user) {
      saveUserToStorage(user)
    }
  }, [user])

  const login = (userData: StoredUser) => {
    setUser(userData)
    saveUserToStorage(userData)
  }

  const logout = () => {
    setUser(null)
    clearUserFromStorage()
  }

  const updateUser = (updates: Partial<StoredUser>) => {
    if (user) {
      const updatedUser = { ...user, ...updates }
      setUser(updatedUser)
      saveUserToStorage(updatedUser)
    }
  }

  const getUserName = () => {
    return getUserFullName(user)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        logout,
        updateUser,
        getUserName,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
