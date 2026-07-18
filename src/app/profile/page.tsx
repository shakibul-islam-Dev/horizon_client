'use client';

import Link from 'next/link';
import {
  User, Mail, Calendar, Shield, Package, Heart, Settings, ArrowRight,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useMyListings } from '@/hooks/use-items';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}

function ProfileContent() {
  const { user } = useAuth();
  const { data: listingsResponse, isLoading: listingsLoading } = useMyListings(1, 100);
  const listings = listingsResponse?.data ?? [];

  if (!user) return null;

  const joinDate = user.joinDate
    ? new Date(user.joinDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Unknown';

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
          <p className="text-muted-foreground mt-1">Manage your account and view your activity</p>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardContent className="p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <Avatar size="lg">
                  {user.avatar && <AvatarImage src={user.avatar} alt={user.name} />}
                  <AvatarFallback className="text-xl">
                    {user.name?.charAt(0)?.toUpperCase() || <User className="h-6 w-6" />}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-foreground">{user.name}</h2>
                  <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Mail className="h-4 w-4" />
                      {user.email}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4" />
                      Joined {joinDate}
                    </span>
                    <Badge variant="secondary" className="gap-1">
                      <Shield className="h-3 w-3" />
                      {user.role === 'admin' ? 'Admin' : 'Member'}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 sm:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Package className="h-4 w-4 text-primary" />
                  My Listings
                </CardTitle>
              </CardHeader>
              <CardContent>
                {listingsLoading ? (
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                ) : (
                  <>
                    <p className="text-3xl font-bold text-foreground">{listings.length}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {listings.length === 1 ? 'item listed' : 'items listed'}
                    </p>
                    <Separator className="my-4" />
                    <Link href="/items/manage">
                      <Button variant="ghost" size="sm" className="gap-2">
                        Manage Listings
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Heart className="h-4 w-4 text-primary" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/items/add" className="block">
                  <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                    <Package className="h-4 w-4" />
                    Add New Item
                  </Button>
                </Link>
                <Link href="/wishlist" className="block">
                  <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                    <Heart className="h-4 w-4" />
                    View Wishlist
                  </Button>
                </Link>
                <Link href="/dashboard" className="block">
                  <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                    <Settings className="h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
