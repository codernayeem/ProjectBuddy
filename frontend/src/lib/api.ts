import axios, { AxiosResponse } from 'axios'
import { toast } from 'react-hot-toast'
import Cookies from 'js-cookie'

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = Cookies.get('refreshToken')
        if (refreshToken) {
          const response = await axios.post(`/api/auth/refresh`, {
            refreshToken,
          })
          
          const { accessToken } = response.data.data.tokens
          Cookies.set('accessToken', accessToken)
          
          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${accessToken}`
          return api(originalRequest)
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        Cookies.remove('accessToken')
        Cookies.remove('refreshToken')
        window.location.href = '/auth/login'
        return Promise.reject(refreshError)
      }
    }

    // Handle other errors
    const message = error.response?.data?.message || error.message || 'An error occurred'
    
    // Don't show toast for certain endpoints
    const silentEndpoints = ['/auth/check-email', '/auth/check-username']
    const shouldShowToast = !silentEndpoints.some(endpoint => 
      originalRequest?.url?.includes(endpoint)
    )
    
    if (shouldShowToast) {
      toast.error(message)
    }

    return Promise.reject(error)
  }
)

export default api