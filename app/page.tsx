// src/app/page.tsx
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { MapPin, Users, Star, Search, User, Calendar } from "lucide-react"
import { useAuth } from "@/context/authContext"
import { useProperty } from "@/services/property/useProperty"
import { useRouter } from "next/navigation"

export default function Home() {
  const { user, logout } = useAuth()
  const { searchByCity, loading } = useProperty()
  const router = useRouter()
  
  const [searchData, setSearchData] = useState({
    city: "",
    checkIn: "",
    checkOut: ""
  })
  const [searchError, setSearchError] = useState("")

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!searchData.city.trim()) {
      setSearchError("Please enter a city name")
      return
    }

    setSearchError("")
    
    try {
      await searchByCity(searchData.city)
      // Navigate to browse page with search parameters
      const params = new URLSearchParams()
      params.append('city', searchData.city)
      if (searchData.checkIn) params.append('checkIn', searchData.checkIn)
      if (searchData.checkOut) params.append('checkOut', searchData.checkOut)
      
      router.push(`/browse?${params.toString()}`)
    } catch (error) {
      console.error("Search failed:", error)
      setSearchError("Failed to search properties. Please try again.")
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setSearchData(prev => ({
      ...prev,
      [field]: value
    }))
    if (searchError) setSearchError("")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold text-primary">HomeStay</div>
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <Link href="/my-bookings">
                  <Button variant="ghost" className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    My Bookings
                  </Button>
                </Link>
                <div className="flex items-center gap-2 text-sm">
                  <User className="w-4 h-4" />
                  <span>Hello, {user.name}</span>
                </div>
                <Button variant="outline" onClick={logout}>Logout</Button>
              </div>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-primary hover:bg-primary/90">Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 to-accent/10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-foreground mb-4">Find Your Perfect Home</h1>
            <p className="text-xl text-muted-foreground mb-8">Discover amazing properties and book your next stay</p>
          </div>

          {/* Search Bar */}
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
            <form onSubmit={handleSearch}>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Enter city name..."
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    value={searchData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                  />
                </div>
                <div className="flex gap-4">
                  <input
                    type="date"
                    placeholder="Check-in"
                    className="px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    value={searchData.checkIn}
                    onChange={(e) => handleInputChange("checkIn", e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                  <input
                    type="date"
                    placeholder="Check-out"
                    className="px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    value={searchData.checkOut}
                    onChange={(e) => handleInputChange("checkOut", e.target.value)}
                    min={searchData.checkIn || new Date().toISOString().split('T')[0]}
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full sm:w-auto bg-primary hover:bg-primary/90 flex items-center gap-2"
                  disabled={loading}
                >
                  <Search className="w-4 h-4" />
                  {loading ? "Searching..." : "Search"}
                </Button>
              </div>
              {searchError && (
                <p className="text-destructive text-sm mt-2">{searchError}</p>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose HomeStay?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: MapPin,
                title: "Verified Properties",
                description: "All properties are verified and reviewed by our team",
              },
              {
                icon: Users,
                title: "Trusted Hosts",
                description: "Connect with reliable property owners and renters",
              },
              {
                icon: Star,
                title: "Best Prices",
                description: "Competitive rates and transparent pricing",
              },
            ].map((feature, i) => (
              <Card key={i} className="p-6 text-center hover:shadow-lg transition-shadow">
                <feature.icon className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Find Your Home?</h2>
          <p className="text-lg mb-8 opacity-90">Join thousands of happy renters and hosts</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/browse">
              <Button variant="secondary" className="w-full sm:w-auto">
                Browse Properties
              </Button>
            </Link>
            {!user && (
              <Link href="/register?role=owner">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10 bg-transparent"
                >
                  List Your Property
                </Button>
              </Link>
            )}
            {user?.role === 'OWNER' && (
              <Link href="/owner/dashboard">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10 bg-transparent"
                >
                  Owner Dashboard
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}