"use client"

import { useState } from "react"
import Link from "next/link"
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/contexts/CartContext"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { useRouter } from "next/navigation"

export function CartClient() {
  const { state, updateQuantity, removeItem, clearCart } = useCart()
  const [promoCode, setPromoCode] = useState("")
  const router = useRouter()

  const handleQuantityChange = (id: number, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(id)
    } else {
      updateQuantity(id, newQuantity)
    }
  }

  const shippingCost = state.total > 5000 ? 0 : 200
  const finalTotal = state.total + shippingCost

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <div className="text-center max-w-md mx-auto">
            <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground mb-6" />
            <h1 className="text-2xl font-bold text-primary mb-4">Your cart is empty</h1>
            <p className="text-muted-foreground mb-8">Looks like you haven't added any items to your cart yet.</p>
            <Link href="/products">
              <Button size="lg">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Continue Shopping
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
          <span className="text-foreground">Shopping Cart</span>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-primary">Shopping Cart</h1>
              <Button variant="outline" size="sm" onClick={clearCart}>
                <Trash2 className="w-4 h-4 mr-2" />
                Clear Cart
              </Button>
            </div>

            <div className="space-y-4">
              {state.items.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <div className="w-20 h-20 rounded-lg overflow-hidden bg-secondary/30 flex-shrink-0">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-primary">{item.name}</h3>
                            <p className="text-sm text-muted-foreground">{item.category}</p>
                            <p className="text-sm text-muted-foreground">{item.unit}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="w-12 text-center">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>

                          <div className="text-right">
                            <div className="font-semibold text-primary">
                              ₹{(item.price * item.quantity).toLocaleString()}
                            </div>
                            <div className="text-sm text-muted-foreground">₹{item.price.toLocaleString()} each</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6 space-y-4">
                <h2 className="text-lg font-semibold text-primary">Order Summary</h2>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal ({state.itemCount} items)</span>
                    <span>₹{state.total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{shippingCost === 0 ? "Free" : `₹${shippingCost}`}</span>
                  </div>
                  {state.total > 5000 && <div className="text-sm text-green-600">🎉 You saved ₹200 on shipping!</div>}
                </div>

                <Separator />

                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>₹{finalTotal.toLocaleString()}</span>
                </div>

                <div className="space-y-3">

                  <div className="flex gap-2">
                    <Input placeholder="Promo code" value={promoCode} onChange={(e) => setPromoCode(e.target.value)} />
                    <Button variant="outline">Apply</Button>
                  </div>

                  <Button size="lg" className="w-full" onClick={() => router.push("/checkout")}>Proceed to Checkout</Button>

                  <Link href="/products">
                    <Button variant="outline" size="lg" className="w-full bg-transparent">
                      Continue Shopping
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Info */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-3">Shipping Information</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Free shipping on orders above ₹5,000</p>
                  <p>• Same day delivery in select cities</p>
                  <p>• 7-day return policy</p>
                  <p>• Quality assured materials</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
