"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Heart, MapPin, Star, Users, Wind } from "lucide-react"

const SAMPLE_HOUSES = [
  {
    id: 1,
    title: "Modern Downtown Apartment",
    location: "Downtown, City",
    price: 120,
    rating: 4.8,
    reviews: 124,
    image: "/modern-apartment-downtown.jpg",
    beds: 2,
    baths: 2,
    amenities: ["WiFi", "AC", "Kitchen"],
  },
  {
    id: 2,
    title: "Cozy Beach House",
    location: "Beach Area, City",
    price: 150,
    rating: 4.9,
    reviews: 89,
    image: "/secluded-beach-house.png",
    beds: 3,
    baths: 2,
    amenities: ["WiFi", "Pool", "Beach Access"],
  },
  {
    id: 3,
    title: "Luxury Villa",
    location: "Suburbs, City",
    price: 250,
    rating: 5.0,
    reviews: 45,
    image: "/luxury-villa.png",
    beds: 4,
    baths: 3,
    amenities: ["WiFi", "Pool", "Garden"],
  },
  {
    id: 4,
    title: "Studio Apartment",
    location: "City Center, City",
    price: 80,
    rating: 4.6,
    reviews: 156,
    image: "/cozy-studio-apartment.png",
    beds: 1,
    baths: 1,
    amenities: ["WiFi", "Kitchen"],
  },
  {
    id: 5,
    title: "Family Home",
    location: "Residential Area, City",
    price: 180,
    rating: 4.7,
    reviews: 92,
    image: "/cozy-family-home.png",
    beds: 3,
    baths: 2,
    amenities: ["WiFi", "Yard", "Garage"],
  },
  {
    id: 6,
    title: "Penthouse Suite",
    location: "Downtown, City",
    price: 300,
    rating: 4.9,
    reviews: 67,
    image: "/luxurious-city-penthouse.png",
    beds: 2,
    baths: 2,
    amenities: ["WiFi", "Gym", "Rooftop"],
  },
]

export default function BrowsePage() {
  const [priceRange, setPriceRange] = useState(300)
  const [selectedBeds, setSelectedBeds] = useState<number | null>(null)

  const filteredHouses = SAMPLE_HOUSES.filter((house) => {
    if (selectedBeds && house.beds !== selectedBeds) return false
    if (house.price > priceRange) return false
    return true
  })

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-primary">
            HomeStay
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/owner/dashboard">
              <Button variant="ghost">Owner Dashboard</Button>
            </Link>
            <Link href="/admin/dashboard">
              <Button variant="ghost">Admin</Button>
            </Link>
            <Button variant="outline">Logout</Button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <h3 className="text-lg font-semibold mb-6">Filters</h3>

              <div className="space-y-6">
                {/* Price Range */}
                <div>
                  <Label className="mb-3 block">Price per Night</Label>
                  <input
                    type="range"
                    min="50"
                    max="500"
                    value={priceRange}
                    onChange={(e) => setPriceRange(Number(e.target.value))}
                    className="w-full"
                  />
                  <p className="text-sm text-muted-foreground mt-2">Up to ${priceRange}</p>
                </div>

                {/* Bedrooms */}
                <div>
                  <Label className="mb-3 block">Bedrooms</Label>
                  <div className="space-y-2">
                    {[1, 2, 3, 4].map((beds) => (
                      <button
                        key={beds}
                        onClick={() => setSelectedBeds(selectedBeds === beds ? null : beds)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                          selectedBeds === beds ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
                        }`}
                      >
                        {beds} Bedroom{beds > 1 ? "s" : ""}
                      </button>
                    ))}
                  </div>
                </div>

                <Button className="w-full bg-primary hover:bg-primary/90">Apply Filters</Button>
              </div>
            </Card>
          </div>

          {/* Properties Grid */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <h2 className="text-2xl font-bold">Available Properties</h2>
              <p className="text-muted-foreground">{filteredHouses.length} properties found</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredHouses.map((house) => (
                <Link key={house.id} href={`/property/${house.id}`}>
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
                    <div className="relative">
                      <img
                        src={house.image || "/placeholder.svg"}
                        alt={house.title}
                        className="w-full h-48 object-cover"
                      />
                      <button className="absolute top-3 right-3 bg-white rounded-full p-2 hover:bg-gray-100">
                        <Heart className="w-5 h-5 text-accent" />
                      </button>
                    </div>

                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-1">{house.title}</h3>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                        <MapPin className="w-4 h-4" />
                        {house.location}
                      </div>

                      <div className="flex items-center gap-2 mb-3">
                        <Star className="w-4 h-4 fill-accent text-accent" />
                        <span className="font-semibold">{house.rating}</span>
                        <span className="text-sm text-muted-foreground">({house.reviews})</span>
                      </div>

                      <div className="flex items-center gap-4 text-sm mb-3 text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {house.beds} beds
                        </div>
                        <div className="flex items-center gap-1">
                          <Wind className="w-4 h-4" />
                          {house.baths} baths
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-2xl font-bold text-primary">${house.price}</span>
                          <span className="text-sm text-muted-foreground">/night</span>
                        </div>
                        <Button size="sm" className="bg-primary hover:bg-primary/90">
                          View
                        </Button>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
