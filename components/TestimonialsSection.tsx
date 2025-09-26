"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Star, Quote } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const testimonials = [
  {
    id: 1,
    name: "Rajesh Kumar",
    role: "Interior Designer",
    company: "Design Studio Mumbai",
    image: "/placeholder.svg?height=60&width=60",
    rating: 5,
    content:
      "CraftMart has been our go-to supplier for premium materials. Their quality is consistent and delivery is always on time. Highly recommended for professional projects.",
  },
  {
    id: 2,
    name: "Priya Sharma",
    role: "Homeowner",
    company: "Pune",
    image: "/placeholder.svg?height=60&width=60",
    rating: 5,
    content:
      "Renovated my entire home with materials from CraftMart. The quality is exceptional and their team provided excellent guidance throughout the process.",
  },
  {
    id: 3,
    name: "Amit Patel",
    role: "Contractor",
    company: "Patel Construction",
    image: "/placeholder.svg?height=60&width=60",
    rating: 5,
    content:
      "Been working with CraftMart for 3 years now. Their product range is extensive and the pricing is very competitive. Great support team too.",
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-accent/10 text-accent rounded-full text-sm font-medium mb-4">
            Customer Stories
          </span>
          <h2 className="text-3xl md:text-4xl font-luxury font-bold text-primary mb-6">What Our Customers Say</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Join thousands of satisfied customers who trust CraftMart for their interior material needs.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card
              key={testimonial.id}
              className="hover-lift border-accent/10"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-accent fill-current" />
                  ))}
                </div>

                <div className="relative">
                  <Quote className="w-8 h-8 text-accent/20 absolute -top-2 -left-2" />
                  <p className="text-muted-foreground leading-relaxed pl-6">{testimonial.content}</p>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-border/50">
                  <Avatar>
                    <AvatarImage src={testimonial.image || "/placeholder.svg"} alt={testimonial.name} />
                    <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold text-primary">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role} • {testimonial.company}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
