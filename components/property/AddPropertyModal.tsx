// src/components/property/add-property-modal.tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface AddPropertyModalProps {
  isOpen: boolean
  onClose: () => void
  onAddProperty: (propertyData: PropertyFormData) => Promise<void>
  loading?: boolean
}

export interface PropertyFormData {
  title: string
  description: string
  address: string
  city: string
  state: string
  rent: number
  bedrooms: number
  bathrooms: number
  squareFeet: number
  propertyType: string
  imageUrl: string
}

// Separate interface for errors since error messages are strings
interface PropertyFormErrors {
  title?: string
  description?: string
  address?: string
  city?: string
  state?: string
  rent?: string
  bedrooms?: string
  bathrooms?: string
  squareFeet?: string
  propertyType?: string
  imageUrl?: string
}

export function AddPropertyModal({ 
  isOpen, 
  onClose, 
  onAddProperty, 
  loading = false 
}: AddPropertyModalProps) {
  const [formData, setFormData] = useState<PropertyFormData>({
    title: "",
    description: "",
    address: "",
    city: "",
    state: "",
    rent: 0,
    bedrooms: 1,
    bathrooms: 1,
    squareFeet: 0,
    propertyType: "Apartment",
    imageUrl: ""
  })

  const [errors, setErrors] = useState<PropertyFormErrors>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form
    const newErrors: PropertyFormErrors = {}
    if (!formData.title.trim()) newErrors.title = "Title is required"
    if (!formData.description.trim()) newErrors.description = "Description is required"
    if (!formData.address.trim()) newErrors.address = "Address is required"
    if (!formData.city.trim()) newErrors.city = "City is required"
    if (!formData.state.trim()) newErrors.state = "State is required"
    if (formData.rent <= 0) newErrors.rent = "Rent must be greater than 0"
    if (formData.bedrooms <= 0) newErrors.bedrooms = "Bedrooms must be greater than 0"
    if (formData.bathrooms <= 0) newErrors.bathrooms = "Bathrooms must be greater than 0"
    if (formData.squareFeet <= 0) newErrors.squareFeet = "Square feet must be greater than 0"
    if (!formData.imageUrl.trim()) newErrors.imageUrl = "Image URL is required"

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      await onAddProperty(formData)
      handleClose()
    } catch (error) {
      console.error("Failed to add property:", error)
    }
  }

  const handleClose = () => {
    setFormData({
      title: "",
      description: "",
      address: "",
      city: "",
      state: "",
      rent: 0,
      bedrooms: 1,
      bathrooms: 1,
      squareFeet: 0,
      propertyType: "Apartment",
      imageUrl: ""
    })
    setErrors({})
    onClose()
  }

  const handleChange = (field: keyof PropertyFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    // Clear error when user starts typing
    if (errors[field as keyof PropertyFormErrors]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }))
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Property</DialogTitle>
          <DialogDescription>
            Fill in the details of your property. All fields are required.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Basic Information */}
          <div className="space-y-2">
            <Label htmlFor="title">Property Title *</Label>
            <Input
              id="title"
              placeholder="Beautiful 2BHK Apartment"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              className={errors.title ? "border-destructive" : ""}
            />
            {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Spacious apartment with modern amenities..."
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className={errors.description ? "border-destructive" : ""}
              rows={3}
            />
            {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
          </div>

          {/* Location Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="address">Address *</Label>
              <Input
                id="address"
                placeholder="123 Main Street, Block A"
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
                className={errors.address ? "border-destructive" : ""}
              />
              {errors.address && <p className="text-sm text-destructive">{errors.address}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                placeholder="Mumbai"
                value={formData.city}
                onChange={(e) => handleChange("city", e.target.value)}
                className={errors.city ? "border-destructive" : ""}
              />
              {errors.city && <p className="text-sm text-destructive">{errors.city}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="state">State *</Label>
              <Input
                id="state"
                placeholder="Maharashtra"
                value={formData.state}
                onChange={(e) => handleChange("state", e.target.value)}
                className={errors.state ? "border-destructive" : ""}
              />
              {errors.state && <p className="text-sm text-destructive">{errors.state}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="propertyType">Property Type *</Label>
              <Select
                value={formData.propertyType}
                onValueChange={(value) => handleChange("propertyType", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Apartment">Apartment</SelectItem>
                  <SelectItem value="House">House</SelectItem>
                  <SelectItem value="Villa">Villa</SelectItem>
                  <SelectItem value="Studio">Studio</SelectItem>
                  <SelectItem value="Condo">Condo</SelectItem>
                  <SelectItem value="Townhouse">Townhouse</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Property Details */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="rent">Monthly Rent (₹) *</Label>
              <Input
                id="rent"
                type="number"
                min="0"
                placeholder="25000"
                value={formData.rent || ""}
                onChange={(e) => handleChange("rent", Number(e.target.value))}
                className={errors.rent ? "border-destructive" : ""}
              />
              {errors.rent && <p className="text-sm text-destructive">{errors.rent}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="bedrooms">Bedrooms *</Label>
              <Input
                id="bedrooms"
                type="number"
                min="1"
                placeholder="2"
                value={formData.bedrooms}
                onChange={(e) => handleChange("bedrooms", Number(e.target.value))}
                className={errors.bedrooms ? "border-destructive" : ""}
              />
              {errors.bedrooms && <p className="text-sm text-destructive">{errors.bedrooms}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="bathrooms">Bathrooms *</Label>
              <Input
                id="bathrooms"
                type="number"
                min="1"
                placeholder="2"
                value={formData.bathrooms}
                onChange={(e) => handleChange("bathrooms", Number(e.target.value))}
                className={errors.bathrooms ? "border-destructive" : ""}
              />
              {errors.bathrooms && <p className="text-sm text-destructive">{errors.bathrooms}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="squareFeet">Area (sq ft) *</Label>
              <Input
                id="squareFeet"
                type="number"
                min="0"
                placeholder="1200"
                value={formData.squareFeet || ""}
                onChange={(e) => handleChange("squareFeet", Number(e.target.value))}
                className={errors.squareFeet ? "border-destructive" : ""}
              />
              {errors.squareFeet && <p className="text-sm text-destructive">{errors.squareFeet}</p>}
            </div>
          </div>

          {/* Image URL */}
          <div className="space-y-2">
            <Label htmlFor="imageUrl">Property Image URL *</Label>
            <Input
              id="imageUrl"
              type="url"
              placeholder="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267"
              value={formData.imageUrl}
              onChange={(e) => handleChange("imageUrl", e.target.value)}
              className={errors.imageUrl ? "border-destructive" : ""}
            />
            {errors.imageUrl && <p className="text-sm text-destructive">{errors.imageUrl}</p>}
            {formData.imageUrl && (
              <div className="mt-2">
                <p className="text-sm text-muted-foreground mb-2">Image Preview:</p>
                <img 
                  src={formData.imageUrl} 
                  alt="Property preview" 
                  className="w-32 h-32 object-cover rounded-lg border"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Adding Property..." : "Add Property"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}