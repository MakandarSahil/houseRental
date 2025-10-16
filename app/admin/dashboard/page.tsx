"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Home, DollarSign, TrendingUp } from "lucide-react"
import { PropertyModerationTable } from "@/components/property-moderation-table"
import { useState } from "react"
import { DashboardStats } from "@/components/dasboard-stats"
import { UserManagementTable } from "@/components/user-managment-table"

const ADMIN_USERS = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    role: "Renter" as const,
    joined: "May 1, 2025",
    status: "Active" as const,
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    role: "Owner" as const,
    joined: "April 15, 2025",
    status: "Active" as const,
  },
  {
    id: 3,
    name: "Bob Johnson",
    email: "bob@example.com",
    role: "Renter" as const,
    joined: "May 10, 2025",
    status: "Inactive" as const,
  },
  {
    id: 4,
    name: "Alice Brown",
    email: "alice@example.com",
    role: "Owner" as const,
    joined: "March 20, 2025",
    status: "Active" as const,
  },
]

const ADMIN_PROPERTIES = [
  {
    id: 1,
    title: "Modern Downtown Apartment",
    owner: "Jane Smith",
    price: 120,
    bookings: 24,
    status: "Active" as const,
  },
  { id: 2, title: "Cozy Beach House", owner: "Alice Brown", price: 150, bookings: 18, status: "Active" as const },
  { id: 3, title: "Luxury Villa", owner: "Jane Smith", price: 250, bookings: 12, status: "Pending" as const },
  { id: 4, title: "Studio Apartment", owner: "Alice Brown", price: 80, bookings: 35, status: "Active" as const },
]

export default function AdminDashboard() {
  const [users, setUsers] = useState(ADMIN_USERS)
  const [properties, setProperties] = useState(ADMIN_PROPERTIES)

  const handleSuspendUser = (userId: number) => {
    // setUsers(users.map((u) => (u.id === userId ? { ...u, status: "Suspended" as const } : u)))
    console.log("handle suspend user")
  }

  const handleDeleteUser = (userId: number) => {
    setUsers(users.filter((u) => u.id !== userId))
  }

  const handlePromoteUser = (userId: number) => {
    // setUsers(users.map((u) => (u.id === userId ? { ...u, role: "Admin" as const } : u)))
    console.log("handle promote user")
  }

  const handleApproveProperty = (propertyId: number) => {
    setProperties(properties.map((p) => (p.id === propertyId ? { ...p, status: "Active" as const } : p)))
  }

  const handleRejectProperty = (propertyId: number) => {
    setProperties(properties.filter((p) => p.id !== propertyId))
  }

  const handleDeleteProperty = (propertyId: number) => {
    setProperties(properties.filter((p) => p.id !== propertyId))
  }

  const stats = [
    {
      icon: <Users className="w-8 h-8" />,
      label: "Total Users",
      value: "1,234",
      change: "+45 this month",
      color: "text-primary",
    },
    {
      icon: <Home className="w-8 h-8" />,
      label: "Total Properties",
      value: "456",
      change: "+23 this month",
      color: "text-accent",
    },
    {
      icon: <DollarSign className="w-8 h-8" />,
      label: "Total Revenue",
      value: "$125,430",
      change: "+18% this month",
      color: "text-green-600",
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      label: "Growth Rate",
      value: "+12.5%",
      change: "+2.3% vs last month",
      color: "text-blue-600",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-primary">
            HomeStay
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/browse">
              <Button variant="ghost">Browse</Button>
            </Link>
            <Button variant="outline">Logout</Button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage users, properties, and platform activity</p>
        </div>

        <div className="mb-8">
          <DashboardStats stats={stats} />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="properties">Properties</TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <h2 className="text-2xl font-bold">User Management</h2>

            <UserManagementTable
              users={users}
              onSuspend={handleSuspendUser}
              onDelete={handleDeleteUser}
              onPromote={handlePromoteUser}
            />
          </TabsContent>

          {/* Properties Tab */}
          <TabsContent value="properties" className="space-y-6">
            <h2 className="text-2xl font-bold">Property Management</h2>

            <PropertyModerationTable
              properties={properties}
              onApprove={handleApproveProperty}
              onReject={handleRejectProperty}
              onDelete={handleDeleteProperty}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
