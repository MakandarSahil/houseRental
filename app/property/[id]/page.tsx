// src/app/property/[id]/page.tsx
"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { MapPin, ArrowLeft, Bed, Bath, Square, Calendar, IndianRupee } from "lucide-react"
import { useProperty } from "@/services/property/useProperty"
import { useAuth } from "@/context/authContext"
import { useBooking } from "@/services/booking/useBooking"
import { Property } from "@/types"

export default function PropertyPage({ params }: { params: { id: string } }) {
  const { id } = useParams()
  const router = useRouter()
  const { user, logout } = useAuth()
  const { getPropertyById, loading, error } = useProperty()
  const { createBooking, loading: bookingLoading } = useBooking()
  
  const [property, setProperty] = useState<Property | null>(null)
  const [bookingData, setBookingData] = useState({
    startDate: "",
    endDate: "",
    message: ""
  })
  const [bookingError, setBookingError] = useState<string | null>(null)
  const [bookingSuccess, setBookingSuccess] = useState(false)

  useEffect(() => {
    if (id) {
      loadProperty()
    }
  }, [id])

  const loadProperty = async () => {
    try {
      const propertyData = await getPropertyById(id as string)
      setProperty(propertyData)
    } catch (error) {
      console.error("Failed to load property:", error)
    }
  }

  const handleBookNow = async () => {
    if (!user) {
      router.push("/login")
      return
    }

    if (!bookingData.startDate || !bookingData.endDate) {
      setBookingError("Please select check-in and check-out dates")
      return
    }

    const startDate = new Date(bookingData.startDate)
    const endDate = new Date(bookingData.endDate)
    
    if (endDate <= startDate) {
      setBookingError("Check-out date must be after check-in date")
      return
    }

    setBookingError(null)

    try {
      // Prepare booking data according to backend expectations
      const bookingPayload = {
        startDate: bookingData.startDate,
        endDate: bookingData.endDate,
        message: bookingData.message || `Booking request for ${property?.title}`
      }

      await createBooking(bookingPayload, user.id, property!.id)
      setBookingSuccess(true)
      
      // Redirect to dashboard after successful booking
      setTimeout(() => {
        router.push("/browse")
      }, 2000)
      
    } catch (error: any) {
      console.error("Failed to create booking:", error)
      setBookingError(error.error || "Failed to create booking. Please try again.")
    }
  }

  const calculateTotal = () => {
    if (!bookingData.startDate || !bookingData.endDate || !property) return 0
    
    const start = new Date(bookingData.startDate)
    const end = new Date(bookingData.endDate)
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    
    // Calculate months for monthly rent (minimum 1 month)
    const months = Math.max(1, Math.ceil(days / 30))
    
    return property.rent * months
  }

  const getDaysBetweenDates = () => {
    if (!bookingData.startDate || !bookingData.endDate) return 0
    const start = new Date(bookingData.startDate)
    const end = new Date(bookingData.endDate)
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  }

  const getMonthsBetweenDates = () => {
    const days = getDaysBetweenDates()
    return Math.max(1, Math.ceil(days / 30))
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error || !property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Property Not Found</h1>
          <p className="text-muted-foreground mb-6">The property you're looking for doesn't exist.</p>
          <Button onClick={() => router.push("/browse")}>
            Back to Browse
          </Button>
        </div>
      </div>
    )
  }

  const totalAmount = calculateTotal()
  const days = getDaysBetweenDates()
  const months = getMonthsBetweenDates()

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-primary">
            HomeStay
          </Link>
          <div className="flex items-center gap-4">
            {user ? (
              <Button variant="outline" onClick={logout}>Logout</Button>
            ) : (
              <Link href="/login">
                <Button variant="outline">Login</Button>
              </Link>
            )}
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/browse" className="flex items-center gap-2 text-primary mb-6 hover:opacity-80">
          <ArrowLeft className="w-4 h-4" />
          Back to Browse
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Property Images and Details */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <img 
                src={property.imageUrl || "/placeholder.svg"} 
                alt={property.title}
                className="w-full h-96 object-cover rounded-lg"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.svg"
                }}
              />
            </div>

            {/* Property Details */}
            <Card className="p-6 mb-8">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="w-5 h-5 text-primary" />
                    <span className="text-lg text-muted-foreground">
                      {property.address}, {property.city}, {property.state}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary flex items-center gap-1">
                    <IndianRupee className="w-5 h-5" />
                    {property.rent.toLocaleString('en-IN')}
                  </div>
                  <div className="text-sm text-muted-foreground">per month</div>
                </div>
              </div>

              {!property.isAvailable && (
                <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <p className="text-destructive font-semibold">This property is currently not available for booking</p>
                </div>
              )}

              <div className="grid grid-cols-3 gap-4 mb-8 pb-8 border-b border-border">
                <div className="flex items-center gap-3">
                  <Bed className="w-6 h-6 text-primary" />
                  <div>
                    <div className="text-sm text-muted-foreground">Bedrooms</div>
                    <div className="text-xl font-bold">{property.bedrooms}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Bath className="w-6 h-6 text-primary" />
                  <div>
                    <div className="text-sm text-muted-foreground">Bathrooms</div>
                    <div className="text-xl font-bold">{property.bathrooms}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Square className="w-6 h-6 text-primary" />
                  <div>
                    <div className="text-sm text-muted-foreground">Area</div>
                    <div className="text-xl font-bold">{property.squareFeet} sq ft</div>
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-semibold mb-4">About this property</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed text-lg">
                {property.description}
              </p>
            </Card>

            {/* Property Specifications */}
            <Card className="p-6 mb-8">
              <h3 className="text-xl font-semibold mb-4">Property Specifications</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Property Type</span>
                  <span className="font-medium capitalize">{property.propertyType}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Monthly Rent</span>
                  <span className="font-medium flex items-center gap-1">
                    <IndianRupee className="w-4 h-4" />
                    {property.rent.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">City</span>
                  <span className="font-medium">{property.city}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">State</span>
                  <span className="font-medium">{property.state}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Available From</span>
                  <span className="font-medium">Immediately</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Minimum Stay</span>
                  <span className="font-medium">1 Month</span>
                </div>
              </div>
            </Card>

            {/* Owner Information */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Owner Information</h3>
              <div className="bg-muted p-4 rounded-lg">
                <p className="font-medium text-lg">{property.owner?.name || 'Property Owner'}</p>
                <p className="text-muted-foreground">{property.owner?.email}</p>
                {property.owner?.phone && (
                  <p className="text-muted-foreground">{property.owner.phone}</p>
                )}
                <p className="text-sm text-muted-foreground mt-2">
                  Contact the owner for any questions about this property
                </p>
              </div>
            </Card>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              {bookingSuccess ? (
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                    <Calendar className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-green-600">Booking Request Sent!</h3>
                  <p className="text-muted-foreground mb-4">
                    Your booking request has been submitted successfully. The property owner will review your request and get back to you soon.
                  </p>
                  <div className="bg-green-50 p-4 rounded-lg mb-4">
                    <p className="text-sm text-green-700">
                      <strong>Next Steps:</strong>
                    </p>
                    <ul className="text-sm text-green-700 mt-2 space-y-1">
                      <li>• Owner will review your request</li>
                      <li>• You'll receive a confirmation email</li>
                      <li>• Payment will be arranged after approval</li>
                    </ul>
                  </div>
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={() => router.push("/dashboard")}
                  >
                    Go to Dashboard
                  </Button>
                </div>
              ) : (
                <>
                  <div className="mb-6">
                    <div className="text-3xl font-bold text-primary mb-1 flex items-center gap-1">
                      <IndianRupee className="w-6 h-6" />
                      {property.rent.toLocaleString('en-IN')}
                    </div>
                    <div className="text-sm text-muted-foreground">per month</div>
                  </div>

                  {property.isAvailable ? (
                    <>
                      {bookingError && (
                        <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                          <p className="text-destructive text-sm">{bookingError}</p>
                        </div>
                      )}

                      <div className="space-y-4 mb-6">
                        <div>
                          <label className="text-sm font-semibold block mb-2">Check-in Date</label>
                          <input
                            type="date"
                            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            value={bookingData.startDate}
                            onChange={(e) => {
                              setBookingData(prev => ({
                                ...prev,
                                startDate: e.target.value
                              }))
                              setBookingError(null)
                            }}
                            min={new Date().toISOString().split('T')[0]}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-semibold block mb-2">Check-out Date</label>
                          <input
                            type="date"
                            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            value={bookingData.endDate}
                            onChange={(e) => {
                              setBookingData(prev => ({
                                ...prev,
                                endDate: e.target.value
                              }))
                              setBookingError(null)
                            }}
                            min={bookingData.startDate || new Date().toISOString().split('T')[0]}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-semibold block mb-2">Message to Owner (Optional)</label>
                          <textarea
                            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                            rows={3}
                            placeholder="Tell the owner about your stay requirements..."
                            value={bookingData.message}
                            onChange={(e) => setBookingData(prev => ({
                              ...prev,
                              message: e.target.value
                            }))}
                          />
                        </div>
                      </div>

                      {days > 0 && (
                        <div className="space-y-2 mb-6 pb-6 border-b border-border">
                          <div className="flex justify-between text-sm">
                            <span>Monthly Rent</span>
                            <span className="flex items-center gap-1">
                              <IndianRupee className="w-3 h-3" />
                              {property.rent.toLocaleString('en-IN')}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Duration</span>
                            <span>{months} month{months > 1 ? 's' : ''} ({days} days)</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Estimated Total</span>
                            <span className="flex items-center gap-1">
                              <IndianRupee className="w-3 h-3" />
                              {totalAmount.toLocaleString('en-IN')}
                            </span>
                          </div>
                          <div className="flex justify-between font-semibold text-lg pt-2 border-t border-border">
                            <span>Total Amount</span>
                            <span className="text-primary flex items-center gap-1">
                              <IndianRupee className="w-4 h-4" />
                              {totalAmount.toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>
                      )}

                      <Button 
                        className="w-full bg-primary hover:bg-primary/90 mb-3"
                        onClick={handleBookNow}
                        disabled={!bookingData.startDate || !bookingData.endDate || bookingLoading}
                      >
                        <Calendar className="w-4 h-4 mr-2" />
                        {bookingLoading ? "Submitting..." : user ? "Request to Book" : "Login to Book"}
                      </Button>
                      
                      <p className="text-xs text-muted-foreground text-center">
                        This is a booking request. The owner will confirm availability and contact you for payment details.
                      </p>
                    </>
                  ) : (
                    <div className="text-center p-6 bg-muted rounded-lg">
                      <div className="w-12 h-12 mx-auto mb-4 bg-destructive/10 rounded-full flex items-center justify-center">
                        <span className="text-destructive font-bold text-lg">!</span>
                      </div>
                      <p className="font-semibold text-destructive mb-2">Not Available</p>
                      <p className="text-sm text-muted-foreground">
                        This property is currently not available for booking. Please check back later or browse other properties.
                      </p>
                    </div>
                  )}
                </>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}