// src/app/my-bookings/page.tsx
"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Calendar, MapPin, IndianRupee, Clock, CheckCircle, XCircle, AlertCircle, Home, User } from "lucide-react"
import { useBooking } from "@/services/booking/useBooking"
import { useAuth } from "@/context/authContext"

export default function MyBookingsPage() {
  const { user, logout, initialized, isAuthenticated } = useAuth()
  const { getBookingsByRenter, bookings, loading, error, cancelBooking } = useBooking()
  const [pageLoading, setPageLoading] = useState(true)

  useEffect(() => {
    if (initialized && isAuthenticated && user?.id) {
      loadBookings()
    } else if (initialized) {
      setPageLoading(false)
    }
  }, [user?.id, initialized, isAuthenticated])

  const loadBookings = async () => {
    try {
      // Make sure user.id is available and valid
      if (!user?.id) {
        console.error("User ID is not available")
        return
      }
      
      await getBookingsByRenter(user.id)
    } catch (error) {
      console.error("Failed to load bookings:", error)
    } finally {
      setPageLoading(false)
    }
  }

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return
    
    try {
      // Make sure user.id is available
      if (!user?.id) {
        alert("User information not available. Please try logging in again.")
        return
      }
      
      await cancelBooking(bookingId, user.id)
      alert("Booking cancelled successfully")
      // Reload bookings to reflect the updated status
      await loadBookings()
    } catch (error) {
      console.error("Failed to cancel booking:", error)
      alert("Failed to cancel booking. Please try again.")
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'PENDING':
        return <Clock className="w-5 h-5 text-yellow-600" />
      case 'REJECTED':
      case 'CANCELLED':
        return <XCircle className="w-5 h-5 text-red-600" />
      case 'COMPLETED':
        return <CheckCircle className="w-5 h-5 text-blue-600" />
      default:
        return <AlertCircle className="w-5 h-5 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return "bg-green-100 text-green-800"
      case 'PENDING':
        return "bg-yellow-100 text-yellow-800"
      case 'REJECTED':
      case 'CANCELLED':
        return "bg-red-100 text-red-800"
      case 'COMPLETED':
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return "Confirmed"
      case 'PENDING':
        return "Pending"
      case 'REJECTED':
        return "Rejected"
      case 'CANCELLED':
        return "Cancelled"
      case 'COMPLETED':
        return "Completed"
      default:
        return status
    }
  }

  const calculateDays = (startDate: string, endDate: string) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const timeDiff = end.getTime() - start.getTime()
    return Math.ceil(timeDiff / (1000 * 3600 * 24))
  }

  // Show loading while checking authentication
  if (!initialized || pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Show login prompt if not authenticated
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-background">
        {/* Navigation */}
        <nav className="sticky top-0 z-50 bg-background border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-primary">
              HomeStay
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/register">
                <Button className="bg-primary hover:bg-primary/90">Sign Up</Button>
              </Link>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
            <p className="text-muted-foreground mb-6">Please login to view your bookings</p>
            <div className="flex gap-4 justify-center">
              <Link href="/login">
                <Button>Login</Button>
              </Link>
              <Link href="/register">
                <Button variant="outline">Sign Up</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-primary">
            HomeStay
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" className="flex items-center gap-2">
                <Home className="w-4 h-4" />
                Home
              </Button>
            </Link>
            <Link href="/browse">
              <Button variant="ghost">Browse Properties</Button>
            </Link>
            <Button variant="outline" onClick={logout}>Logout</Button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link href="/" className="flex items-center gap-2 text-primary hover:opacity-80">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Bookings</h1>
          <p className="text-muted-foreground">Manage your property bookings</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-destructive">Error: {error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        )}

        {/* No Bookings State */}
        {!loading && bookings.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Bookings Yet</h3>
            <p className="text-muted-foreground mb-6">
              You haven't made any bookings yet. Start exploring properties!
            </p>
            <Link href="/browse">
              <Button>Browse Properties</Button>
            </Link>
          </div>
        )}

        {/* Bookings List */}
        {!loading && bookings.length > 0 && (
          <div className="space-y-6">
            {bookings.map((booking) => {
              const property = booking.property
              const days = calculateDays(booking.startDate, booking.endDate)
              
              return (
                <Card key={booking.id} className="p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Property Image */}
                    <div className="lg:w-48">
                      <img
                        src={property?.imageUrl || "/placeholder.svg"}
                        alt={property?.title || "Property"}
                        className="w-full h-32 lg:h-full object-cover rounded-lg"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg"
                        }}
                      />
                    </div>

                    {/* Booking Details */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-semibold mb-2">
                            {property?.title || "Property"}
                          </h3>
                          {property && (
                            <div className="flex items-center gap-1 text-muted-foreground mb-2">
                              <MapPin className="w-4 h-4" />
                              <span>{property.address}, {property.city}, {property.state}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(booking.status)}
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                            {getStatusText(booking.status)}
                          </span>
                        </div>
                      </div>

                      {/* Property Details */}
                      {property && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Bedrooms:</span>
                            <span className="font-medium ml-2">{property.bedrooms}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Bathrooms:</span>
                            <span className="font-medium ml-2">{property.bathrooms}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Area:</span>
                            <span className="font-medium ml-2">{property.squareFeet} sq ft</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Type:</span>
                            <span className="font-medium ml-2 capitalize">{property.propertyType?.toLowerCase()}</span>
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Check-in</p>
                          <p className="font-medium">
                            {new Date(booking.startDate).toLocaleDateString('en-IN', {
                              weekday: 'short',
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Check-out</p>
                          <p className="font-medium">
                            {new Date(booking.endDate).toLocaleDateString('en-IN', {
                              weekday: 'short',
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Duration</p>
                          <p className="font-medium">{days} day{days !== 1 ? 's' : ''}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Total Amount</p>
                          <p className="font-medium flex items-center gap-1">
                            <IndianRupee className="w-4 h-4" />
                            {booking.totalAmount?.toLocaleString('en-IN')}
                          </p>
                        </div>
                      </div>

                      {/* Owner Information */}
                      {property?.owner && (
                        <div className="mb-4 p-3 bg-muted rounded-lg">
                          <p className="text-sm text-muted-foreground mb-1">Property Owner</p>
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-muted-foreground" />
                            <span className="font-medium">{property.owner.name}</span>
                            <span className="text-muted-foreground text-sm">• {property.owner.phone}</span>
                          </div>
                        </div>
                      )}

                      {booking.message && (
                        <div className="mb-4">
                          <p className="text-sm text-muted-foreground">Your Message to Owner</p>
                          <p className="text-sm bg-blue-50 p-3 rounded-lg">{booking.message}</p>
                        </div>
                      )}

                      {/* Booking Date */}
                      <div className="mb-4">
                        <p className="text-sm text-muted-foreground">Booking Request Date</p>
                        <p className="text-sm">
                          {new Date(booking.createdAt).toLocaleDateString('en-IN', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap gap-2">
                        {property && (
                          <Link href={`/property/${property.id}`}>
                            <Button variant="outline" size="sm">
                              View Property
                            </Button>
                          </Link>
                        )}
                        {(booking.status === 'PENDING' || booking.status === 'APPROVED') && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleCancelBooking(booking.id)}
                            className="text-red-600 border-red-200 hover:bg-red-50"
                          >
                            Cancel Booking
                          </Button>
                        )}
                        {booking.status === 'PENDING' && (
                          <div className="flex-1">
                            <p className="text-sm text-yellow-600 bg-yellow-50 p-2 rounded text-center">
                              ⏳ Waiting for owner approval
                            </p>
                          </div>
                        )}
                        {booking.status === 'APPROVED' && (
                          <div className="flex-1">
                            <p className="text-sm text-green-600 bg-green-50 p-2 rounded text-center">
                              ✅ Booking confirmed! Contact owner for next steps
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}