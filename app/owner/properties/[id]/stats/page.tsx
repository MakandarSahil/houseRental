// src/app/owner/properties/[id]/stats/page.tsx
"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Calendar, DollarSign, Users, TrendingUp } from "lucide-react"
import { useAuth } from "@/context/authContext"
import { useProperty } from "@/services/property/useProperty"
import { useBooking } from "@/services/booking/useBooking"
import { OwnerRoute } from "@/components/auth/ProtectedRoute"
import { Property } from "@/types"
import { PropertyStats } from "@/components/property/PropertyStats"

export default function PropertyStatsPage() {
  const { id } = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const { getPropertyById, loading: propertyLoading, error: propertyError } = useProperty()
  const { getBookingsForOwner, bookings, loading: bookingsLoading } = useBooking()
  
  const [property, setProperty] = useState<Property | null>(null)

  useEffect(() => {
    if (user?.id && id) {
      loadProperty()
      getBookingsForOwner(user.id)
    }
  }, [user?.id, id])

  const loadProperty = async () => {
    try {
      const propertyData = await getPropertyById(id as string)
      setProperty(propertyData)
    } catch (error) {
      console.error("Failed to load property:", error)
    }
  }

  if (propertyLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (propertyError || !property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Property Not Found</h1>
          <Button onClick={() => router.push("/owner/dashboard")}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  return (
    <OwnerRoute>
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Button variant="outline" size="icon" onClick={() => router.push("/owner/dashboard")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">{property.title}</h1>
              <p className="text-muted-foreground">
                Statistics and performance metrics for your property
              </p>
            </div>
          </div>

          {/* Property Stats */}
          <div className="mb-8">
            <PropertyStats property={property} bookings={bookings} />
          </div>

          {/* Additional Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Bookings */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
                <CardDescription>Latest booking activities</CardDescription>
              </CardHeader>
              <CardContent>
                {bookingsLoading ? (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  </div>
                ) : bookings.filter(b => b.propertyId === property.id).length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No bookings yet</p>
                ) : (
                  <div className="space-y-3">
                    {bookings
                      .filter(b => b.propertyId === property.id)
                      .slice(0, 5)
                      .map(booking => (
                        <div key={booking.id} className="flex justify-between items-center p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">
                              {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                            </p>
                            <p className="text-sm text-muted-foreground capitalize">
                              {booking.status.toLowerCase()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">₹{property.rent}</p>
                            <p className="text-sm text-muted-foreground">
                              {booking.renter?.name || 'Unknown Guest'}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Property Information */}
            <Card>
              <CardHeader>
                <CardTitle>Property Details</CardTitle>
                <CardDescription>Basic information about your property</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <span className={`font-medium ${property.isAvailable ? 'text-green-600' : 'text-red-600'}`}>
                      {property.isAvailable ? 'Available' : 'Not Available'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Monthly Rent:</span>
                    <span className="font-medium">₹{property.rent.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Bedrooms:</span>
                    <span className="font-medium">{property.bedrooms}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Bathrooms:</span>
                    <span className="font-medium">{property.bathrooms}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Area:</span>
                    <span className="font-medium">{property.squareFeet} sq ft</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Location:</span>
                    <span className="font-medium text-right">
                      {property.city}, {property.state}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </OwnerRoute>
  )
}