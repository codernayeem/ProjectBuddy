import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import { AuthInitializer } from '@/components/AuthInitializer'
import { Toaster } from 'sonner'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            retry: 1,
            refetchOnWindowFocus: false,
          },
          mutations: {
            retry: 1,
          },
        },
      })
  )

  return (
      <QueryClientProvider client={queryClient}>
        <AuthInitializer>
          {children}
          <Toaster position="top-right" />
        </AuthInitializer>
      </QueryClientProvider>
  )
}