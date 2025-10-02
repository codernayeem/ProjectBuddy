import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '@/store/authStore'
import { authService } from '@/lib/auth'
import Cookies from 'js-cookie'

export function useAuth() {
  const { user, isAuthenticated, setLoading, login, logout } = useAuthStore()

  // Check for existing auth token and validate it
  const { data: profileData, isLoading, error } = useQuery({
    queryKey: ['auth-profile'],
    queryFn: () => authService.getProfile(),
    enabled: !!Cookies.get('accessToken') && !user,
    retry: false,
    staleTime: 0,
  })

  // Initialize auth state on mount
  useEffect(() => {
    const token = Cookies.get('accessToken')
    
    if (!token) {
      setLoading(false)
      return
    }

    if (profileData?.success) {
      // User is authenticated and we have their profile
      login(profileData.data, {
        accessToken: token,
        refreshToken: Cookies.get('refreshToken') || ''
      })
    } else if (error) {
      // Token is invalid, clear auth state
      logout()
    }
  }, [profileData, error, login, logout, setLoading])

  // Set loading state
  useEffect(() => {
    setLoading(isLoading)
  }, [isLoading, setLoading])

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
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