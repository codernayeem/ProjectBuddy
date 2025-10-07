import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User, AuthTokens } from '@/types/types'
import Cookies from 'js-cookie'

interface AuthState {
  user: User | null
  tokens: AuthTokens | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (user: User, tokens: AuthTokens) => void
  logout: () => void
  updateUser: (user: Partial<User>) => void
  setLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      tokens: null,
      isAuthenticated: false,
      isLoading: true,

      login: (user, tokens) => {
        // Set cookies
        Cookies.set('accessToken', tokens.accessToken, { expires: 7 })
        Cookies.set('refreshToken', tokens.refreshToken, { expires: 30 })
        
        set({
          user,
          tokens,
          isAuthenticated: true,
          isLoading: false,
        })
      },

      logout: () => {
        // Remove cookies
        Cookies.remove('accessToken')
        Cookies.remove('refreshToken')
        
        set({
          user: null,
          tokens: null,
          isAuthenticated: false,
          isLoading: false,
        })
      },

      updateUser: (updatedUser) => {
        const currentUser = get().user
        if (currentUser) {
          set({
            user: { ...currentUser, ...updatedUser },
          })
        }
      },

      setLoading: (loading) => {
        set({ isLoading: loading })
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
)