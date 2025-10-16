"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Edit2, Trash2, BarChart3 } from "lucide-react"

interface PropertyCardProps {
  id: number
  title: string
  location: string
  price: number
  bookings: number
  revenue: number
  status: "Active" | "Inactive" | "Maintenance"
  onEdit?: (id: number) => void
  onDelete?: (id: number) => void
  onViewStats?: (id: number) => void
}

export function PropertyCard({
  id,
  title,
  location,
  price,
  bookings,
  revenue,
  status,
  onEdit,
  onDelete,
  onViewStats,
}: PropertyCardProps) {
  const statusColors = {
    Active: "bg-green-100 text-green-800",
    Inactive: "bg-gray-100 text-gray-800",
    Maintenance: "bg-yellow-100 text-yellow-800",
  }

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="mb-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground">{location}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[status]}`}>{status}</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6 pb-6 border-b border-border">
        <div>
          <p className="text-xs text-muted-foreground">Price/Night</p>
          <p className="text-lg font-bold text-primary">${price}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Bookings</p>
          <p className="text-lg font-bold">{bookings}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Revenue</p>
          <p className="text-lg font-bold">${revenue}</p>
        </div>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" size="sm" className="flex-1 bg-transparent" onClick={() => onViewStats?.(id)}>
          <BarChart3 className="w-4 h-4 mr-2" />
          Stats
        </Button>
        <Button variant="outline" size="sm" className="flex-1 bg-transparent" onClick={() => onEdit?.(id)}>
          <Edit2 className="w-4 h-4 mr-2" />
          Edit
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-1 text-destructive bg-transparent"
          onClick={() => onDelete?.(id)}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete
        </Button>
      </div>
    </Card>
  )
}
