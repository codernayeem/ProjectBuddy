import { useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'

export function useAuth() {
  const { user, tokens, isAuthenticated, isLoading, login, logout, updateUser } = useAuthStore()

  return {
    user,
    tokens,
    isAuthenticated,
    isLoading,
    login,
    logout,
    updateUser,
  }
}

export function useRequireAuth() {
  const { isAuthenticated, isLoading } = useAuth()
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      window.location.href = '/auth/login'
    }
  }, [isAuthenticated, isLoading])

  return { isAuthenticated, isLoading }
}