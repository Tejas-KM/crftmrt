"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Star, Heart, ShoppingCart, Share2, Truck, Shield, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useCart } from "@/contexts/CartContext"
import { useWishlist } from "@/contexts/WishlistContext"
import type { Product } from "@/contexts/CartContext"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { RelatedProducts } from "@/components/RelatedProducts"

interface ProductDetailClientProps {
  product: Product
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const router = useRouter()
  const { addItem } = useCart()
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist()
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(product)
    }
  }

  const handleWishlistToggle = () => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist(product)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
    }
  }

  // Mock additional images for demonstration
  const productImages = [product.image, product.image, product.image]

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Button variant="ghost" size="sm" onClick={() => router.back()} className="p-0 h-auto hover:text-primary">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back
          </Button>
          <span>/</span>
          <span>Products</span>
          <span>/</span>
          <span>{product.category}</span>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square rounded-lg overflow-hidden bg-secondary/30">
              <img
                src={productImages[selectedImage] || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === index ? "border-primary" : "border-transparent"
                  }`}
                >
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`${product.name} view ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">{product.category}</Badge>
                {product.badge && <Badge className="bg-accent text-accent-foreground">{product.badge}</Badge>}
              </div>
              <h1 className="text-3xl font-luxury font-bold text-primary mb-4">{product.name}</h1>
              <p className="text-lg text-muted-foreground mb-4">{product.description}</p>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-6">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${i < Math.floor(product.rating) ? "text-accent fill-current" : "text-muted-foreground"}`}
                    />
                  ))}
                </div>
                <span className="font-medium">{product.rating}</span>
                <span className="text-muted-foreground">({product.reviews} reviews)</span>
              </div>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-primary">₹{product.price.toLocaleString()}</span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-xl text-muted-foreground line-through">
                    ₹{product.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>
              <p className="text-muted-foreground">{product.unit}</p>
              {product.originalPrice && product.originalPrice > product.price && (
                <p className="text-green-600 font-medium">
                  Save ₹{(product.originalPrice - product.price).toLocaleString()}(
                  {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% off)
                </p>
              )}
            </div>

            {/* Features */}
            <div>
              <h3 className="font-semibold mb-3">Key Features</h3>
              <div className="grid grid-cols-2 gap-2">
                {product.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-accent rounded-full" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${product.inStock ? "bg-green-500" : "bg-red-500"}`} />
              <span className={product.inStock ? "text-green-600" : "text-red-600"}>
                {product.inStock ? `In Stock (${product.stockQuantity} available)` : "Out of Stock"}
              </span>
            </div>

            {/* Quantity and Actions */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <label className="font-medium">Quantity:</label>
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    -
                  </Button>
                  <span className="px-4 py-2 min-w-[60px] text-center">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={!product.inStock || quantity >= (product.stockQuantity || 0)}
                  >
                    +
                  </Button>
                </div>
              </div>

              <div className="flex gap-3">
                <Button size="lg" className="flex-1" onClick={handleAddToCart} disabled={!product.inStock}>
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleWishlistToggle}
                  className={isInWishlist(product.id) ? "text-red-500 border-red-500" : ""}
                >
                  <Heart className={`w-5 h-5 ${isInWishlist(product.id) ? "fill-current" : ""}`} />
                </Button>
                <Button variant="outline" size="lg" onClick={handleShare}>
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Service Info */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t">
              <div className="text-center">
                <Truck className="w-6 h-6 mx-auto mb-2 text-accent" />
                <p className="text-sm font-medium">Free Delivery</p>
                <p className="text-xs text-muted-foreground">On orders above ₹5000</p>
              </div>
              <div className="text-center">
                <Shield className="w-6 h-6 mx-auto mb-2 text-accent" />
                <p className="text-sm font-medium">Quality Assured</p>
                <p className="text-xs text-muted-foreground">Certified materials</p>
              </div>
              <div className="text-center">
                <RotateCcw className="w-6 h-6 mx-auto mb-2 text-accent" />
                <p className="text-sm font-medium">Easy Returns</p>
                <p className="text-xs text-muted-foreground">7-day return policy</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <Card className="mb-16">
          <CardContent className="p-6">
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="specifications">Specifications</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="mt-6">
                <div className="prose max-w-none">
                  <h3 className="text-lg font-semibold mb-4">Product Description</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {product.description} This premium material is carefully selected and tested to ensure it meets the
                    highest standards of quality and durability. Perfect for both residential and commercial
                    applications, it offers excellent value for money while maintaining superior performance
                    characteristics.
                  </p>
                  <h4 className="text-md font-semibold mt-6 mb-3">Applications</h4>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Interior furniture construction</li>
                    <li>Cabinet making and joinery</li>
                    <li>Architectural millwork</li>
                    <li>Commercial fit-outs</li>
                  </ul>
                </div>
              </TabsContent>

              <TabsContent value="specifications" className="mt-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Technical Specifications</h3>
                    <div className="space-y-3">
                      {product.features.map((feature, index) => (
                        <div key={index} className="flex justify-between py-2 border-b border-border/50">
                          <span className="text-muted-foreground">Feature {index + 1}</span>
                          <span className="font-medium">{feature}</span>
                        </div>
                      ))}
                      <div className="flex justify-between py-2 border-b border-border/50">
                        <span className="text-muted-foreground">Category</span>
                        <span className="font-medium">{product.category}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-border/50">
                        <span className="text-muted-foreground">Unit</span>
                        <span className="font-medium">{product.unit}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Quality Standards</h3>
                    <div className="space-y-2 text-muted-foreground">
                      <p>• IS 303 Certified</p>
                      <p>• BWR Grade Compliant</p>
                      <p>• E1 Emission Standards</p>
                      <p>• Quality Tested</p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="mt-6">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Customer Reviews</h3>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < Math.floor(product.rating) ? "text-accent fill-current" : "text-muted-foreground"}`}
                          />
                        ))}
                      </div>
                      <span className="font-medium">{product.rating}</span>
                      <span className="text-muted-foreground">({product.reviews} reviews)</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Mock reviews */}
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-accent-foreground text-sm font-medium">
                              R
                            </div>
                            <span className="font-medium">Rajesh Kumar</span>
                          </div>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 text-accent fill-current" />
                            ))}
                          </div>
                        </div>
                        <p className="text-muted-foreground">
                          Excellent quality material. Used it for my kitchen cabinets and very satisfied with the finish
                          and durability.
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-accent-foreground text-sm font-medium">
                              P
                            </div>
                            <span className="font-medium">Priya Sharma</span>
                          </div>
                          <div className="flex items-center">
                            {[...Array(4)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 text-accent fill-current" />
                            ))}
                            <Star className="w-4 h-4 text-muted-foreground" />
                          </div>
                        </div>
                        <p className="text-muted-foreground">
                          Good product with fast delivery. The quality matches the description. Would recommend to
                          others.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Related Products */}
        <RelatedProducts currentProduct={product} />
      </main>

      <Footer />
    </div>
  )
}
