import { notFound } from "next/navigation"
import { allProducts, categories } from "@/data/products"
import { CategoryClient } from "@/components/CategoryClient"

interface CategoryPageProps {
  params: {
    slug: string
  }
  searchParams: {
    search?: string
    sort?: string
  }
}

export async function generateStaticParams() {
  return categories.map((category) => ({
    slug: category.name.toLowerCase().replace(/[^a-z0-9]/g, "-"),
  }))
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const categoryName = params.slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
  const category = categories.find((c) => c.name.toLowerCase().replace(/[^a-z0-9]/g, "-") === params.slug)

  if (!category) {
    return {
      title: "Category Not Found - CraftMart",
    }
  }

  return {
    title: `${category.name} - CraftMart`,
    description: category.description,
  }
}

export default function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const category = categories.find((c) => c.name.toLowerCase().replace(/[^a-z0-9]/g, "-") === params.slug)

  if (!category) {
    notFound()
  }

  const categoryProducts = allProducts.filter((p) => p.category === category.name)

  return <CategoryClient category={category} products={categoryProducts} searchParams={searchParams} />
}
