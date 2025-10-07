import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { Link } from 'react-router'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react'
import { authService } from '@/lib/auth'
import { useAuthStore } from '@/store/authStore'
import { RegisterCredentials } from '@/types/types'
import { debounce } from '@/lib/utils'

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [emailAvailable, setEmailAvailable] = useState<boolean | null>(null)
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null)
  const navigate = useNavigate()
  const { login } = useAuthStore()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterCredentials>()

  const watchEmail = watch('email')
  const watchUsername = watch('username')

  // Debounced email check
  const checkEmailAvailability = debounce(async (email: string) => {
    if (email && email.includes('@')) {
      try {
        const response = await authService.checkEmail(email)
        setEmailAvailable(response.data?.available ?? false)
      } catch (error) {
        setEmailAvailable(null)
      }
    }
  }, 500)

  // Debounced username check
  const checkUsernameAvailability = debounce(async (username: string) => {
    if (username && username.length >= 3) {
      try {
        const response = await authService.checkUsername(username)
        setUsernameAvailable(response.data?.available ?? false)
      } catch (error) {
        setUsernameAvailable(null)
      }
    }
  }, 500)

  // Watch for email changes
  useEffect(() => {
    if (watchEmail) {
      checkEmailAvailability(watchEmail)
    }
  }, [watchEmail])

  // Watch for username changes
  useEffect(() => {
    if (watchUsername) {
      checkUsernameAvailability(watchUsername)
    }
  }, [watchUsername])

  const onSubmit = async (data: RegisterCredentials) => {
    setIsLoading(true)
    try {
      const response = await authService.register(data)
      
      if (response.success && response.data) {
        login(response.data.user, response.data.tokens)
        toast.success('Account created successfully!')
        navigate('/dashboard')
      }
    } catch (error) {
      // Error handled by API interceptor
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Project Buddy</h1>
          <h2 className="text-xl text-gray-600">Create your account</h2>
          <p className="mt-2 text-sm text-gray-500">
            Join thousands of professionals building amazing projects
          </p>
        </div>

        <div className="bg-white py-8 px-6 shadow-xl rounded-lg">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  First name
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    {...register('firstName', {
                      required: 'First name is required',
                      minLength: {
                        value: 2,
                        message: 'First name must be at least 2 characters',
                      },
                    })}
                    type="text"
                    className="input pl-10"
                    placeholder="John"
                  />
                </div>
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Last name
                </label>
                <div className="mt-1">
                  <input
                    {...register('lastName', {
                      required: 'Last name is required',
                      minLength: {
                        value: 2,
                        message: 'Last name must be at least 2 characters',
                      },
                    })}
                    type="text"
                    className="input"
                    placeholder="Doe"
                  />
                </div>
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-400 text-sm">@</span>
                </div>
                <input
                  {...register('username', {
                    required: 'Username is required',
                    minLength: {
                      value: 3,
                      message: 'Username must be at least 3 characters',
                    },
                    pattern: {
                      value: /^[a-zA-Z0-9_]+$/,
                      message: 'Username can only contain letters, numbers, and underscores',
                    },
                  })}
                  type="text"
                  className="input pl-8"
                  placeholder="johndoe"
                />
                {usernameAvailable === false && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <span className="text-red-500 text-sm">✗</span>
                  </div>
                )}
                {usernameAvailable === true && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <span className="text-green-500 text-sm">✓</span>
                  </div>
                )}
              </div>
              {errors.username && (
                <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
              )}
              {usernameAvailable === false && (
                <p className="mt-1 text-sm text-red-600">Username is already taken</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Invalid email address',
                    },
                  })}
                  type="email"
                  className="input pl-10"
                  placeholder="john@example.com"
                />
                {emailAvailable === false && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <span className="text-red-500 text-sm">✗</span>
                  </div>
                )}
                {emailAvailable === true && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <span className="text-green-500 text-sm">✓</span>
                  </div>
                )}
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
              {emailAvailable === false && (
                <p className="mt-1 text-sm text-red-600">Email is already registered</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 8,
                      message: 'Password must be at least 8 characters',
                    },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                      message: 'Password must contain uppercase, lowercase, number and special character',
                    },
                  })}
                  type={showPassword ? 'text' : 'password'}
                  className="input pl-10 pr-10"
                  placeholder="Create a strong password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                Bio <span className="text-gray-400">(optional)</span>
              </label>
              <div className="mt-1">
                <textarea
                  {...register('bio')}
                  rows={3}
                  className="input"
                  placeholder="Tell us about yourself and your professional interests..."
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || emailAvailable === false || usernameAvailable === false}
              className="btn btn-primary btn-lg w-full"
            >
              {isLoading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Already have an account?</span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                to="/auth/login"
                className="btn btn-outline w-full"
              >
                Sign in instead
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}