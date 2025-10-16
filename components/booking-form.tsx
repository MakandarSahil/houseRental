"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { AlertCircle, CheckCircle } from "lucide-react"

interface BookingFormProps {
  propertyId: string
  propertyName: string
  checkIn: string
  checkOut: string
  guests: number
  pricePerNight: number
  onSubmit?: (data: BookingFormData) => void
}

export interface BookingFormData {
  fullName: string
  email: string
  phone: string
  specialRequests: string
  termsAccepted: any
}

export function BookingForm({
  propertyId,
  propertyName,
  checkIn,
  checkOut,
  guests,
  pricePerNight,
  onSubmit,
}: BookingFormProps) {
  const [formData, setFormData] = useState<BookingFormData>({
    fullName: "",
    email: "",
    phone: "",
    specialRequests: "",
    termsAccepted: false,
  })

  const [errors, setErrors] = useState<Partial<BookingFormData>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const nights = Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24))
  const subtotal = pricePerNight * nights
  const serviceFee = Math.round(subtotal * 0.1)
  const tax = Math.round((subtotal + serviceFee) * 0.08)
  const total = subtotal + serviceFee + tax

  const validateForm = (): boolean => {
    const newErrors: Partial<BookingFormData> = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required"
    }

    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Valid email is required"
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required"
    }

    if (!formData.termsAccepted) {
      newErrors.termsAccepted = "You must accept the terms and conditions"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setSubmitSuccess(true)
      onSubmit?.(formData)

      // Reset form after success
      setTimeout(() => {
        setFormData({
          fullName: "",
          email: "",
          phone: "",
          specialRequests: "",
          termsAccepted: false,
        })
        setSubmitSuccess(false)
      }, 2000)
    } catch (error) {
      console.error("Booking error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Booking Form */}
      <div className="lg:col-span-2">
        <Card className="p-8">
          <h1 className="text-3xl font-bold mb-8">Complete Your Booking</h1>

          {submitSuccess && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-green-900">Booking details submitted!</p>
                <p className="text-sm text-green-700">Proceeding to payment...</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Guest Information */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Guest Information</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className={errors.fullName ? "border-red-500" : ""}
                  />
                  {errors.fullName && (
                    <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.fullName}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className={errors.phone ? "border-red-500" : ""}
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.phone}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Special Requests */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Special Requests</h2>
              <textarea
                placeholder="Any special requests for your stay?"
                value={formData.specialRequests}
                onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                rows={4}
              />
            </div>

            {/* Cancellation Policy */}
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Cancellation Policy</h3>
              <p className="text-sm text-muted-foreground">
                Free cancellation up to 7 days before check-in. After that, you'll be charged the full amount.
              </p>
            </div>

            {/* Terms */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="terms"
                checked={formData.termsAccepted}
                onChange={(e) => setFormData({ ...formData, termsAccepted: e.target.checked })}
                className="mt-1"
              />
              <label htmlFor="terms" className="text-sm text-muted-foreground">
                I agree to the terms and conditions and privacy policy
              </label>
            </div>
            {errors.termsAccepted && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.termsAccepted}
              </p>
            )}

            <Button type="submit" disabled={isSubmitting} className="w-full bg-primary hover:bg-primary/90">
              {isSubmitting ? "Processing..." : "Continue to Payment"}
            </Button>
          </form>
        </Card>
      </div>

      {/* Booking Summary */}
      <div className="lg:col-span-1">
        <Card className="p-6 sticky top-24">
          <h3 className="text-lg font-semibold mb-6">Booking Summary</h3>

          <div className="space-y-4 mb-6 pb-6 border-b border-border">
            <div>
              <div className="text-sm text-muted-foreground">Property</div>
              <div className="font-semibold">{propertyName}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Check-in</div>
              <div className="font-semibold">{new Date(checkIn).toLocaleDateString()}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Check-out</div>
              <div className="font-semibold">{new Date(checkOut).toLocaleDateString()}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Guests</div>
              <div className="font-semibold">
                {guests} Guest{guests > 1 ? "s" : ""}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Nights</div>
              <div className="font-semibold">
                {nights} Night{nights > 1 ? "s" : ""}
              </div>
            </div>
          </div>

          <div className="space-y-2 mb-6 pb-6 border-b border-border">
            <div className="flex justify-between text-sm">
              <span>
                ${pricePerNight} x {nights} nights
              </span>
              <span>${subtotal}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Service fee</span>
              <span>${serviceFee}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Tax</span>
              <span>${tax}</span>
            </div>
            <div className="flex justify-between font-semibold text-lg pt-2">
              <span>Total</span>
              <span className="text-primary">${total}</span>
            </div>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            You won't be charged until you complete the next step
          </p>
        </Card>
      </div>
    </div>
  )
}
