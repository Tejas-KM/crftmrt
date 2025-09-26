"use client"

import type React from "react"

import Link from "next/link"
import { Star, Heart, ShoppingCart, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { useCart } from "@/contexts/CartContext"
import { useWishlist } from "@/contexts/WishlistContext"
import type { Product } from "@/contexts/CartContext"

interface ProductCardProps {
  product: Product
  viewMode?: "grid" | "list"
}

export function ProductCard({ product, viewMode = "grid" }: ProductCardProps) {
  const { addItem } = useCart()
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(product)
  }

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist(product)
    }
  }

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    // Quick view functionality can be added here
  }

  if (viewMode === "list") {
    return (
      <Card className="group hover-lift border-accent/10 overflow-hidden">
        <div className="flex gap-6 p-6">
          <Link
            href={`/products/${product.id}`}
            className="relative w-48 h-32 flex-shrink-0 rounded-lg overflow-hidden"
          >
            <img
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {product.badge && (
              <Badge className="absolute top-2 left-2 bg-accent text-accent-foreground">{product.badge}</Badge>
            )}
          </Link>

          <div className="flex-1 space-y-3">
            <Link href={`/products/${product.id}`}>
              <span className="text-xs text-accent font-medium">{product.category}</span>
              <h3 className="text-lg font-semibold text-primary mb-2 line-clamp-1 hover:text-accent transition-colors">
                {product.name}
              </h3>
              <p className="text-muted-foreground text-sm line-clamp-2">{product.description}</p>
            </Link>

            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < Math.floor(product.rating) ? "text-accent fill-current" : "text-muted-foreground"}`}
                  />
                ))}
              </div>
              <span className="text-sm font-medium">{product.rating}</span>
              <span className="text-xs text-muted-foreground">({product.reviews} reviews)</span>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-primary">₹{product.price.toLocaleString()}</span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-sm text-muted-foreground line-through">
                      ₹{product.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
                <span className="text-xs text-muted-foreground">{product.unit}</span>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleWishlistToggle}
                  className={isInWishlist(product.id) ? "text-red-500 border-red-500" : ""}
                >
                  <Heart className={`w-4 h-4 ${isInWishlist(product.id) ? "fill-current" : ""}`} />
                </Button>
                <Button size="sm" onClick={handleAddToCart} disabled={!product.inStock}>
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="group hover-lift border-accent/10 overflow-hidden h-full flex flex-col">
      <div className="relative h-48 overflow-hidden">
        <Link href={`/products/${product.id}`}>
          <img
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          {/* Removed blue/violet gradient overlay for cleaner product images */}
        </Link>

        {product.badge && (
          <Badge className="absolute top-4 left-4 bg-accent text-accent-foreground">{product.badge}</Badge>
        )}

        <Button
          size="icon"
          variant="ghost"
          className="absolute top-4 right-4 bg-background/80 hover:bg-background text-primary"
          onClick={handleWishlistToggle}
        >
          <Heart className={`w-4 h-4 ${isInWishlist(product.id) ? "fill-current text-red-500" : ""}`} />
        </Button>

        {product.originalPrice && product.originalPrice > product.price && (
          <div className="absolute bottom-4 right-4 bg-destructive text-destructive-foreground px-2 py-1 rounded text-sm font-medium">
            Save ₹{product.originalPrice - product.price}
          </div>
        )}
      </div>

      <CardContent className="p-4 flex flex-col flex-1">
        <div className="flex-1 space-y-3">
          <Link href={`/products/${product.id}`}>
            <span className="text-xs text-accent font-medium">{product.category}</span>
            <h3 className="text-lg font-semibold text-primary mb-2 line-clamp-2 hover:text-accent transition-colors">
              {product.name}
            </h3>
            <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{product.description}</p>
          </Link>

          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < Math.floor(product.rating) ? "text-accent fill-current" : "text-muted-foreground"}`}
                />
              ))}
            </div>
            <span className="text-sm font-medium">{product.rating}</span>
            <span className="text-xs text-muted-foreground">({product.reviews} reviews)</span>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-primary">₹{product.price.toLocaleString()}</span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-sm text-muted-foreground line-through">
                    ₹{product.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>
              <span className="text-xs text-muted-foreground">{product.unit}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2 pt-4 mt-auto">
          <Button
            className="flex-1 bg-primary hover:bg-primary-hover text-primary-foreground h-10"
            onClick={handleAddToCart}
            disabled={!product.inStock}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Add to Cart
          </Button>
          <Button
            variant="outline"
            className="border-accent hover:bg-accent hover:text-accent-foreground bg-transparent h-10 w-10 p-0"
            onClick={handleQuickView}
          >
            <Eye className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
