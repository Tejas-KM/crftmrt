"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, Gift, Bell, CheckCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export const NewsletterSection = () => {
  const [email, setEmail] = useState("")
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setIsSubscribed(true)
      setEmail("")
      setTimeout(() => setIsSubscribed(false), 3000)
    }
  }

  return (
    <section className="py-16 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <Badge className="bg-accent/10 text-accent border-accent/20 px-4 py-2">
              <Gift className="w-4 h-4 mr-2" />
              Exclusive Offers
            </Badge>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Stay Updated with Latest Deals</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Get exclusive access to new product launches, special discounts, and expert tips for your interior projects.
          </p>

          <div className="bg-card p-8 rounded-2xl shadow-lg border border-accent/10 max-w-2xl mx-auto">
            {isSubscribed ? (
              <div className="text-center space-y-4">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                <h3 className="text-xl font-semibold text-primary">Thank You!</h3>
                <p className="text-muted-foreground">You've been successfully subscribed to our newsletter.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <Input
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-12 text-base"
                    />
                  </div>
                  <Button
                    type="submit"
                    size="lg"
                    className="bg-accent hover:bg-accent-dark text-accent-foreground h-12 px-8"
                  >
                    <Mail className="w-5 h-5 mr-2" />
                    Subscribe
                  </Button>
                </div>

                <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4" />
                    Weekly Updates
                  </div>
                  <div className="flex items-center gap-2">
                    <Gift className="w-4 h-4" />
                    Exclusive Deals
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    No Spam
                  </div>
                </div>
              </form>
            )}
          </div>

          <p className="text-xs text-muted-foreground mt-4">
            By subscribing, you agree to our Privacy Policy and Terms of Service.
          </p>
        </div>
      </div>
    </section>
  )
}
