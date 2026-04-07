import { useAuthenticator } from '@aws-amplify/ui-react'
import { Navigate, useLocation } from 'react-router-dom'
import { useIdleTimeout } from '@/hooks/useIdleTimeout'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { authStatus } = useAuthenticator()
  const location = useLocation()

  // Start 30-minute idle timer on all protected pages
  useIdleTimeout()

  if (authStatus === 'configuring') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (authStatus !== 'authenticated') {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}
