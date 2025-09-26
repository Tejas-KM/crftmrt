"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Phone, CheckCircle, ArrowRight, Play, Award, Truck } from "lucide-react"

export const HeroSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    userType: "I'm a Contractor",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log("Form submitted:", formData)
  }

  return (
    <section className="relative min-h-[700px] md:min-h-[800px] bg-gradient-to-br from-background via-secondary/20 to-accent/5 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=100&width=100')] bg-repeat opacity-10"></div>
      </div>

      <div className="container mx-auto px-4 py-12 md:py-20 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="animate-luxury-fade space-y-8">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-6xl font-luxury font-bold text-primary leading-tight">
                Premium
                <span className="block bg-gradient-to-r from-accent to-accent-dark bg-clip-text text-transparent">
                  Interior Materials
                </span>
                <span className="block text-3xl md:text-4xl text-muted-foreground font-normal">Delivered Fast</span>
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground max-w-lg leading-relaxed">
                Transform your spaces with our curated collection of premium plywood, laminates, and hardware. Quality
                guaranteed, delivered same day.
              </p>
            </div>

            {/* Key Features */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-card rounded-lg border border-accent/10">
                <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" />
                <span className="text-sm font-medium">Quality Assured</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-card rounded-lg border border-accent/10">
                <Truck className="w-5 h-5 text-accent flex-shrink-0" />
                <span className="text-sm font-medium">Same Day Delivery</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-card rounded-lg border border-accent/10">
                <Award className="w-5 h-5 text-accent flex-shrink-0" />
                <span className="text-sm font-medium">Expert Support</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-card rounded-lg border border-accent/10">
                <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" />
                <span className="text-sm font-medium">Best Prices</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/products">
                <Button size="lg" className="bg-primary hover:bg-primary-hover text-primary-foreground shadow-lg">
                  Browse Products
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="border-accent hover:bg-accent hover:text-accent-foreground bg-transparent"
              >
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </Button>
            </div>

            {/* Contact Form */}
            <div className="bg-card p-6 rounded-xl shadow-lg border border-accent/10">
              <h3 className="text-lg font-semibold mb-4 text-primary">Get Professional Consultation</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                  <Input
                    placeholder="Phone Number"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>

                <select
                  className="w-full px-3 py-2 border border-input rounded-md text-sm bg-background"
                  value={formData.userType}
                  onChange={(e) => setFormData({ ...formData, userType: e.target.value })}
                >
                  <option>I'm a Contractor</option>
                  <option>I'm a Home Owner</option>
                  <option>I'm a Reseller</option>
                  <option>I'm an Architect</option>
                </select>

                <Button type="submit" className="w-full bg-accent hover:bg-accent-dark text-accent-foreground">
                  <Phone className="w-4 h-4 mr-2" />
                  Get Free Consultation
                </Button>
              </form>
            </div>
          </div>

          {/* Right Image */}
          <div className="animate-luxury-fade lg:order-last">
            <div className="relative">
              <img
                src="/modern-interior-materials-showroom-with-premium-wo.jpg"
                alt="Luxury interior materials showroom with premium wood panels and elegant displays"
                className="w-full h-[500px] md:h-[600px] object-cover rounded-2xl shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent rounded-2xl"></div>

              {/* Floating Stats */}
              <div className="absolute bottom-6 left-6 right-6 bg-background/95 backdrop-blur-sm rounded-xl p-6 border border-accent/20 shadow-lg">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-primary">500+</div>
                    <div className="text-xs text-muted-foreground">Premium Products</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">24/7</div>
                    <div className="text-xs text-muted-foreground">Expert Support</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">Fast</div>
                    <div className="text-xs text-muted-foreground">Delivery</div>
                  </div>
                </div>
              </div>

              {/* Floating Badge */}
              <div className="absolute top-6 right-6 bg-accent text-accent-foreground px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                Same Day Delivery
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
