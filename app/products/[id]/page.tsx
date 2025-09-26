import { notFound } from "next/navigation"
import { allProducts } from "@/data/products"
import { ProductDetailClient } from "@/components/ProductDetailClient"

interface ProductPageProps {
  params: {
    id: string
  }
}

export async function generateStaticParams() {
  return allProducts.map((product) => ({
    id: product.id.toString(),
  }))
}

export async function generateMetadata({ params }: ProductPageProps) {
  const product = allProducts.find((p) => p.id === Number.parseInt(params.id))

  if (!product) {
    return {
      title: "Product Not Found - CraftMart",
    }
  }

  return {
    title: `${product.name} - CraftMart`,
    description: product.description,
  }
}

export default function ProductPage({ params }: ProductPageProps) {
  const product = allProducts.find((p) => p.id === Number.parseInt(params.id))

  if (!product) {
    notFound()
  }

  return <ProductDetailClient product={product} />
}
