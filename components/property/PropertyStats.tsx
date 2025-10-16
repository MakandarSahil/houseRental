// src/components/property/property-stats.tsx
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, DollarSign, Eye, Users } from "lucide-react"
import { Property, Booking } from "@/types"

interface PropertyStatsProps {
  property: Property
  bookings: Booking[]
}

export function PropertyStats({ property, bookings }: PropertyStatsProps) {
  // Calculate stats from bookings
  const propertyBookings = bookings.filter(booking => booking.propertyId === property.id)
  const approvedBookings = propertyBookings.filter(booking => booking.status === 'APPROVED')
  const pendingBookings = propertyBookings.filter(booking => booking.status === 'PENDING')
  
  const totalRevenue = approvedBookings.reduce((sum, booking) => {
    const start = new Date(booking.startDate)
    const end = new Date(booking.endDate)
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    return sum + (property.rent * days)
  }, 0)

  const totalGuests = new Set(approvedBookings.map(booking => booking.renterId)).size
  const occupancyRate = propertyBookings.length > 0 ? (approvedBookings.length / propertyBookings.length) * 100 : 0

  const stats = [
    {
      title: "Total Bookings",
      value: propertyBookings.length.toString(),
      description: `${approvedBookings.length} approved, ${pendingBookings.length} pending`,
      icon: Calendar,
      color: "text-blue-600"
    },
    {
      title: "Total Revenue",
      value: `₹${totalRevenue.toLocaleString()}`,
      description: "From all approved bookings",
      icon: DollarSign,
      color: "text-green-600"
    },
    {
      title: "Unique Guests",
      value: totalGuests.toString(),
      description: "Total unique guests",
      icon: Users,
      color: "text-purple-600"
    },
    {
      title: "Occupancy Rate",
      value: `${occupancyRate.toFixed(1)}%`,
      description: "Booking success rate",
      icon: Eye,
      color: "text-orange-600"
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}