"use client"

import { useState, useMemo } from "react"
import { Search, Grid, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { ProductCard } from "@/components/ProductCard"
import type { Product } from "@/contexts/CartContext"

interface CategoryClientProps {
  category: {
    name: string
    description: string
    image: string
    productCount: number
  }
  products: Product[]
  searchParams: {
    search?: string
    sort?: string
  }
}

export function CategoryClient({ category, products, searchParams }: CategoryClientProps) {
  const [searchTerm, setSearchTerm] = useState(searchParams.search || "")
  const [sortBy, setSortBy] = useState(searchParams.sort || "name")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "rating":
          return b.rating - a.rating
        case "name":
        default:
          return a.name.localeCompare(b.name)
      }
    })

    return filtered
  }, [products, searchTerm, sortBy])

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Category Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-luxury font-bold text-primary mb-4">{category.name}</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">{category.description}</p>
          <div className="inline-flex items-center gap-2 bg-secondary/50 px-4 py-2 rounded-full">
            <span className="text-sm font-medium">{category.productCount} Products Available</span>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-card rounded-lg border p-6 mb-8">
          <div className="grid md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search in this category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name A-Z</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
              </SelectContent>
            </Select>

            {/* View Mode */}
            <div className="flex gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-muted-foreground">
            Showing {filteredAndSortedProducts.length} products in {category.name}
          </p>
        </div>

        {/* Products Grid */}
        {filteredAndSortedProducts.length > 0 ? (
          <div
            className={`grid gap-6 mb-12 ${
              viewMode === "grid" ? "md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"
            }`}
          >
            {filteredAndSortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} viewMode={viewMode} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground mb-4">No products found in this category</p>
            <Button onClick={() => setSearchTerm("")}>Clear Search</Button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
