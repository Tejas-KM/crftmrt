"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Percent, Truck, Star, ArrowRight } from "lucide-react"

export const SpecialOffersSection = () => {
  const offers = [
    {
      id: 1,
      title: "Flash Sale",
      description: "Up to 30% off on Premium Plywood",
      discount: "30% OFF",
      timeLeft: "2 days left",
      image: "/premium-marine-plywood-sheets.jpg",
      category: "Plywood",
      originalPrice: "₹2,500",
      salePrice: "₹1,750",
      badge: "Limited Time",
    },
    {
      id: 2,
      title: "Bundle Deal",
      description: "Complete Interior Package",
      discount: "25% OFF",
      timeLeft: "5 days left",
      image: "/premium-blockboard-interior.jpg",
      category: "Complete Set",
      originalPrice: "₹15,000",
      salePrice: "₹11,250",
      badge: "Best Value",
    },
    {
      id: 3,
      title: "New Launch",
      description: "Designer Laminates Collection",
      discount: "20% OFF",
      timeLeft: "1 week left",
      image: "/designer-laminates-collection-modern-interior.jpg",
      category: "Laminates",
      originalPrice: "₹800",
      salePrice: "₹640",
      badge: "New Arrival",
    },
  ]

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge className="bg-red-500/10 text-red-600 border-red-500/20 mb-4">
            <Percent className="w-4 h-4 mr-2" />
            Special Offers
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Limited Time Deals</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Don't miss out on these exclusive offers. Premium quality materials at unbeatable prices.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className="group relative bg-card rounded-2xl shadow-lg border border-accent/10 overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              {/* Badge */}
              <div className="absolute top-4 left-4 z-10">
                <Badge className="bg-red-500 text-white border-0">{offer.badge}</Badge>
              </div>

              {/* Discount Badge */}
              <div className="absolute top-4 right-4 z-10">
                <div className="bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-bold">
                  {offer.discount}
                </div>
              </div>

              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={offer.image || "/placeholder.svg"}
                  alt={offer.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-accent font-medium">{offer.category}</span>
                    <div className="flex items-center gap-1 text-yellow-500">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm">4.8</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-primary">{offer.title}</h3>
                  <p className="text-muted-foreground">{offer.description}</p>
                </div>

                {/* Pricing */}
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-primary">{offer.salePrice}</span>
                  <span className="text-lg text-muted-foreground line-through">{offer.originalPrice}</span>
                </div>

                {/* Time Left */}
                <div className="flex items-center gap-2 text-red-600">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-medium">{offer.timeLeft}</span>
                </div>

                {/* Features */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Truck className="w-4 h-4" />
                    Free Delivery
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4" />
                    Quality Assured
                  </div>
                </div>

                {/* CTA Button */}
                <Link href={`/products?category=${offer.category.toLowerCase()}`}>
                  <Button className="w-full bg-accent hover:bg-accent-dark text-accent-foreground">
                    Shop Now
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/products">
            <Button
              size="lg"
              variant="outline"
              className="border-accent hover:bg-accent hover:text-accent-foreground bg-transparent"
            >
              View All Offers
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
