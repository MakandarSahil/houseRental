"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Trash2, CheckCircle, XCircle, Shield, Ban } from "lucide-react"

interface User {
  id: number
  name: string
  email: string
  role: "Renter" | "Owner" | "Admin"
  joined: string
  status: "Active" | "Inactive" | "Suspended"
}

interface UserManagementTableProps {
  users: User[]
  onSuspend?: (userId: number) => void
  onDelete?: (userId: number) => void
  onPromote?: (userId: number) => void
}

export function UserManagementTable({ users, onSuspend, onDelete, onPromote }: UserManagementTableProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Active":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "Inactive":
        return <XCircle className="w-4 h-4 text-gray-600" />
      case "Suspended":
        return <Ban className="w-4 h-4 text-red-600" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "text-green-600"
      case "Inactive":
        return "text-gray-600"
      case "Suspended":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left py-3 px-4 font-semibold">Name</th>
              <th className="text-left py-3 px-4 font-semibold">Email</th>
              <th className="text-left py-3 px-4 font-semibold">Role</th>
              <th className="text-left py-3 px-4 font-semibold">Joined</th>
              <th className="text-left py-3 px-4 font-semibold">Status</th>
              <th className="text-left py-3 px-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                <td className="py-4 px-4 font-semibold">{user.name}</td>
                <td className="py-4 px-4 text-sm text-muted-foreground">{user.email}</td>
                <td className="py-4 px-4">
                  <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold">
                    {user.role}
                  </span>
                </td>
                <td className="py-4 px-4 text-sm text-muted-foreground">{user.joined}</td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(user.status)}
                    <span className={`text-sm ${getStatusColor(user.status)}`}>{user.status}</span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex gap-2">
                    {user.status === "Active" && (
                      <>
                        <Button variant="ghost" size="sm" onClick={() => onPromote?.(user.id)} title="Promote to Admin">
                          <Shield className="w-4 h-4 text-blue-600" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => onSuspend?.(user.id)} title="Suspend User">
                          <Ban className="w-4 h-4 text-yellow-600" />
                        </Button>
                      </>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete?.(user.id)}
                      className="text-destructive hover:text-destructive"
                      title="Delete User"
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
