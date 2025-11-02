'use client'

import Link from 'next/link'
import { ShoppingBag, Search, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useCart } from '@/components/CartProvider'

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { cart } = useCart()

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold tracking-tight">
            ATELIER
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/products" className="text-sm font-medium hover:text-gray-600 transition">
              All Products
            </Link>
            <Link href="/products?category=men" className="text-sm font-medium hover:text-gray-600 transition">
              Men
            </Link>
            <Link href="/products?category=women" className="text-sm font-medium hover:text-gray-600 transition">
              Women
            </Link>
            <Link href="/products?category=shoes" className="text-sm font-medium hover:text-gray-600 transition">
              Footwear
            </Link>
          </div>

          {/* Icons */}
          <div className="flex items-center space-x-4">
            <button className="hidden md:block text-gray-700 hover:text-gray-900">
              <Search className="h-5 w-5" />
            </button>
            <Link href="/cart" className="relative text-gray-700 hover:text-gray-900">
              <ShoppingBag className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
            <button
              className="md:hidden text-gray-700"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-4 space-y-3">
            <Link
              href="/products"
              className="block text-base font-medium hover:text-gray-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              All Products
            </Link>
            <Link
              href="/products?category=men"
              className="block text-base font-medium hover:text-gray-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              Men
            </Link>
            <Link
              href="/products?category=women"
              className="block text-base font-medium hover:text-gray-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              Women
            </Link>
            <Link
              href="/products?category=shoes"
              className="block text-base font-medium hover:text-gray-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              Footwear
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
