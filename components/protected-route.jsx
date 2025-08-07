'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { Loader2 } from 'lucide-react'

export function ProtectedRoute({ 
  children, 
  requiredRoles = [], 
  requireVerification = false 
}) {
  const { user, profile, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/')
        return
      }

      if (!profile) {
        router.push('/')
        return
      }

      if (requireVerification && profile.verification_status !== 'verified') {
        router.push('/verification-pending')
        return
      }

      if (requiredRoles.length > 0 && !requiredRoles.includes(profile.role)) {
        router.push('/unauthorized')
        return
      }
    }
  }, [user, profile, loading, router, requiredRoles, requireVerification])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-red-600" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user || !profile) {
    return null
  }

  if (requireVerification && profile.verification_status !== 'verified') {
    return null
  }

  if (requiredRoles.length > 0 && !requiredRoles.includes(profile.role)) {
    return null
  }

  return <>{children}</>
}
