import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/db'
import { ArrowRight } from 'lucide-react'

export default async function Home() {
  const featuredProducts = await prisma.product.findMany({
    where: { featured: true },
    include: { category: true },
    take: 6,
  })

  const categories = await prisma.category.findMany()

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[90vh] bg-gray-100">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600"
            alt="Hero"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>
        <div className="relative h-full flex items-center justify-center text-center">
          <div className="max-w-3xl mx-auto px-4">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
              Refined Elegance
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8">
              Discover curated collections for the modern wardrobe
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 text-lg font-medium hover:bg-gray-100 transition"
            >
              Shop Collection
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Shop by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/products?category=${category.slug}`}
                className="group relative h-96 overflow-hidden"
              >
                <Image
                  src={category.image || ''}
                  alt={category.name}
                  fill
                  className="object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                  <p className="text-white/90">{category.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">Featured Products</h2>
            <Link href="/products" className="text-sm font-medium hover:underline">
              View All
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => {
              const images = JSON.parse(product.images) as string[]
              return (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  className="group bg-white"
                >
                  <div className="relative aspect-[3/4] overflow-hidden mb-4">
                    <Image
                      src={images[0]}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition duration-500"
                    />
                    {product.salePrice && (
                      <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 text-sm font-medium">
                        SALE
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-gray-500 mb-1">{product.category.name}</p>
                    <h3 className="text-lg font-medium mb-2 group-hover:underline">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      {product.salePrice ? (
                        <>
                          <span className="font-bold">${product.salePrice.toFixed(2)}</span>
                          <span className="text-gray-400 line-through text-sm">
                            ${product.price.toFixed(2)}
                          </span>
                        </>
                      ) : (
                        <span className="font-bold">${product.price.toFixed(2)}</span>
                      )}
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-16 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <h3 className="text-2xl font-bold mb-4">ATELIER</h3>
            <p className="text-gray-400">
              Premium fashion and apparel for the modern wardrobe.
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-4">Shop</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/products" className="hover:text-white">All Products</Link></li>
              <li><Link href="/products?category=men" className="hover:text-white">Men</Link></li>
              <li><Link href="/products?category=women" className="hover:text-white">Women</Link></li>
              <li><Link href="/products?category=shoes" className="hover:text-white">Footwear</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-4">Help</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="#" className="hover:text-white">Contact</Link></li>
              <li><Link href="#" className="hover:text-white">Shipping</Link></li>
              <li><Link href="#" className="hover:text-white">Returns</Link></li>
              <li><Link href="#" className="hover:text-white">FAQ</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-4">Company</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="#" className="hover:text-white">About</Link></li>
              <li><Link href="#" className="hover:text-white">Privacy</Link></li>
              <li><Link href="#" className="hover:text-white">Terms</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>&copy; 2025 ATELIER. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
