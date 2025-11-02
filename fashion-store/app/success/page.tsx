'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { CheckCircle } from 'lucide-react'
import { useCart } from '@/components/CartProvider'

export default function SuccessPage() {
  const { clearCart } = useCart()

  useEffect(() => {
    clearCart()
  }, [clearCart])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6" />
        <h1 className="text-3xl font-bold mb-4">Order Successful!</h1>
        <p className="text-gray-600 mb-8">
          Thank you for your purchase. We've received your order and will send you a confirmation
          email shortly.
        </p>
        <Link
          href="/products"
          className="inline-block bg-black text-white px-8 py-3 hover:bg-gray-800 transition"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  )
}
