'use client';

import { useRouter } from 'next/navigation';
import { Package, ShoppingBag, Star, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/lib/auth-context';
import { useMyPurchases } from '@/hooks/use-transactions';
import { useMyPayments } from '@/hooks/use-payments';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { data: purchasesResponse, isLoading: purchasesLoading } = useMyPurchases(1, 100);
  const { data: paymentsResponse, isLoading: paymentsLoading } = useMyPayments(1, 100);

  const purchases = purchasesResponse?.data ?? [];
  const payments = paymentsResponse?.data ?? [];
  const isLoading = purchasesLoading || paymentsLoading;

  const stats = [
    { icon: Package, label: 'Total Orders', value: Array.isArray(purchases) ? String(purchases.length) : '0', color: 'bg-primary/10 text-primary' },
    { icon: ShoppingBag, label: 'Payments', value: Array.isArray(payments) ? String(payments.length) : '0', color: 'bg-accent/10 text-accent' },
    { icon: Star, label: 'Member Since', value: user?.joinDate ? new Date(user.joinDate).getFullYear().toString() : new Date().getFullYear().toString(), color: 'bg-success/10 text-success' },
    { icon: Clock, label: 'Role', value: user?.role === 'admin' ? 'Admin' : 'User', color: 'bg-secondary text-foreground' },
  ];

  const recentOrders = Array.isArray(purchases) ? purchases.slice(0, 5) : [];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground mb-8">Manage your account, orders, and listings</p>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat) => (
              <Card key={stat.label}>
                <CardContent className="p-4 sm:p-5">
                  <div className={`h-10 w-10 rounded-lg ${stat.color} flex items-center justify-center mb-3`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground">Recent Purchases</h2>
                <Link href="/items" className="text-sm font-medium text-primary hover:underline inline-flex items-center gap-1">
                  View all <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
              {isLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : recentOrders.length === 0 ? (
                <EmptyState
                  title="No orders yet"
                  description="Start exploring products to place your first order."
                  action={{ label: 'Explore Products', onClick: () => router.push('/explore') }}
                />
              ) : (
                <div className="space-y-0">
                  {recentOrders.map((order: Record<string, unknown>, index: number) => {
                    const item = order.item as Record<string, unknown> | undefined;
                    return (
                      <div key={String(order._id ?? index)}>
                        <div className="flex items-center justify-between py-3">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                              <AvatarFallback className="text-xs bg-secondary text-foreground">
                                {String(item?.title ?? '??').slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium text-foreground">{String(item?.title ?? 'Unknown item')}</p>
                              <p className="text-xs text-muted-foreground">
                                {String(order.status ?? 'pending')} · {order.createdAt ? new Date(String(order.createdAt)).toLocaleDateString() : ''}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-foreground">${Number(order.amount ?? 0).toFixed(2)}</p>
                            <Badge
                              variant={order.status === 'completed' ? 'default' : 'secondary'}
                              className="mt-0.5"
                            >
                              {String(order.status ?? 'pending')}
                            </Badge>
                          </div>
                        </div>
                        {index < recentOrders.length - 1 && <Separator />}
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}
