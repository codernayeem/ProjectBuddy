import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '@/store/authStore'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { authService } from '@/lib/auth'
import Cookies from 'js-cookie'

interface AuthInitializerProps {
  children: React.ReactNode
}

export function AuthInitializer({ children }: AuthInitializerProps) {
  const { isLoading, user, login, logout, setLoading } = useAuthStore()

  // Check for existing auth token and validate it
  const { data: profileData, isLoading: isProfileLoading, error } = useQuery({
    queryKey: ['auth-profile'],
    queryFn: () => authService.getProfile(),
    enabled: !!Cookies.get('accessToken') && !user,
    retry: 1,
    staleTime: 0,
    refetchOnWindowFocus: false,
  })

  // Initialize auth state on mount
  useEffect(() => {
    const token = Cookies.get('accessToken')
    const refreshToken = Cookies.get('refreshToken')
    
    if (!token) {
      setLoading(false)
      return
    }

    if (profileData?.success && profileData.data) {
      // User is authenticated and we have their profile
      login(profileData.data, {
        accessToken: token,
        refreshToken: refreshToken || ''
      })
    } else if (error && !isProfileLoading) {
      // Token is invalid, clear auth state
      logout()
    }
  }, [profileData, error, isProfileLoading, login, logout, setLoading])

  // Update loading state based on profile query - but don't stay loading forever
  useEffect(() => {
    const token = Cookies.get('accessToken')
    
    if (!token) {
      // No token, not loading
      setLoading(false)
    } else if (user) {
      // Have user, not loading
      setLoading(false)
    } else if (error) {
      // Error occurred, stop loading
      setLoading(false)
    } else {
      // Only loading if we have a token but no user yet and no error
      setLoading(isProfileLoading)
    }
  }, [isProfileLoading, user, error, setLoading])

  // Force stop loading after 5 seconds to prevent infinite loading
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isLoading) {
        console.warn('Auth loading timeout, forcing stop')
        setLoading(false)
      }
    }, 5000)

    return () => clearTimeout(timeout)
  }, [isLoading, setLoading])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}