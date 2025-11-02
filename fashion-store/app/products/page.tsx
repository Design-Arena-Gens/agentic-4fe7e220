import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/db'

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { category?: string }
}) {
  const categorySlug = searchParams.category

  let products
  let pageTitle = 'All Products'

  if (categorySlug) {
    const category = await prisma.category.findUnique({
      where: { slug: categorySlug },
      include: {
        products: {
          include: { category: true },
        },
      },
    })

    products = category?.products || []
    pageTitle = category?.name || pageTitle
  } else {
    products = await prisma.product.findMany({
      include: { category: true },
    })
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-12">{pageTitle}</h1>

        {products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No products found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => {
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
                    {!product.inStock && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white font-medium">Out of Stock</span>
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
        )}
      </div>
    </div>
  )
}
