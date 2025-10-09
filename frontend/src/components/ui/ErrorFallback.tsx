import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

interface ErrorFallbackProps {
  error: Error
  resetErrorBoundary: () => void
  title?: string
  description?: string
  showErrorDetails?: boolean
  showHomeButton?: boolean
  className?: string
}

export default function ErrorFallback({ 
  error, 
  resetErrorBoundary,
  title = "Oops! Something went wrong",
  description = "We encountered an unexpected error. Please try again or contact support if the problem persists.",
  showErrorDetails = process.env.NODE_ENV === 'development',
  showHomeButton = false,
  className = "min-h-screen bg-gray-50 flex items-center justify-center p-4"
}: ErrorFallbackProps) {
  const handleGoHome = () => {
    window.location.href = '/'
  }

  return (
    <div className={className}>
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg text-center">
        <div className="mb-4">
          <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-3">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">{title}</h2>
          <p className="text-sm text-gray-600 mb-4">
            {description}
          </p>
        </div>
        
        {showErrorDetails && (
          <details className="mb-4 text-left">
            <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
              Error Details
            </summary>
            <pre className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded overflow-auto max-h-32">
              {error.message}
              {error.stack && `\n\n${error.stack}`}
            </pre>
          </details>
        )}
        
        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          <button
            onClick={resetErrorBoundary}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors inline-flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Try again
          </button>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
          >
            Reload page
          </button>
          {showHomeButton && (
            <button
              onClick={handleGoHome}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors inline-flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" />
              Go Home
            </button>
          )}
        </div>
      </div>
    </div>
  )
}