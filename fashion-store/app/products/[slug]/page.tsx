'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ShoppingBag, ArrowLeft } from 'lucide-react'
import { useCart } from '@/components/CartProvider'
import toast from 'react-hot-toast'

type Product = {
  id: string
  name: string
  slug: string
  description: string
  price: number
  salePrice: number | null
  images: string
  sizes: string
  colors: string
  inStock: boolean
  category: {
    name: string
  }
}

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const [product, setProduct] = useState<Product | null>(null)
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [selectedColor, setSelectedColor] = useState<string>('')
  const [selectedImage, setSelectedImage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [slug, setSlug] = useState<string>('')

  const { addToCart } = useCart()
  const router = useRouter()

  useEffect(() => {
    params.then((p) => {
      setSlug(p.slug)
      fetch(`/api/products/${p.slug}`)
        .then((res) => res.json())
        .then((data) => {
          setProduct(data)
          setLoading(false)
        })
        .catch(() => {
          setLoading(false)
        })
    })
  }, [params])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <Link href="/products" className="text-sm hover:underline">
            Back to products
          </Link>
        </div>
      </div>
    )
  }

  const images = JSON.parse(product.images) as string[]
  const sizes = JSON.parse(product.sizes) as string[]
  const colors = JSON.parse(product.colors) as string[]
  const displayPrice = product.salePrice || product.price

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error('Please select a size')
      return
    }
    if (!selectedColor) {
      toast.error('Please select a color')
      return
    }

    addToCart({
      id: product.id,
      name: product.name,
      price: displayPrice,
      image: images[0],
      size: selectedSize,
      color: selectedColor,
      quantity: 1,
      slug: product.slug,
    })

    toast.success('Added to cart!')
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-sm hover:underline mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to products
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <div>
            <div className="relative aspect-[3/4] mb-4 overflow-hidden">
              <Image
                src={images[selectedImage]}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-square border-2 ${
                      selectedImage === index ? 'border-black' : 'border-gray-200'
                    }`}
                  >
                    <Image src={image} alt={`${product.name} ${index + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <p className="text-sm text-gray-500 mb-2">{product.category.name}</p>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{product.name}</h1>

            <div className="flex items-center gap-3 mb-6">
              {product.salePrice ? (
                <>
                  <span className="text-2xl font-bold">${product.salePrice.toFixed(2)}</span>
                  <span className="text-xl text-gray-400 line-through">
                    ${product.price.toFixed(2)}
                  </span>
                  <span className="bg-red-500 text-white px-2 py-1 text-sm font-medium">
                    SALE
                  </span>
                </>
              ) : (
                <span className="text-2xl font-bold">${product.price.toFixed(2)}</span>
              )}
            </div>

            <p className="text-gray-700 mb-8 leading-relaxed">{product.description}</p>

            {/* Size Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-3">
                Size: {selectedSize && <span className="font-bold">{selectedSize}</span>}
              </label>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border ${
                      selectedSize === size
                        ? 'border-black bg-black text-white'
                        : 'border-gray-300 hover:border-black'
                    } transition`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div className="mb-8">
              <label className="block text-sm font-medium mb-3">
                Color: {selectedColor && <span className="font-bold">{selectedColor}</span>}
              </label>
              <div className="flex flex-wrap gap-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 border ${
                      selectedColor === color
                        ? 'border-black bg-black text-white'
                        : 'border-gray-300 hover:border-black'
                    } transition`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className="w-full bg-black text-white py-4 text-lg font-medium hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
            >
              <ShoppingBag className="h-5 w-5" />
              {product.inStock ? 'Add to Cart' : 'Out of Stock'}
            </button>

            {/* Product Details */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="font-medium mb-4">Product Details</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Premium quality materials</li>
                <li>• Expertly crafted construction</li>
                <li>• Free shipping on orders over $100</li>
                <li>• Easy returns within 30 days</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
