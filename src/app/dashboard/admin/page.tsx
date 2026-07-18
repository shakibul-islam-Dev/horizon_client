'use client';

import { Users, Package, DollarSign, TrendingUp } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useItems } from '@/hooks/use-items';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminDashboardPage() {
  const { data: itemsResponse, isLoading } = useItems({ limit: '100' });
  const items = itemsResponse?.data ?? [];
  const totalRevenue = items.reduce((sum, item) => sum + item.price, 0);
  const avgPrice = items.length > 0 ? totalRevenue / items.length : 0;

  const stats = [
    { icon: Package, label: 'Total Listings', value: String(items.length), change: '', color: 'bg-primary/10 text-primary' },
    { icon: DollarSign, label: 'Avg Price', value: `$${avgPrice.toFixed(0)}`, change: '', color: 'bg-accent/10 text-accent' },
    { icon: TrendingUp, label: 'Total Value', value: `$${totalRevenue.toLocaleString()}`, change: '', color: 'bg-success/10 text-success' },
    { icon: Users, label: 'Categories', value: String(new Set(items.map((i) => i.category)).size), change: '', color: 'bg-secondary text-foreground' },
  ];

  const categoryData = items.reduce((acc, item) => {
    const catName = item.category || 'Other';
    acc[catName] = (acc[catName] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(categoryData).map(([name, count]) => ({
    category: name.length > 10 ? name.slice(0, 10) + '…' : name,
    count,
  }));

  return (
    <ProtectedRoute adminOnly>
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground mb-8">Overview of platform activity</p>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-4 sm:p-5">
                    <Skeleton className="h-10 w-10 rounded-lg mb-3" />
                    <Skeleton className="h-8 w-16 mb-1" />
                    <Skeleton className="h-4 w-24" />
                  </CardContent>
                </Card>
              ))
            ) : (
              stats.map((stat) => (
                <Card key={stat.label}>
                  <CardContent className="p-4 sm:p-5">
                    <div className={`h-10 w-10 rounded-lg ${stat.color} flex items-center justify-center mb-3`}>
                      <stat.icon className="h-5 w-5" />
                    </div>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      {stat.change && <Badge variant="default">{stat.change}</Badge>}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Listings by Category</h2>
              <div className="h-72">
                {isLoading ? (
                  <Skeleton className="h-full w-full" />
                ) : chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="category" stroke="var(--muted-foreground)" fontSize={12} />
                      <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'var(--card)',
                          border: '1px solid var(--border)',
                          borderRadius: '8px',
                          color: 'var(--foreground)',
                        }}
                      />
                      <Bar dataKey="count" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    No data available
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}
