"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Search, ShoppingCart, Menu, X, Heart, Sun, Moon, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { HeaderSearchBar } from "@/components/HeaderSearchBar"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

import { useCart } from "@/contexts/CartContext"
import { useWishlist } from "@/contexts/WishlistContext"
import { useTheme } from "@/contexts/ThemeContext"
import { useAuth } from "@/contexts/AuthContext"
import { categories } from "@/data/products"

export const Header = ({ compact }: { compact?: boolean }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [showNavbar, setShowNavbar] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const { state: cartState } = useCart()
  const { state: wishlistState } = useWishlist()
  const { theme, toggleTheme } = useTheme()
  const { user, logout } = useAuth()
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)

  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 50);
      if (currentScrollY > lastScrollY) {
        // Scrolling down
        setShowNavbar(false);
      } else {
        // Scrolling up
        setShowNavbar(true);
      }
      lastScrollY = currentScrollY;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Compact header (logo + search + icons) for minimal pages
  if (compact) {
    return (
      <header className={`bg-background border-b border-border/50 sticky top-0 z-50 backdrop-blur-sm transition-all duration-500 ease-in-out ${showNavbar ? 'translate-y-0 opacity-100 pointer-events-auto' : '-translate-y-full opacity-0 pointer-events-none'}`}>
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between w-full">
            <Link href="/" className="flex items-center">
              <h1 className="text-xl font-luxury font-bold text-primary">CraftMart</h1>
            </Link>

            {/* smaller compact search, hidden on scroll down (desktop only) */}
            <div className={`flex-1 mx-3 hidden sm:flex transition-all duration-300 ${showNavbar ? 'opacity-100 max-w-md' : 'opacity-0 max-w-0 pointer-events-none'}`}> 
              <div className="w-full">
                <div className="relative">
                  <input
                    aria-label="Search materials"
                    placeholder="Search materials..."
                    className="w-full rounded-full border px-3 py-2 text-sm bg-white/90"
                  />
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                </div>
              </div>
            </div>

            {/* Mobile icons: all right-aligned, reduced gap */}
            <div className="flex items-center gap-1 md:gap-2 ml-auto">
              {/* Profile/Login */}
              {user ? (
                <Link href="/profile">
                  <Button variant="ghost" size="icon" className="md:hidden" aria-label="Profile">
                    <User className="w-5 h-5 text-darker" />
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost" size="icon" className="md:hidden" aria-label="Login">
                      <User className="w-5 h-5 text-darker" />
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button className="px-3 py-1 rounded text-xs font-semibold bg-primary text-primary-foreground md:hidden">
                      Login / Sign Up
                    </Button>
                  </Link>
                </>
              )}
              {/* Wishlist */}
              <Link href="/wishlist">
                <Button variant="ghost" size="icon" className="relative md:hidden hover-gold">
                  <Heart className="w-5 h-5 text-darker" />
                  {wishlistState.items.length > 0 && (
                    <Badge className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs rounded-full w-4 h-4 flex items-center justify-center p-0">
                      {wishlistState.items.length}
                    </Badge>
                  )}
                </Button>
              </Link>
              {/* Cart */}
              <Link href="/cart">
                <Button variant="ghost" size="icon" className="relative md:hidden hover-gold">
                  <ShoppingCart className="w-5 h-5 text-darker" />
                  {cartState.itemCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs rounded-full w-4 h-4 flex items-center justify-center p-0">
                      {cartState.itemCount}
                    </Badge>
                  )}
                </Button>
              </Link>
              {/* Theme toggle */}
              <Button variant="ghost" size="icon" className="md:hidden hover-gold" onClick={toggleTheme}>
                {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </Button>
              {/* Menu */}
              <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
              {/* Desktop icons remain unchanged below */}
              {/* ...existing code for desktop icons... */}
            </div>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header
      className={`bg-background border-b border-border/50 sticky top-0 z-50 backdrop-blur-sm transition-all duration-500 ease-in-out ${
        isScrolled
          ? "bg-background/95 shadow-xl -translate-y-2 scale-[0.98]"
          : "bg-background/90 translate-y-0 scale-100"
      } ${showNavbar ? "opacity-100 pointer-events-auto" : "-translate-y-full opacity-0 pointer-events-none"}`}
    >
      {/* Main Header */}
      <div className={`container mx-auto px-4 transition-all duration-500 ${isScrolled ? "py-2" : "py-4"}`}>
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <h1 className="text-2xl font-luxury font-bold text-primary text-darker">CraftMart</h1>
            <span className="ml-2 text-sm text-darker hidden sm:block">Interior Materials</span>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <HeaderSearchBar />
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="hover-gold">
              {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </Button>

            {/* Wishlist */}
            <Link href="/wishlist">
              <Button variant="ghost" size="icon" className="relative hover-gold">
                   <Heart className="w-5 h-5 text-darker" />
                {wishlistState.items.length > 0 && (
                  <Badge className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center p-0">
                    {wishlistState.items.length}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* Cart */}
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative hover-gold">
                   <ShoppingCart className="w-5 h-5 text-darker" />
                {cartState.itemCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center p-0">
                    {cartState.itemCount}
                  </Badge>
                )}
              </Button>
            </Link>

            <div className="flex items-center gap-2">
              {user ? (
                <Link href="/profile">
                  <Button variant="ghost" size="icon" className="md:hidden" aria-label="Profile">
                    <User className="w-5 h-5 text-darker" />
                  </Button>
                </Link>
              ) : (
                <Link href="/login">
                  <Button variant="ghost" size="icon" className="md:hidden" aria-label="Login">
                    <User className="w-5 h-5 text-darker" />
                  </Button>
                </Link>
              )}
              <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
              {/* Desktop profile icon/dropdown remains unchanged below */}
              {user ? (
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hidden md:flex"
                    onClick={() => setShowProfileDropdown((v) => !v)}
                    aria-label="Profile"
                  >
                    <User className="w-5 h-5 text-darker" />
                  </Button>
                  {showProfileDropdown && (
                    <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded shadow-lg z-50">
                      <div className="px-4 py-3 border-b">
                        <div className="font-semibold text-darker">{user.email}</div>
                      </div>
                      <Link href="/profile">
                        <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Profile</div>
                      </Link>
                      <button
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600 cursor-pointer"
                        onClick={() => { logout(); setShowProfileDropdown(false); }}
                      >
                        Log out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost" size="icon" className="hidden md:flex" aria-label="Login">
                      <User className="w-5 h-5 text-darker" />
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button className="px-4 py-2 rounded text-sm font-semibold bg-primary text-primary-foreground hidden md:flex">
                      Login / Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Categories Navigation - Desktop */}
        <nav
          className={`hidden md:flex items-center justify-center border-t border-border/30 transition-all duration-500 ${
            isScrolled ? "mt-2 py-1 opacity-60" : "mt-4 py-2 opacity-100"
          }`}
        >
          <div className="flex items-center gap-8">
            {categories.map((category) => {
              const categorySlug = category.name.toLowerCase().replace(/[^a-z0-9]/g, "-")
              return (
                <Link
                  key={category.name}
                  href={`/category/${categorySlug}`}
                  className="text-sm font-medium text-darker hover-gold hover:text-accent transition-colors"
                >
                  {category.name}
                </Link>
              )
            })}
            <Link
              href="/products"
              className="text-sm font-medium text-darker hover-gold hover:text-accent transition-colors"
            >
              All Products
            </Link>
          </div>
        </nav>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-background border-t border-border/50 animate-luxury-fade">
          <div className="container mx-auto px-4 py-4 space-y-4">
            {/* Mobile Search */}
            <HeaderSearchBar mobile />

            {/* Mobile Categories */}
            <nav className="space-y-2">
              {categories.map((category) => {
                const categorySlug = category.name.toLowerCase().replace(/[^a-z0-9]/g, "-")
                return (
                  <Link
                    key={category.name}
                    href={`/category/${categorySlug}`}
                    className="block py-2 text-muted-foreground hover:text-accent transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {category.name}
                  </Link>
                )
              })}
              <Link
                href="/products"
                className="block py-2 text-muted-foreground hover:text-accent transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                All Products
              </Link>
            </nav>

            {user ? (
              <div className="w-full">
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-full"
                  onClick={() => setShowProfileDropdown((v) => !v)}
                  aria-label="Profile"
                >
                  <User className="w-5 h-5" />
                </Button>
                {showProfileDropdown && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded shadow-lg z-50">
                    <div className="px-4 py-3 border-b">
                      <div className="font-semibold text-darker">{user.email}</div>
                    </div>
                    <Link href="/profile">
                      <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Profile</div>
                    </Link>
                    <button
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600 cursor-pointer"
                      onClick={() => { logout(); setShowProfileDropdown(false); }}
                    >
                      Log out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login">
                <Button variant="ghost" size="icon" className="w-full" aria-label="Login">
                  <User className="w-5 h-5" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
