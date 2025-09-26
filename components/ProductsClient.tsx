"use client"

import { useState, useMemo } from "react"
import { Search, Grid, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { ProductCard } from "@/components/ProductCard"
import type { Product } from "@/contexts/CartContext"

interface ProductsClientProps {
  products: Product[]
  categories: Array<{
    name: string
    description: string
    image: string
    productCount: number
  }>
  searchParams: {
    category?: string
    search?: string
    sort?: string
  }
}

export function ProductsClient({ products, categories, searchParams }: ProductsClientProps) {
  const [searchTerm, setSearchTerm] = useState(searchParams.search || "")
  const [selectedCategory, setSelectedCategory] = useState(searchParams.category || "all")
  const [sortBy, setSortBy] = useState(searchParams.sort || "name")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((product) => product.category === selectedCategory)
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
  }, [products, searchTerm, selectedCategory, sortBy])

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-luxury font-bold text-primary mb-4">All Products</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our complete collection of premium interior materials for your projects
          </p>
        </div>

        {/* Filters and Search */}
        <div className="bg-card rounded-lg border p-6 mb-8">
          <div className="grid md:grid-cols-4 gap-4 mb-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.name} value={category.name}>
                    {category.name} ({category.productCount})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

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

          {/* Active Filters */}
          <div className="flex flex-wrap gap-2">
            {searchTerm && (
              <Badge variant="secondary" className="gap-1">
                Search: {searchTerm}
                <button onClick={() => setSearchTerm("")} className="ml-1 hover:text-destructive">
                  ×
                </button>
              </Badge>
            )}
            {selectedCategory !== "all" && (
              <Badge variant="secondary" className="gap-1">
                Category: {selectedCategory}
                <button onClick={() => setSelectedCategory("all")} className="ml-1 hover:text-destructive">
                  ×
                </button>
              </Badge>
            )}
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-muted-foreground">
            Showing {filteredAndSortedProducts.length} of {products.length} products
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
            <p className="text-lg text-muted-foreground mb-4">No products found matching your criteria</p>
            <Button
              onClick={() => {
                setSearchTerm("")
                setSelectedCategory("all")
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
