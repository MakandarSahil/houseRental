"use client"

import type React from "react"

import { Card } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"

interface StatItem {
  icon: React.ReactNode
  label: string
  value: string
  change?: string
  color: string
}

interface DashboardStatsProps {
  stats: StatItem[]
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {stats.map((stat, i) => (
        <Card key={i} className="p-4 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
              {stat.change && (
                <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  {stat.change}
                </p>
              )}
            </div>
            <div className={`${stat.color} opacity-20`}>{stat.icon}</div>
          </div>
        </Card>
      ))}
    </div>
  )
}
