// src/components/dashboard-stats.tsx
import { DashboardStat } from '@/types';

interface DashboardStatsProps {
  stats: DashboardStat[];
  loading?: boolean;
}

export function DashboardStats({ stats, loading = false }: DashboardStatsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-card rounded-lg p-6 shadow-sm border animate-pulse">
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 bg-muted rounded"></div>
              <div className="w-16 h-4 bg-muted rounded"></div>
            </div>
            <div className="mt-4 space-y-2">
              <div className="w-3/4 h-4 bg-muted rounded"></div>
              <div className="w-1/2 h-3 bg-muted rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div key={index} className="bg-card rounded-lg p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div className={stat.color}>{stat.icon}</div>
            <span className="text-sm text-muted-foreground">{stat.change}</span>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold">{stat.value}</h3>
            <p className="text-muted-foreground mt-1">{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}