import { Authenticator, ThemeProvider, useAuthenticator } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css'
import type { Theme } from '@aws-amplify/ui-react'
import { Car } from 'lucide-react'
import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const amplifyTheme: Theme = {
  name: 'autoloan-theme',
  tokens: {
    colors: {
      brand: {
        primary: {
          10: { value: '#eff6ff' },
          20: { value: '#dbeafe' },
          40: { value: '#93c5fd' },
          60: { value: '#3b82f6' },
          80: { value: '#2563eb' },
          90: { value: '#1d4ed8' },
          100: { value: '#1e40af' },
        },
      },
    },
    components: {
      authenticator: {
        router: {
          borderWidth: { value: '0' },
          boxShadow: { value: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)' },
          borderRadius: { value: '1rem' },
        },
      },
    },
  },
}

// Rendered as a child of <Authenticator> — only mounts when authStatus === 'authenticated'
function AuthRedirect() {
  const { authStatus } = useAuthenticator()
  const navigate = useNavigate()
  const location = useLocation()
  const from =
    (location.state as { from?: { pathname: string } } | null)?.from?.pathname ??
    '/apply/step-1'

  useEffect(() => {
    if (authStatus === 'authenticated') {
      navigate(from, { replace: true })
    }
  }, [authStatus, navigate, from])

  return null
}

export function LoginPage() {
  return (
    <ThemeProvider theme={amplifyTheme}>
      <div className="min-h-screen bg-gradient-to-br from-primary-950 via-primary-800 to-primary-600 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Brand header above the Authenticator card */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-white rounded-2xl shadow-xl mb-4">
              <Car className="w-7 h-7 text-primary-600" />
            </div>
            <h1 className="text-2xl font-bold text-white">AutoLoan Platform</h1>
            <p className="text-primary-200 mt-2 text-sm">
              Sign in or create an account to start your application
            </p>
          </div>

          <Authenticator>
            <AuthRedirect />
          </Authenticator>
        </div>
      </div>
    </ThemeProvider>
  )
}
