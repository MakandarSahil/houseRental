"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Home, Calendar, DollarSign, Users, Plus } from "lucide-react"
import { PropertyCard } from "@/components/property-card"
import { BookingTable } from "@/components/booking-table"
import { DashboardStats } from "@/components/dasboard-stats"
import { useState } from "react"

const OWNER_PROPERTIES = [
  {
    id: 1,
    title: "Modern Downtown Apartment",
    location: "Downtown, City",
    price: 120,
    bookings: 24,
    revenue: 2880,
    status: "Active" as const,
  },
  {
    id: 2,
    title: "Cozy Beach House",
    location: "Beach Area, City",
    price: 150,
    bookings: 18,
    revenue: 2700,
    status: "Active" as const,
  },
]

const OWNER_BOOKINGS = [
  {
    id: 1,
    property: "Modern Downtown Apartment",
    guest: "John Doe",
    checkIn: "May 30, 2025",
    checkOut: "June 2, 2025",
    amount: 426,
    status: "Confirmed" as const,
  },
  {
    id: 2,
    property: "Cozy Beach House",
    guest: "Jane Smith",
    checkIn: "June 5, 2025",
    checkOut: "June 10, 2025",
    amount: 825,
    status: "Pending" as const,
  },
  {
    id: 3,
    property: "Modern Downtown Apartment",
    guest: "Bob Johnson",
    checkIn: "June 15, 2025",
    checkOut: "June 18, 2025",
    amount: 426,
    status: "Confirmed" as const,
  },
]

export default function OwnerDashboard() {
  const [bookings, setBookings] = useState(OWNER_BOOKINGS)

  const handleConfirmBooking = (bookingId: number) => {
    setBookings(bookings.map((b) => (b.id === bookingId ? { ...b, status: "Confirmed" as const } : b)))
  }

  const handleMessageGuest = (bookingId: number) => {
    console.log("Message guest for booking:", bookingId)
    // In production, this would open a messaging interface
  }

  const handleEditProperty = (propertyId: number) => {
    console.log("Edit property:", propertyId)
    // In production, this would navigate to edit page
  }

  const handleDeleteProperty = (propertyId: number) => {
    console.log("Delete property:", propertyId)
    // In production, this would show a confirmation dialog
  }

  const handleViewStats = (propertyId: number) => {
    console.log("View stats for property:", propertyId)
    // In production, this would navigate to stats page
  }

  const stats = [
    {
      icon: <Home className="w-8 h-8" />,
      label: "Properties",
      value: "2",
      change: "+1 this month",
      color: "text-primary",
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      label: "Total Bookings",
      value: "42",
      change: "+8 this month",
      color: "text-accent",
    },
    {
      icon: <DollarSign className="w-8 h-8" />,
      label: "Total Revenue",
      value: "$5,580",
      change: "+12% this month",
      color: "text-green-600",
    },
    {
      icon: <Users className="w-8 h-8" />,
      label: "Total Guests",
      value: "38",
      change: "+5 this month",
      color: "text-blue-600",
    },
  ]

  return (
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
            <Button variant="outline">Logout</Button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Owner Dashboard</h1>
          <p className="text-muted-foreground">Manage your properties and bookings</p>
        </div>

        <div className="mb-8">
          <DashboardStats stats={stats} />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="properties" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="properties">My Properties</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
          </TabsList>

          {/* Properties Tab */}
          <TabsContent value="properties" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Your Properties</h2>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                Add Property
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {OWNER_PROPERTIES.map((property) => (
                <PropertyCard
                  key={property.id}
                  {...property}
                  onEdit={handleEditProperty}
                  onDelete={handleDeleteProperty}
                  onViewStats={handleViewStats}
                />
              ))}
            </div>
          </TabsContent>

          {/* Bookings Tab */}
          <TabsContent value="bookings" className="space-y-6">
            <h2 className="text-2xl font-bold">Recent Bookings</h2>

            <BookingTable bookings={bookings} onMessage={handleMessageGuest} onConfirm={handleConfirmBooking} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
