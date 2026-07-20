'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  User, Mail, Calendar, Shield, Package, Heart, Settings, ArrowRight,
  Camera, Save, Loader2, CheckCircle2, XCircle,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useMyListings } from '@/hooks/use-items';
import { useProfile, useUpdateProfile } from '@/hooks/use-user';
import { useCategories } from '@/hooks/use-categories';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { toast } from '@/components/ui/sonner';

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
  const { data: profileResponse } = useProfile();
  const profileData = (profileResponse?.data as Record<string, unknown>) ?? null;
  const updateProfile = useUpdateProfile();
  const { data: categoriesResponse } = useCategories();
  const categories = (categoriesResponse?.data ?? []) as { id: string; name: string }[];

  const [formName, setFormName] = useState('');
  const [formImage, setFormImage] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceMin, setPriceMin] = useState('0');
  const [priceMax, setPriceMax] = useState('10000');

  if (!user) return null;

  const joinDate = user.joinDate
    ? new Date(user.joinDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Unknown';

  const startEditing = () => {
    setFormName(user.name || '');
    setFormImage(user.avatar || '');
    const prefs = (profileData?.preferences as Record<string, unknown>) ?? {};
    const cats = (prefs.categories as string[]) ?? [];
    setSelectedCategories(cats);
    const pr = (prefs.priceRange as Record<string, number>) ?? {};
    setPriceMin(String(pr.min ?? 0));
    setPriceMax(String(pr.max ?? 10000));
  };

  const handleSave = async () => {
    if (!formName.trim()) {
      toast.error('Name is required');
      return;
    }
    try {
      await updateProfile.mutateAsync({
        name: formName.trim(),
        image: formImage.trim(),
        preferences: {
          categories: selectedCategories,
          priceRange: {
            min: Number(priceMin) || 0,
            max: Number(priceMax) || 10000,
          },
        },
      });
      toast.success('Profile updated successfully');
    } catch {
      toast.error('Failed to update profile');
    }
  };

  const toggleCategory = (catId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(catId) ? prev.filter((c) => c !== catId) : [...prev, catId]
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
          <p className="text-muted-foreground mt-1">Manage your account and view your activity</p>
        </div>

        <Tabs defaultValue="profile">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="edit">Edit Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <div className="grid gap-6 mt-4">
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
                    <Button variant="outline" size="sm" onClick={startEditing}>
                      Edit Profile
                    </Button>
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
          </TabsContent>

          <TabsContent value="edit">
            <div className="grid gap-6 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Camera className="h-4 w-4 text-primary" />
                    Profile Picture
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <Avatar size="lg">
                      {formImage && <AvatarImage src={formImage} alt="Preview" />}
                      <AvatarFallback className="text-xl">
                        {formName?.charAt(0)?.toUpperCase() || <User className="h-6 w-6" />}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <Label htmlFor="avatar-url" className="text-xs text-muted-foreground">Image URL</Label>
                      <Input
                        id="avatar-url"
                        value={formImage}
                        onChange={(e) => setFormImage(e.target.value)}
                        placeholder="https://example.com/avatar.jpg"
                        className="mt-1"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <User className="h-4 w-4 text-primary" />
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="profile-name">Display Name</Label>
                    <Input
                      id="profile-name"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="Your name"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Email</Label>
                    <Input
                      value={user.email}
                      disabled
                      className="mt-1 opacity-60"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Email cannot be changed here</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Settings className="h-4 w-4 text-primary" />
                    Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label className="text-sm font-medium">Interested Categories</Label>
                    <p className="text-xs text-muted-foreground mb-3">
                      Select categories you are interested in for personalized recommendations
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((cat) => (
                        <Badge
                          key={cat.id}
                          variant={selectedCategories.includes(cat.id) ? 'default' : 'outline'}
                          className="cursor-pointer transition-colors"
                          onClick={() => toggleCategory(cat.id)}
                        >
                          {selectedCategories.includes(cat.id) && <CheckCircle2 className="h-3 w-3 mr-1" />}
                          {!selectedCategories.includes(cat.id) && <XCircle className="h-3 w-3 mr-1 opacity-30" />}
                          {cat.name}
                        </Badge>
                      ))}
                      {categories.length === 0 && (
                        <p className="text-xs text-muted-foreground">No categories available</p>
                      )}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <Label className="text-sm font-medium">Preferred Price Range</Label>
                    <p className="text-xs text-muted-foreground mb-3">
                      Set your budget range for item recommendations
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <Label htmlFor="price-min" className="text-xs text-muted-foreground">Min ($)</Label>
                        <Input
                          id="price-min"
                          type="number"
                          min="0"
                          value={priceMin}
                          onChange={(e) => setPriceMin(e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <span className="text-muted-foreground mt-4">—</span>
                      <div className="flex-1">
                        <Label htmlFor="price-max" className="text-xs text-muted-foreground">Max ($)</Label>
                        <Input
                          id="price-max"
                          type="number"
                          min="0"
                          value={priceMax}
                          onChange={(e) => setPriceMax(e.target.value)}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={startEditing}>
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={updateProfile.isPending}>
                  {updateProfile.isPending ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Save Changes
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
