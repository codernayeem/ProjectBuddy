'use client'

import { useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { LoadingPage } from '@/components/ui/LoadingSpinner'

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { isLoading } = useAuth()

  if (isLoading) {
    return <LoadingPage />
  }

  return <>{children}</>
}