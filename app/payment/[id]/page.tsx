"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { PaymentForm } from "@/components/payment-form"
import { useRouter } from "next/navigation"

export default function PaymentPage({ params }: { params: { id: string } }) {
  const router = useRouter()

  const paymentData = {
    amount: 426,
    propertyName: "Modern Downtown Apartment",
    duration: "3 nights (May 30 - Jun 2)",
  }

  const handlePaymentSubmit = (data: any) => {
    // In production, this would process the payment with a payment gateway
    console.log("Payment submitted:", data)
    setTimeout(() => {
      router.push("/")
    }, 3000)
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
        <Link href="/booking/1" className="flex items-center gap-2 text-primary mb-6 hover:opacity-80">
          <ArrowLeft className="w-4 h-4" />
          Back to Booking
        </Link>

        <PaymentForm {...paymentData} onSubmit={handlePaymentSubmit} />
      </div>
    </div>
  )
}
