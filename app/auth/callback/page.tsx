'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to dashboard after authentication
    router.push('/dashboard')
  }, [router])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4">Redirecting...</h2>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ps-orange mx-auto"></div>
      </div>
    </div>
  )
}
