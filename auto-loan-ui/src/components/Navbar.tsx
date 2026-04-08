import { Car, LogOut, User } from 'lucide-react'
import { useAuthenticator } from '@aws-amplify/ui-react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'

interface NavbarProps {
  className?: string
}

export function Navbar({ className }: NavbarProps) {
  const { user, signOut } = useAuthenticator()
  const email = user?.signInDetails?.loginId ?? ''

  return (
    <nav className={cn('border-b border-gray-100 bg-white/90 backdrop-blur-sm sticky top-0 z-50', className)}>
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2.5 hover:opacity-80 transition-opacity duration-150"
        >
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center shadow-sm">
            <Car className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-gray-900 text-lg tracking-tight">AutoLoan</span>
        </Link>

        <div className="flex items-center gap-4">
          {email && (
            <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500">
              <User className="w-4 h-4 shrink-0" />
              <span className="max-w-[200px] truncate">{email}</span>
            </div>
          )}
          <button
            onClick={signOut}
            className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-red-600 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors duration-150"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  )
}
