"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { BookingForm } from "@/components/booking-form"
import { useRouter } from "next/navigation"

export default function BookingPage({ params }: { params: { id: string } }) {
  const router = useRouter()

  const bookingData = {
    propertyId: params.id,
    propertyName: "Modern Downtown Apartment",
    checkIn: "2025-05-30",
    checkOut: "2025-06-02",
    guests: 2,
    pricePerNight: 120,
  }

  const handleBookingSubmit = (data: any) => {
    // In production, this would save to database and redirect to payment
    console.log("Booking submitted:", data)
    setTimeout(() => {
      router.push(`/payment/${params.id}`)
    }, 2000)
  }

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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/property/1" className="flex items-center gap-2 text-primary mb-6 hover:opacity-80">
          <ArrowLeft className="w-4 h-4" />
          Back to Property
        </Link>

        <BookingForm {...bookingData} onSubmit={handleBookingSubmit} />
      </div>
    </div>
  )
}
