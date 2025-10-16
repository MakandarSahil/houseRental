"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Trash2, CheckCircle, Clock, AlertCircle } from "lucide-react"

interface Property {
  id: number
  title: string
  owner: string
  price: number
  bookings: number
  status: "Active" | "Pending" | "Flagged"
}

interface PropertyModerationTableProps {
  properties: Property[]
  onApprove?: (propertyId: number) => void
  onReject?: (propertyId: number) => void
  onDelete?: (propertyId: number) => void
}

export function PropertyModerationTable({ properties, onApprove, onReject, onDelete }: PropertyModerationTableProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Active":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "Pending":
        return <Clock className="w-4 h-4 text-yellow-600" />
      case "Flagged":
        return <AlertCircle className="w-4 h-4 text-red-600" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800"
      case "Pending":
        return "bg-yellow-100 text-yellow-800"
      case "Flagged":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left py-3 px-4 font-semibold">Property</th>
              <th className="text-left py-3 px-4 font-semibold">Owner</th>
              <th className="text-left py-3 px-4 font-semibold">Price/Night</th>
              <th className="text-left py-3 px-4 font-semibold">Bookings</th>
              <th className="text-left py-3 px-4 font-semibold">Status</th>
              <th className="text-left py-3 px-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {properties.map((property) => (
              <tr key={property.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                <td className="py-4 px-4 font-semibold">{property.title}</td>
                <td className="py-4 px-4 text-sm text-muted-foreground">{property.owner}</td>
                <td className="py-4 px-4 font-semibold">${property.price}</td>
                <td className="py-4 px-4">{property.bookings}</td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(property.status)}
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(property.status)}`}>
                      {property.status}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex gap-2">
                    {property.status === "Pending" && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-transparent text-green-600 hover:text-green-700"
                          onClick={() => onApprove?.(property.id)}
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-transparent text-red-600 hover:text-red-700"
                          onClick={() => onReject?.(property.id)}
                        >
                          Reject
                        </Button>
                      </>
                    )}
                    {property.status === "Flagged" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-transparent text-green-600 hover:text-green-700"
                        onClick={() => onApprove?.(property.id)}
                      >
                        Resolve
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete?.(property.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
