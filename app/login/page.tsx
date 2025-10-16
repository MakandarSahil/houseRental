// src/app/login/page.tsx
"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from "lucide-react"
import { PublicRoute } from "@/components/auth/PublicRoute"
import { useAuth } from "@/context/authContext"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const { login, loading, error, clearError } = useAuth()
  const router = useRouter()

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {}

    if (!email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid"
    }

    if (!password) {
      newErrors.password = "Password is required"
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    clearError()

    if (!validateForm()) {
      return
    }

    try {
      await login({ email, password })
      // Redirect is handled in the AuthContext based on user role
    } catch (err) {
      // Error is handled in the AuthContext
      console.error("Login failed:", err)
    }
  }

  const handleChange = (field: string, value: string) => {
    if (field === 'email') setEmail(value)
    if (field === 'password') setPassword(value)
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }))
    }
  }

  return (
    <PublicRoute>
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Link href="/" className="flex items-center gap-2 text-primary mb-8 hover:opacity-80">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <Card className="p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Welcome Back</h1>
              <p className="text-muted-foreground">Sign in to your HomeStay account</p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-destructive text-sm font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  required
                  className={errors.email ? "border-destructive" : ""}
                />
                {errors.email && (
                  <p className="text-destructive text-sm">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  required
                  className={errors.password ? "border-destructive" : ""}
                />
                {errors.password && (
                  <p className="text-destructive text-sm">{errors.password}</p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Signing In...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-muted-foreground">
                Don't have an account?{" "}
                <Link href="/register" className="text-primary font-semibold hover:underline">
                  Sign up
                </Link>
              </p>
            </div>

            {/* Demo Accounts Info */}
            <div className="mt-6 p-4 bg-muted/30 rounded-lg">
              <h3 className="text-sm font-semibold mb-2">Demo Accounts:</h3>
              <div className="text-xs space-y-1">
                <p><strong>Owner:</strong> john@owner.com / 123456</p>
                <p><strong>Renter:</strong> shon@renter.com / password123</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </PublicRoute>
  )
}