"use client"

import Link from "next/link"
import { Heart, ShoppingCart, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useWishlist } from "@/contexts/WishlistContext"
import { useCart } from "@/contexts/CartContext"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { ProductCard } from "@/components/ProductCard"

export function WishlistClient() {
  const { state, clearWishlist } = useWishlist()
  const { addItem } = useCart()

  const handleAddAllToCart = () => {
    state.items.forEach((item) => {
      addItem(item)
    })
  }

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <div className="text-center max-w-md mx-auto">
            <Heart className="w-16 h-16 mx-auto text-muted-foreground mb-6" />
            <h1 className="text-2xl font-bold text-primary mb-4">Your wishlist is empty</h1>
            <p className="text-muted-foreground mb-8">Save items you love to your wishlist and shop them later.</p>
            <Link href="/products">
              <Button size="lg">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Discover Products
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-primary">
            Home
          </Link>
          <span>/</span>
          <span className="text-foreground">Wishlist</span>
        </div>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-primary">My Wishlist</h1>
            <p className="text-muted-foreground">{state.items.length} items saved</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={handleAddAllToCart}>
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add All to Cart
            </Button>
            <Button variant="outline" onClick={clearWishlist}>
              Clear Wishlist
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {state.items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  )
}
