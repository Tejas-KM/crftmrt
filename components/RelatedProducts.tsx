"use client"

import { allProducts } from "@/data/products"
import { ProductCard } from "@/components/ProductCard"
import type { Product } from "@/contexts/CartContext"

interface RelatedProductsProps {
  currentProduct: Product
}

export function RelatedProducts({ currentProduct }: RelatedProductsProps) {
  // Get related products from the same category, excluding current product
  const relatedProducts = allProducts
    .filter((product) => product.category === currentProduct.category && product.id !== currentProduct.id)
    .slice(0, 4)

  if (relatedProducts.length === 0) {
    return null
  }

  return (
    <section>
      <h2 className="text-2xl font-luxury font-bold text-primary mb-8">Related Products</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}
