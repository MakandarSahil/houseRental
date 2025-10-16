// src/app/owner/dashboard/page.tsx (Updated)
"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Home, Calendar, DollarSign, Users, Plus } from "lucide-react"
import { PropertyCard } from "@/components/property-card"
import { BookingTable } from "@/components/booking-table"
import { Property, Booking, DashboardStat } from "@/types"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/authContext"
import { useProperty } from "@/services/property/useProperty"
import { useBooking } from "@/services/booking/useBooking"
import { OwnerRoute } from "@/components/auth/ProtectedRoute"
import { DashboardStats } from "@/components/dasboard-stats"
import { AddPropertyModal, PropertyFormData } from "@/components/property/AddPropertyModal"
import { EditPropertyModal } from "@/components/property/EditPropertyModal"

export default function OwnerDashboard() {
  const { user, logout } = useAuth()
  const { 
    properties, 
    loading: propertiesLoading, 
    error: propertiesError,
    getPropertiesByOwner,
    deleteProperty,
    createProperty,
    updateProperty 
  } = useProperty()
  
  const { 
    bookings, 
    loading: bookingsLoading, 
    error: bookingsError,
    getBookingsForOwner,
    updateBookingStatus 
  } = useBooking()
  
  const [activeTab, setActiveTab] = useState("properties")
  const [isAddPropertyModalOpen, setIsAddPropertyModalOpen] = useState(false)
  const [isEditPropertyModalOpen, setIsEditPropertyModalOpen] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [addingProperty, setAddingProperty] = useState(false)
  const [updatingProperty, setUpdatingProperty] = useState(false)
  const router = useRouter()

  // Fetch owner data - only when user is available and is owner
  useEffect(() => {
    if (user?.id && user.role === 'OWNER') {
      getPropertiesByOwner(user.id)
      getBookingsForOwner(user.id)
    }
  }, [user?.id, user?.role])

  const handleAddProperty = async (propertyData: PropertyFormData) => {
    if (!user?.id) return
    
    setAddingProperty(true)
    try {
      await createProperty(propertyData, user.id)
      // Refresh the properties list
      await getPropertiesByOwner(user.id)
    } catch (error) {
      console.error("Failed to add property:", error)
      throw error
    } finally {
      setAddingProperty(false)
    }
  }

  const handleEditProperty = (propertyId: string) => {
    const property = properties.find(p => p.id === propertyId)
    if (property) {
      setSelectedProperty(property)
      setIsEditPropertyModalOpen(true)
    }
  }

  const handleUpdateProperty = async (propertyId: string, propertyData: Partial<PropertyFormData>) => {
    if (!user?.id) return
    
    setUpdatingProperty(true)
    try {
      await updateProperty(propertyId, propertyData, user.id)
      // Refresh the properties list
      await getPropertiesByOwner(user.id)
    } catch (error) {
      console.error("Failed to update property:", error)
      throw error
    } finally {
      setUpdatingProperty(false)
    }
  }

  const handleDeleteProperty = async (propertyId: string) => {
    if (!user?.id) return
    
    if (confirm("Are you sure you want to delete this property? This action cannot be undone.")) {
      try {
        await deleteProperty(propertyId, user.id)
      } catch (error) {
        console.error("Failed to delete property:", error)
        alert("Failed to delete property. Please try again.")
      }
    }
  }

  const handleConfirmBooking = async (bookingId: string) => {
  try {
    await updateBookingStatus(bookingId, "APPROVED", user!.id)
  } catch (error) {
    console.error("Failed to confirm booking:", error)
  }
}

const handleRejectBooking = async (bookingId: string) => {
  try {
    await updateBookingStatus(bookingId, "REJECTED", user!.id)
  } catch (error) {
    console.error("Failed to reject booking:", error)
  }
}

  const handleMessageGuest = (bookingId: string) => {
    console.log("Message guest for booking:", bookingId)
  }

  const handleViewStats = (propertyId: string) => {
    router.push(`/owner/properties/${propertyId}/stats`)
  }

  const handleLogout = () => {
    logout()
  }

  // Calculate dashboard stats from actual data
  const calculateStats = (): DashboardStat[] => {
    const totalProperties = properties.length
    const totalBookings = bookings.length
    const totalRevenue = bookings
      .filter(booking => booking.status === 'APPROVED')
      .reduce((sum, booking) => {
        const property = properties.find(p => p.id === booking.propertyId)
        if (property) {
          const start = new Date(booking.startDate)
          const end = new Date(booking.endDate)
          const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
          return sum + (property.rent * days)
        }
        return sum
      }, 0)
    
    const totalGuests = new Set(bookings.map(booking => booking.renterId)).size

    return [
      {
        icon: <Home className="w-8 h-8" />,
        label: "Properties",
        value: totalProperties.toString(),
        change: "+0 this month",
        color: "text-primary",
      },
      {
        icon: <Calendar className="w-8 h-8" />,
        label: "Total Bookings",
        value: totalBookings.toString(),
        change: "+0 this month",
        color: "text-accent",
      },
      {
        icon: <DollarSign className="w-8 h-8" />,
        label: "Total Revenue",
        value: `₹${totalRevenue.toLocaleString()}`,
        change: "+0% this month",
        color: "text-green-600",
      },
      {
        icon: <Users className="w-8 h-8" />,
        label: "Total Guests",
        value: totalGuests.toString(),
        change: "+0 this month",
        color: "text-blue-600",
      },
    ]
  }

  const stats = calculateStats()

  return (
    <OwnerRoute>
      <div className="min-h-screen bg-background">
        {/* Navigation */}
        <nav className="sticky top-0 z-50 bg-background border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-primary">
              HomeStay
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/browse">
                <Button variant="ghost">Browse</Button>
              </Link>
              <Button variant="outline" onClick={handleLogout}>Logout</Button>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Owner Dashboard</h1>
            <p className="text-muted-foreground">Manage your properties and bookings</p>
          </div>

          {/* Stats */}
          <div className="mb-8">
            <DashboardStats 
              stats={stats} 
              loading={propertiesLoading || bookingsLoading} 
            />
          </div>

          {/* Error Messages */}
          {propertiesError && (
            <div className="mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-destructive">Properties Error: {propertiesError}</p>
            </div>
          )}
          
          {bookingsError && (
            <div className="mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-destructive">Bookings Error: {bookingsError}</p>
            </div>
          )}

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="properties">My Properties</TabsTrigger>
              <TabsTrigger value="bookings">Bookings</TabsTrigger>
            </TabsList>

            {/* Properties Tab */}
            <TabsContent value="properties" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Your Properties</h2>
                <Button 
                  className="bg-primary hover:bg-primary/90" 
                  onClick={() => setIsAddPropertyModalOpen(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Property
                </Button>
              </div>

              {propertiesLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : properties.length === 0 ? (
                <div className="text-center py-12">
                  <Home className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Properties Yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Start by adding your first property to rent out.
                  </p>
                  <Button onClick={() => setIsAddPropertyModalOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Property
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {properties.map((property) => (
                    <PropertyCard
                      key={property.id}
                      id={property.id}
                      title={property.title}
                      location={`${property.city}, ${property.state}`}
                      price={property.rent}
                      bookings={bookings.filter(b => b.propertyId === property.id).length}
                      revenue={bookings
                        .filter(b => b.propertyId === property.id && b.status === 'APPROVED')
                        .reduce((sum, booking) => {
                          const start = new Date(booking.startDate)
                          const end = new Date(booking.endDate)
                          const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
                          return sum + (property.rent * days)
                        }, 0)}
                      status={property.isAvailable ? "Active" as const : "Inactive" as const}
                      imageUrl={property.imageUrl}
                      onEdit={handleEditProperty}
                      onDelete={handleDeleteProperty}
                      onViewStats={handleViewStats}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Bookings Tab */}
            <TabsContent value="bookings" className="space-y-6">
              <h2 className="text-2xl font-bold">Recent Bookings</h2>

              {bookingsLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : bookings.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Bookings Yet</h3>
                  <p className="text-muted-foreground">
                    When guests book your properties, they'll appear here.
                  </p>
                </div>
              ) : (
                <BookingTable 
                  bookings={bookings.map(booking => ({
                    id: booking.id,
                    property: properties.find(p => p.id === booking.propertyId)?.title || 'Unknown Property',
                    guest: booking.renter?.name || 'Unknown Guest',
                    checkIn: new Date(booking.startDate).toLocaleDateString(),
                    checkOut: new Date(booking.endDate).toLocaleDateString(),
                    amount: properties.find(p => p.id === booking.propertyId)?.rent || 0,
                    status: mapBookingStatus(booking.status),
                  }))} 
                  onMessage={handleMessageGuest}
                  onConfirm={handleConfirmBooking}
                  onReject={handleRejectBooking}
                />
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Add Property Modal */}
        <AddPropertyModal
          isOpen={isAddPropertyModalOpen}
          onClose={() => setIsAddPropertyModalOpen(false)}
          onAddProperty={handleAddProperty}
          loading={addingProperty}
        />

        {/* Edit Property Modal */}
        <EditPropertyModal
          isOpen={isEditPropertyModalOpen}
          onClose={() => {
            setIsEditPropertyModalOpen(false)
            setSelectedProperty(null)
          }}
          onUpdateProperty={handleUpdateProperty}
          property={selectedProperty}
          loading={updatingProperty}
        />
      </div>
    </OwnerRoute>
  )
}

// Helper function to map API booking status to UI status
function mapBookingStatus(status: string): "Pending" | "Confirmed" | "Cancelled" | "Completed" {
  switch (status) {
    case 'PENDING':
      return 'Pending'
    case 'APPROVED':
      return 'Confirmed'
    case 'REJECTED':
      return 'Cancelled'
    case 'CANCELLED':
      return 'Cancelled'
    case 'COMPLETED':
      return 'Completed'
    default:
      return 'Pending'
  }
}

function mapToApiStatus(status: "Pending" | "Confirmed" | "Cancelled" | "Completed"): string {
  switch (status) {
    case 'Pending':
      return 'PENDING'
    case 'Confirmed':
      return 'APPROVED'
    case 'Cancelled':
      return 'REJECTED' // or 'CANCELLED' depending on your backend
    case 'Completed':
      return 'COMPLETED'
    default:
      return 'PENDING'
  }
}