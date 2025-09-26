"use client"

import type React from "react"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, ShoppingCart, Heart, Eye } from "lucide-react"
import { useCart } from "@/contexts/CartContext"
import { useWishlist } from "@/contexts/WishlistContext"
import { allProducts } from "@/data/products"

// Get first 6 products as featured
const featuredProducts = allProducts.slice(0, 6)

export const FeaturedProducts = () => {
  const { addItem } = useCart()
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist()

  const handleAddToCart = (e: React.MouseEvent, product: any) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(product)
  }

  const handleWishlistToggle = (e: React.MouseEvent, product: any) => {
    e.preventDefault()
    e.stopPropagation()
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist(product)
    }
  }

  return (
    <section className="py-16 md:py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-luxury-fade">
          <span className="inline-block px-4 py-2 bg-accent/10 text-accent rounded-full text-sm font-medium mb-4">
            Featured Selection
          </span>
          <h2 className="text-3xl md:text-4xl font-luxury font-bold text-primary mb-6">Featured Products</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-pretty">
            Hand-picked materials with exceptional quality, competitive pricing, and trusted by customers nationwide.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProducts.map((product, index) => (
            <Card
              key={product.id}
              className="group hover-lift border-accent/10 overflow-hidden"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <Link href={`/products/${product.id}`}>
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={`${product.name} - ${product.category.toLowerCase()} material`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent"></div>

                  {product.badge && (
                    <Badge className="absolute top-4 left-4 bg-accent text-accent-foreground">{product.badge}</Badge>
                  )}

                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute top-4 right-4 bg-background/80 hover:bg-background text-primary"
                    onClick={(e) => handleWishlistToggle(e, product)}
                  >
                    <Heart className={`w-4 h-4 ${isInWishlist(product.id) ? "fill-current text-red-500" : ""}`} />
                  </Button>

                  {product.originalPrice && product.originalPrice > product.price && (
                    <div className="absolute bottom-4 right-4 bg-destructive text-destructive-foreground px-2 py-1 rounded text-sm font-medium">
                      Save ₹{product.originalPrice - product.price}
                    </div>
                  )}
                </div>

                <CardContent className="p-6 space-y-4">
                  <div>
                    <span className="text-xs text-accent font-medium">{product.category}</span>
                    <h3 className="text-lg font-semibold text-primary mb-2 line-clamp-2">{product.name}</h3>
                    <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{product.description}</p>
                  </div>

                  {/* Rating */}
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

                  {/* Features */}
                  <div className="grid grid-cols-2 gap-1">
                    {product.features.slice(0, 4).map((feature, idx) => (
                      <span key={idx} className="text-xs text-muted-foreground">
                        • {feature}
                      </span>
                    ))}
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-primary">₹{product.price.toLocaleString()}</span>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span className="text-sm text-muted-foreground line-through">
                            ₹{product.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">{product.unit}</span>
                    </div>
                  </div>

                  {/* Stock Status */}
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${product.inStock ? "bg-green-500" : "bg-red-500"}`} />
                    <span className={`text-xs ${product.inStock ? "text-green-600" : "text-red-600"}`}>
                      {product.inStock ? "In Stock" : "Out of Stock"}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      className="flex-1 bg-primary hover:bg-primary-hover text-primary-foreground"
                      onClick={(e) => handleAddToCart(e, product)}
                      disabled={!product.inStock}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add to Cart
                    </Button>
                    <Button
                      variant="outline"
                      className="border-accent hover:bg-accent hover:text-accent-foreground bg-transparent"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/products">
            <Button
              size="lg"
              variant="outline"
              className="border-accent hover:bg-accent hover:text-accent-foreground bg-transparent"
            >
              View All Products
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
