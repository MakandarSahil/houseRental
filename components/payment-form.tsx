"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { AlertCircle, CheckCircle, Lock } from "lucide-react"

interface PaymentFormData {
  cardholderName: string
  cardNumber: string
  expiryDate: string
  cvc: string
  address: string
  city: string
  zipCode: string
}

interface PaymentFormProps {
  amount: number
  propertyName: string
  duration: string
  onSubmit?: (data: PaymentFormData) => void
}

export function PaymentForm({ amount, propertyName, duration, onSubmit }: PaymentFormProps) {
  const [formData, setFormData] = useState<PaymentFormData>({
    cardholderName: "",
    cardNumber: "",
    expiryDate: "",
    cvc: "",
    address: "",
    city: "",
    zipCode: "",
  })

  const [errors, setErrors] = useState<Partial<PaymentFormData>>({})
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)

  const validateForm = (): boolean => {
    const newErrors: Partial<PaymentFormData> = {}

    if (!formData.cardholderName.trim()) {
      newErrors.cardholderName = "Cardholder name is required"
    }

    if (!formData.cardNumber.trim() || formData.cardNumber.replace(/\s/g, "").length !== 16) {
      newErrors.cardNumber = "Valid 16-digit card number is required"
    }

    if (!formData.expiryDate.trim() || !/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
      newErrors.expiryDate = "Valid expiry date (MM/YY) is required"
    }

    if (!formData.cvc.trim() || formData.cvc.length !== 3) {
      newErrors.cvc = "Valid 3-digit CVC is required"
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required"
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required"
    }

    if (!formData.zipCode.trim()) {
      newErrors.zipCode = "ZIP code is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(" ")
    } else {
      return value
    }
  }

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value)
    setFormData({ ...formData, cardNumber: formatted })
  }

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "")
    if (value.length >= 2) {
      value = value.slice(0, 2) + "/" + value.slice(2, 4)
    }
    setFormData({ ...formData, expiryDate: value })
  }

  const handleCVCChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 3)
    setFormData({ ...formData, cvc: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsProcessing(true)

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setPaymentSuccess(true)
      onSubmit?.(formData)

      // Reset after success
      setTimeout(() => {
        setFormData({
          cardholderName: "",
          cardNumber: "",
          expiryDate: "",
          cvc: "",
          address: "",
          city: "",
          zipCode: "",
        })
        setPaymentSuccess(false)
      }, 3000)
    } catch (error) {
      console.error("Payment error:", error)
      setErrors({ cardNumber: "Payment processing failed. Please try again." })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Payment Form */}
      <div className="lg:col-span-2">
        <Card className="p-8">
          <h1 className="text-3xl font-bold mb-8">Payment Details</h1>

          {paymentSuccess && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-green-900">Payment successful!</p>
                <p className="text-sm text-green-700">Your booking has been confirmed.</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Card Information */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Card Information</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="cardName">Cardholder Name</Label>
                  <Input
                    id="cardName"
                    placeholder="John Doe"
                    value={formData.cardholderName}
                    onChange={(e) => setFormData({ ...formData, cardholderName: e.target.value })}
                    className={errors.cardholderName ? "border-red-500" : ""}
                  />
                  {errors.cardholderName && (
                    <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.cardholderName}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={formData.cardNumber}
                    onChange={handleCardNumberChange}
                    maxLength={19}
                    className={errors.cardNumber ? "border-red-500" : ""}
                  />
                  {errors.cardNumber && (
                    <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.cardNumber}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input
                      id="expiry"
                      placeholder="MM/YY"
                      value={formData.expiryDate}
                      onChange={handleExpiryChange}
                      maxLength={5}
                      className={errors.expiryDate ? "border-red-500" : ""}
                    />
                    {errors.expiryDate && (
                      <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.expiryDate}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="cvc">CVC</Label>
                    <Input
                      id="cvc"
                      placeholder="123"
                      value={formData.cvc}
                      onChange={handleCVCChange}
                      maxLength={3}
                      className={errors.cvc ? "border-red-500" : ""}
                    />
                    {errors.cvc && (
                      <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.cvc}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Billing Address */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Billing Address</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="address">Street Address</Label>
                  <Input
                    id="address"
                    placeholder="123 Main St"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className={errors.address ? "border-red-500" : ""}
                  />
                  {errors.address && (
                    <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.address}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      placeholder="New York"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className={errors.city ? "border-red-500" : ""}
                    />
                    {errors.city && (
                      <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.city}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="zip">ZIP Code</Label>
                    <Input
                      id="zip"
                      placeholder="10001"
                      value={formData.zipCode}
                      onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                      className={errors.zipCode ? "border-red-500" : ""}
                    />
                    {errors.zipCode && (
                      <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.zipCode}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Security Notice */}
            <div className="bg-primary/10 border border-primary/20 p-4 rounded-lg flex items-start gap-3">
              <Lock className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-semibold text-sm">Secure Payment</div>
                <p className="text-sm text-muted-foreground">
                  Your payment information is encrypted and secure. We never store your full card details.
                </p>
              </div>
            </div>

            <Button type="submit" disabled={isProcessing} className="w-full bg-primary hover:bg-primary/90">
              {isProcessing ? "Processing Payment..." : "Complete Payment"}
            </Button>
          </form>
        </Card>
      </div>

      {/* Payment Summary */}
      <div className="lg:col-span-1">
        <Card className="p-6 sticky top-24">
          <h3 className="text-lg font-semibold mb-6">Order Summary</h3>

          <div className="space-y-4 mb-6 pb-6 border-b border-border">
            <div>
              <div className="text-sm text-muted-foreground">Property</div>
              <div className="font-semibold text-sm">{propertyName}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Duration</div>
              <div className="font-semibold text-sm">{duration}</div>
            </div>
          </div>

          <div className="space-y-2 mb-6 pb-6 border-b border-border">
            <div className="flex justify-between text-sm">
              <span>Accommodation</span>
              <span>${Math.round(amount * 0.85)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Service fee</span>
              <span>${Math.round(amount * 0.08)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Tax</span>
              <span>${Math.round(amount * 0.07)}</span>
            </div>
            <div className="flex justify-between font-semibold text-lg pt-2">
              <span>Total</span>
              <span className="text-primary">${amount}</span>
            </div>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            By completing this payment, you agree to our terms and conditions.
          </p>
        </Card>
      </div>
    </div>
  )
}
