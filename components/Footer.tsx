"use client"

import Link from "next/link"
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Twitter, Linkedin, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { categories } from "@/data/products"

const popularBrands = [
  "CraftMart",
  "Century Plyboards",
  "Greenlam Industries",
  "Hettich Hardware",
  "Merino Laminates",
  "Pidilite Industries",
]

const quickLinks = [
  { name: "About Us", href: "/about" },
  { name: "Quality Assurance", href: "/quality" },
  { name: "Installation Services", href: "/services" },
  { name: "Design Consultation", href: "/consultation" },
  { name: "Bulk Orders", href: "/bulk" },
  { name: "Track Order", href: "/track" },
]

export const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Newsletter Section */}
      <div className="bg-accent text-accent-foreground">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-luxury font-bold mb-2">Stay Updated with CraftMart</h3>
              <p className="text-accent-foreground/80">
                Get exclusive offers, new product launches, and expert tips delivered to your inbox.
              </p>
            </div>
            <div className="flex gap-3">
              <Input
                placeholder="Enter your email address"
                className="bg-accent-foreground/10 border-accent-foreground/20 text-accent-foreground placeholder:text-accent-foreground/60"
              />
              <Button className="bg-primary text-primary-foreground hover:bg-primary-hover">
                Subscribe
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-luxury font-bold mb-2">CraftMart</h3>
              <p className="text-primary-foreground/80 text-sm leading-relaxed">
                India's leading destination for premium interior materials. Where quality meets modern design for your
                dream spaces.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="w-4 h-4 text-accent flex-shrink-0" />
                <span>123 Design District, Mumbai - 400001</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 text-accent flex-shrink-0" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-accent flex-shrink-0" />
                <span>info@craftmart.com</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Clock className="w-4 h-4 text-accent flex-shrink-0" />
                <span>Mon - Sat: 9:00 AM - 7:00 PM</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-3">
              <Button size="icon" variant="ghost" className="hover:bg-accent hover:text-accent-foreground">
                <Facebook className="w-4 h-4" />
              </Button>
              <Button size="icon" variant="ghost" className="hover:bg-accent hover:text-accent-foreground">
                <Instagram className="w-4 h-4" />
              </Button>
              <Button size="icon" variant="ghost" className="hover:bg-accent hover:text-accent-foreground">
                <Twitter className="w-4 h-4" />
              </Button>
              <Button size="icon" variant="ghost" className="hover:bg-accent hover:text-accent-foreground">
                <Linkedin className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Product Categories */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-accent">Product Categories</h4>
            <ul className="space-y-3">
              {categories.map((category) => {
                const categorySlug = category.name.toLowerCase().replace(/[^a-z0-9]/g, "-")
                return (
                  <li key={category.name}>
                    <Link
                      href={`/category/${categorySlug}`}
                      className="text-sm text-primary-foreground/80 hover:text-accent transition-colors hover-gold"
                    >
                      {category.name}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-accent">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-primary-foreground/80 hover:text-accent transition-colors hover-gold"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Brands */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-accent">Popular Brands</h4>
            <ul className="space-y-3">
              {popularBrands.map((brand, index) => (
                <li key={index}>
                  <a
                    href={`#${brand.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}
                    className="text-sm text-primary-foreground/80 hover:text-accent transition-colors hover-gold"
                  >
                    {brand}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-primary-foreground/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-primary-foreground/80">
              © 2025 CraftMart Materials. All rights reserved. Built with quality and care.
            </div>

            <div className="flex items-center gap-6 text-sm text-primary-foreground/80">
              <Link href="/privacy" className="hover:text-accent transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-accent transition-colors">
                Terms of Service
              </Link>
              <Link href="/shipping" className="hover:text-accent transition-colors">
                Shipping Policy
              </Link>
              <Link href="/returns" className="hover:text-accent transition-colors">
                Returns
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}