"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { MessageSquare, CheckCircle, Clock } from "lucide-react"

interface Booking {
  id: number
  property: string
  guest: string
  checkIn: string
  checkOut: string
  amount: number
  status: "Confirmed" | "Pending" | "Cancelled"
}

interface BookingTableProps {
  bookings: {
    id: string;
    property: string;
    guest: string;
    checkIn: string;
    checkOut: string;
    amount: number;
    status: "Pending" | "Confirmed" | "Cancelled" | "Completed";
  }[];
  onMessage: (id: string) => void;
  onConfirm: (id: string) => void;
  onReject?: (id: string) => void; // Add reject handler
}

export function BookingTable({ bookings, onMessage, onConfirm }: BookingTableProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Confirmed":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "Pending":
        return <Clock className="w-4 h-4 text-yellow-600" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmed":
        return "bg-green-100 text-green-800"
      case "Pending":
        return "bg-yellow-100 text-yellow-800"
      case "Cancelled":
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
              <th className="text-left py-3 px-4 font-semibold">Guest</th>
              <th className="text-left py-3 px-4 font-semibold">Dates</th>
              <th className="text-left py-3 px-4 font-semibold">Amount</th>
              <th className="text-left py-3 px-4 font-semibold">Status</th>
              <th className="text-left py-3 px-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                <td className="py-4 px-4 font-medium">{booking.property}</td>
                <td className="py-4 px-4">{booking.guest}</td>
                <td className="py-4 px-4 text-sm text-muted-foreground">
                  {booking.checkIn} - {booking.checkOut}
                </td>
                <td className="py-4 px-4 font-semibold">${booking.amount}</td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(booking.status)}
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex gap-2">
                    {booking.status === "Pending" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-transparent"
                        onClick={() => onConfirm?.(booking.id)}
                      >
                        Confirm
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-transparent"
                      onClick={() => onMessage?.(booking.id)}
                    >
                      <MessageSquare className="w-4 h-4" />
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
