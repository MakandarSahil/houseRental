"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { MapPin, Star, Users, Wifi, PenTool as Pool, Utensils, ArrowLeft } from "lucide-react"

export default function PropertyPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-primary">
            HomeStay
          </Link>
          <Button variant="outline">Logout</Button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/browse" className="flex items-center gap-2 text-primary mb-6 hover:opacity-80">
          <ArrowLeft className="w-4 h-4" />
          Back to Browse
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Property Images */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <img src="/luxury-apartment-interior.png" alt="Property" className="w-full h-96 object-cover rounded-lg" />
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8">
              {[1, 2, 3].map((i) => (
                <img
                  key={i}
                  src={`/apartment-room-.jpg?height=200&width=300&query=apartment room ${i}`}
                  alt={`Room ${i}`}
                  className="w-full h-32 object-cover rounded-lg cursor-pointer hover:opacity-80"
                />
              ))}
            </div>

            {/* Property Details */}
            <Card className="p-6 mb-8">
              <h1 className="text-3xl font-bold mb-2">Modern Downtown Apartment</h1>
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-primary" />
                <span className="text-lg text-muted-foreground">Downtown, City</span>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 fill-accent text-accent" />
                  <span className="font-semibold">4.8</span>
                  <span className="text-muted-foreground">(124 reviews)</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-8 pb-8 border-b border-border">
                <div>
                  <div className="text-sm text-muted-foreground">Bedrooms</div>
                  <div className="text-2xl font-bold">2</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Bathrooms</div>
                  <div className="text-2xl font-bold">2</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Guests</div>
                  <div className="text-2xl font-bold">4</div>
                </div>
              </div>

              <h3 className="text-xl font-semibold mb-4">About this property</h3>
              <p className="text-muted-foreground mb-6">
                Beautiful modern apartment in the heart of downtown. Perfect for business travelers or families. Fully
                equipped kitchen, comfortable bedrooms, and a stunning city view from the balcony.
              </p>

              <h3 className="text-xl font-semibold mb-4">Amenities</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Wifi, label: "WiFi" },
                  { icon: Utensils, label: "Kitchen" },
                  { icon: Pool, label: "AC" },
                  { icon: Users, label: "Living Room" },
                ].map((amenity, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <amenity.icon className="w-5 h-5 text-primary" />
                    <span>{amenity.label}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Reviews */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-6">Guest Reviews</h3>
              <div className="space-y-6">
                {[1, 2].map((i) => (
                  <div key={i} className="pb-6 border-b border-border last:border-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-semibold">John Doe</div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, j) => (
                          <Star key={j} className="w-4 h-4 fill-accent text-accent" />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Amazing property! Clean, comfortable, and great location. Highly recommended!
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <div className="mb-6">
                <div className="text-3xl font-bold text-primary mb-1">$120</div>
                <div className="text-sm text-muted-foreground">per night</div>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-sm font-semibold block mb-2">Check-in</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold block mb-2">Check-out</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold block mb-2">Guests</label>
                  <select className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                    <option>1 Guest</option>
                    <option>2 Guests</option>
                    <option>3 Guests</option>
                    <option>4 Guests</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2 mb-6 pb-6 border-b border-border">
                <div className="flex justify-between text-sm">
                  <span>$120 x 3 nights</span>
                  <span>$360</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Service fee</span>
                  <span>$36</span>
                </div>
                <div className="flex justify-between font-semibold text-lg pt-2">
                  <span>Total</span>
                  <span className="text-primary">$396</span>
                </div>
              </div>

              <Link href="/booking/1">
                <Button className="w-full bg-primary hover:bg-primary/90 mb-3">Continue to Booking</Button>
              </Link>
              <Button variant="outline" className="w-full bg-transparent">
                Save for Later
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
