import { ReactNode } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import ErrorFallback from './ErrorFallback'

interface ErrorBoundaryWrapperProps {
  children: ReactNode
  title?: string
  description?: string
  showErrorDetails?: boolean
  showHomeButton?: boolean
  className?: string
  fullHeight?: boolean
}

export default function ErrorBoundaryWrapper({
  children,
  title,
  description,
  showErrorDetails,
  showHomeButton,
  className,
  fullHeight = false,
}: ErrorBoundaryWrapperProps) {
  const defaultClassName = fullHeight 
    ? "min-h-screen bg-gray-50 flex items-center justify-center p-4"
    : "min-h-96 flex items-center justify-center p-4"

  return (
    <ErrorBoundary
      FallbackComponent={(props) => (
        <ErrorFallback
          {...props}
          title={title}
          description={description}
          showErrorDetails={showErrorDetails}
          showHomeButton={showHomeButton}
          className={className || defaultClassName}
        />
      )}
    >
      {children}
    </ErrorBoundary>
  )
}