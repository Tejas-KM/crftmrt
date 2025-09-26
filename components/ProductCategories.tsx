"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Package } from "lucide-react"
import { categories } from "@/data/products"

export const ProductCategories = () => {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-luxury-fade">
          <span className="inline-block px-4 py-2 bg-accent/10 text-accent rounded-full text-sm font-medium mb-4">
            Our Collections
          </span>
          <h2 className="text-3xl md:text-4xl font-luxury font-bold text-primary mb-6">Material Categories</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-pretty">
            Discover our comprehensive selection of premium interior materials, each category carefully curated for
            quality, durability, and modern design excellence.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => {
            const categorySlug = category.name.toLowerCase().replace(/[^a-z0-9]/g, "-")

            return (
              <Card
                key={category.name}
                className="group hover-lift border-accent/10 overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Link href={`/category/${categorySlug}`}>
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={category.image || "/placeholder.svg?height=200&width=300"}
                      alt={`${category.name} materials showcase`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {/* Removed gradient overlay for cleaner category images */}

                    {/* Product Count Badge */}
                    <div className="absolute top-4 right-4 bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                      <Package className="w-3 h-3" />
                      {category.productCount} Products
                    </div>

                    {/* Category Title Overlay */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-xl font-luxury font-bold text-white mb-1">{category.name}</h3>
                    </div>
                  </div>

                  <CardContent className="p-6 space-y-4">
                    <div>
                      <p className="text-muted-foreground text-sm leading-relaxed">{category.description}</p>
                    </div>

                    {/* Quick Stats */}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Available Products</span>
                      <span className="font-semibold text-primary">{category.productCount}</span>
                    </div>

                    <Button
                      variant="ghost"
                      className="w-full group-hover:bg-accent group-hover:text-accent-foreground transition-colors"
                    >
                      Browse Collection
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Link>
              </Card>
            )
          })}
        </div>

        <div className="text-center mt-12">
          <Link href="/products">
            <Button size="lg" className="bg-primary hover:bg-primary-hover text-primary-foreground">
              View All Products
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
