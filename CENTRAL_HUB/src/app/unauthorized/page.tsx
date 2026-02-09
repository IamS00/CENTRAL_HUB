"use client"

import { useRouter } from "next/navigation"
import { AlertCircle, Home } from "lucide-react"

export default function UnauthorizedPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background-light flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8 text-red-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Access Denied
        </h1>
        <p className="text-gray-600 mb-6">
          You don't have permission to access this page. Admin privileges are required.
        </p>
        <button
          onClick={() => router.push('/')}
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Home className="w-4 h-4" />
          Back to Home
        </button>
      </div>
    </div>
  )
}
