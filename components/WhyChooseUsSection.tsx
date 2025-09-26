"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Shield, Truck, Award, Clock, ThumbsUp } from "lucide-react"

const features = [
  {
    icon: Shield,
    title: "Quality Guaranteed",
    description: "All products are certified and tested for durability and performance standards.",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    description: "Same-day delivery in major cities and express shipping nationwide.",
  },
  {
    icon: Award,
    title: "Expert Support",
    description: "Professional consultation and technical support from our experienced team.",
  },
  {
    icon: Clock,
    title: "24/7 Service",
    description: "Round-the-clock customer support for all your queries and concerns.",
  },
  {
    icon: ThumbsUp,
    title: "Best Prices",
    description: "Competitive pricing with bulk discounts and seasonal offers.",
  },
]

export function WhyChooseUsSection() {
  return (
    <section className="py-16 md:py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-accent/10 text-accent rounded-full text-sm font-medium mb-4">
            Why Choose Us
          </span>
          <h2 className="text-3xl md:text-4xl font-luxury font-bold text-primary mb-6">
            Your Trusted Materials Partner
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            We're committed to providing the best interior materials and service experience in the industry.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card
                key={index}
                className="hover-lift border-accent/10 text-center"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6 space-y-4">
                  <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
                    <Icon className="w-8 h-8 text-accent" />
                  </div>
                  <h3 className="text-xl font-semibold text-primary">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
