import { Header } from "@/components/Header"
import { HeroSection } from "@/components/HeroSection"
import { ProductCategories } from "@/components/ProductCategories"
import { FeaturedProducts } from "@/components/FeaturedProducts"
import { TestimonialsSection } from "@/components/TestimonialsSection"
import { Footer } from "@/components/Footer"
import { SpecialOffersSection } from "@/components/SpecialOffersSection"
import { NewsletterSection } from "@/components/NewsletterSection"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <ProductCategories />
      <FeaturedProducts />
      <SpecialOffersSection />
      <TestimonialsSection />
      <NewsletterSection />
      <Footer />
    </main>
  )
}
