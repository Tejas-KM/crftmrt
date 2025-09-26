import type React from "react"
import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { CartProvider } from "@/contexts/CartContext"
import { AuthProvider } from "@/contexts/AuthContext"
import { WishlistProvider } from "@/contexts/WishlistContext"
import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Suspense } from "react"
import { ThemeProvider } from "@/contexts/ThemeContext"
import SessionProviderWrapper from "@/components/SessionProviderWrapper"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-luxury",
})

export const metadata: Metadata = {
  title: "CraftMart - Premium Interior Materials",
  description: "Quality plywood, laminates, hardware and interior materials for your projects",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased">
        <Suspense fallback={null}>
          <SessionProviderWrapper>
            <ThemeProvider>
              <TooltipProvider>
                <AuthProvider>
                  <CartProvider>
                    <WishlistProvider>
                      {children}
                      <Toaster />
                      <Sonner />
                    </WishlistProvider>
                  </CartProvider>
                </AuthProvider>
              </TooltipProvider>
            </ThemeProvider>
          </SessionProviderWrapper>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
