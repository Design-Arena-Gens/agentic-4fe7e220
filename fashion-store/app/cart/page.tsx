'use client'

import { useCart } from '@/components/CartProvider'
import Image from 'next/image'
import Link from 'next/link'
import { Trash2, Plus, Minus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity } = useCart()
  const router = useRouter()

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal > 100 ? 0 : 10
  const total = subtotal + shipping

  const handleCheckout = async () => {
    if (cart.length === 0) {
      toast.error('Your cart is empty')
      return
    }

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: cart }),
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      toast.error('Checkout failed. Please try again.')
    }
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <Link
            href="/products"
            className="inline-block bg-black text-white px-6 py-3 hover:bg-gray-800 transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold mb-12">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {cart.map((item) => (
                <div key={`${item.id}-${item.size}-${item.color}`} className="flex gap-4 bg-white p-4 border">
                  <div className="relative w-24 h-32 flex-shrink-0">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <Link href={`/products/${item.slug}`} className="font-medium hover:underline">
                        {item.name}
                      </Link>
                      <p className="text-sm text-gray-500 mt-1">
                        Size: {item.size} | Color: {item.color}
                      </p>
                      <p className="font-bold mt-2">${item.price.toFixed(2)}</p>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.size, item.color, item.quantity - 1)
                          }
                          className="p-1 border border-gray-300 hover:bg-gray-100"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-12 text-center">{item.quantity}</span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.size, item.color, item.quantity + 1)
                          }
                          className="p-1 border border-gray-300 hover:bg-gray-100"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id, item.size, item.color)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                {subtotal < 100 && (
                  <p className="text-sm text-gray-500">
                    Add ${(100 - subtotal).toFixed(2)} more for free shipping
                  </p>
                )}
                <div className="border-t pt-3 flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-black text-white py-4 text-lg font-medium hover:bg-gray-800 transition"
              >
                Proceed to Checkout
              </button>

              <Link
                href="/products"
                className="block text-center text-sm mt-4 hover:underline"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
