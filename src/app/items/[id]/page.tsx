'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  Star, MapPin, Calendar, ChevronRight, Heart, Share2, ShoppingCart, ArrowLeft,
} from 'lucide-react';
import { useItem, useItems } from '@/hooks/use-items';
import { useReviews } from '@/hooks/use-reviews';
import { useCart } from '@/features/cart/cart-context';
import { useWishlist } from '@/features/wishlist/wishlist-context';
import ItemCard from '@/components/ui/ItemCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import type { Review } from '@/types';

type Tab = 'description' | 'specifications' | 'reviews';

export default function ItemDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState<Tab>('description');
  const { addItem } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();

  const { data: itemResponse, isLoading } = useItem(id);
  const item = itemResponse?.data ?? null;

  const { data: reviewsResponse } = useReviews(id);
  const itemReviews = reviewsResponse?.data ?? [];

  const { data: relatedResponse } = useItems(
    item?.category ? { category: item.category, limit: '4' } : undefined
  );
  const relatedItems = (relatedResponse?.data ?? []).filter(
    (i) => i.id !== id
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center gap-2">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-32" />
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-4">
              <Skeleton className="aspect-[4/3] w-full rounded-xl" />
              <div className="flex gap-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-20 w-20 rounded-lg" />
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-10 w-40" />
              <div className="flex items-center gap-3">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-56" />
              <div className="flex gap-3">
                <Skeleton className="h-12 w-48 rounded-lg" />
                <Skeleton className="h-12 w-48 rounded-lg" />
              </div>
              <Skeleton className="h-12 w-full rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="mb-6 text-6xl opacity-30">404</div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Item not found
            </h1>
            <p className="text-muted-foreground mb-8 max-w-md">
              The item you&apos;re looking for doesn&apos;t exist or has been removed.
            </p>
            <Link href="/explore">
              <Button variant="default">
                <ArrowLeft className="h-4 w-4" />
                Back to Explore
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link
            href="/explore"
            className="hover:text-foreground transition-colors"
          >
            Explore
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground font-medium line-clamp-1">
            {item.title}
          </span>
        </nav>

        {/* Main Content Grid */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-border bg-card">
              <Image
                src={item.images[selectedImage]}
                alt={item.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            {item.images.length > 1 && (
              <div className="flex gap-3">
                {item.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`h-20 w-20 overflow-hidden rounded-lg border-2 transition-all duration-200 ${
                      selectedImage === index
                        ? 'border-primary ring-2 ring-primary/30'
                        : 'border-border hover:border-muted'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${item.title} ${index + 1}`}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Item Info */}
          <div className="flex flex-col gap-6">
            <h1 className="text-3xl font-bold text-foreground">{item.title}</h1>

            <div className="text-4xl font-bold text-primary">
              ${item.price.toFixed(2)}
            </div>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(item.rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-muted-foreground'
                    }`}
                  />
                ))}
              </div>
              <span className="font-semibold text-foreground">
                {item.rating.toFixed(1)}
              </span>
              <span className="text-muted-foreground">
                ({item.reviewCount} reviews)
              </span>
            </div>

            {/* Category Badge */}
            <div>
              <Badge variant="secondary">
                {item.category}
              </Badge>
            </div>

            <Separator />

            {/* Location & Seller */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{item.location}</span>
              </div>
              <div className="flex items-center gap-3">
                <Avatar size="sm">
                  <AvatarImage src={''} alt={item.seller} />
                  <AvatarFallback>{item.seller.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">Sold by</span>
                  <span className="text-sm font-medium text-foreground">
                    {item.seller}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>
                  Listed{' '}
                  {new Date(item.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
            </div>

            <Separator />

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {item.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              <Button
                variant="default"
                size="lg"
                onClick={() => { if (item) addItem(item); }}
                className="w-full"
              >
                <ShoppingCart className="h-5 w-5" />
                Add to Cart
              </Button>
              <div className="flex gap-3">
                <Tooltip>
                  <TooltipTrigger
                    render={
                      <Button
                        variant={item && isInWishlist(item.id) ? 'secondary' : 'outline'}
                        size="lg"
                        className="flex-1"
                        onClick={() => { if (item) toggleItem(item); }}
                      />
                    }
                  >
                    <Heart
                      className={`h-5 w-5 ${item && isInWishlist(item.id) ? 'fill-current' : ''}`}
                    />
                    {item && isInWishlist(item.id) ? 'Wishlisted' : 'Add to Wishlist'}
                  </TooltipTrigger>
                  <TooltipContent>
                    {isInWishlist(item?.id ?? '') ? 'Remove from wishlist' : 'Add to wishlist'}
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger
                    render={
                      <Button variant="ghost" size="lg" />
                    }
                  >
                    <Share2 className="h-5 w-5" />
                    Share
                  </TooltipTrigger>
                  <TooltipContent>Share this item</TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-12">
          <Tabs
            value={[activeTab]}
            onValueChange={(val) => setActiveTab(val[0] as Tab)}
          >
            <TabsList variant="line">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="reviews">
                Reviews
                {itemReviews.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {itemReviews.length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="pt-8">
              <div className="prose max-w-none">
                <p className="text-foreground leading-relaxed whitespace-pre-line">
                  {item.fullDescription}
                </p>
              </div>
            </TabsContent>

            <TabsContent value="specifications" className="pt-8">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-1/3">Specification</TableHead>
                    <TableHead>Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(item.specifications).map(
                    ([key, value]) => (
                      <TableRow key={key}>
                        <TableCell className="font-medium text-foreground">
                          {key}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {value}
                        </TableCell>
                      </TableRow>
                    )
                  )}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="reviews" className="pt-8">
              <div className="space-y-6">
                {itemReviews.length === 0 ? (
                  <div className="py-12 text-center">
                    <p className="text-muted-foreground">No reviews yet for this item.</p>
                  </div>
                ) : (
                  itemReviews.map((review: Review) => (
                    <div
                      key={review.id}
                      className="rounded-xl border border-border bg-card p-6"
                    >
                      <div className="flex items-start gap-4">
                        <Avatar size="default">
                          <AvatarImage
                            src={review.userAvatar}
                            alt={review.userName}
                          />
                          <AvatarFallback>
                            {review.userName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-foreground">
                              {review.userName}
                            </h4>
                            <span className="text-xs text-muted-foreground">
                              {new Date(
                                review.createdAt
                              ).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-muted-foreground'
                                }`}
                              />
                            ))}
                          </div>
                          <p className="mt-3 text-sm text-foreground leading-relaxed">
                            {review.comment}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Items */}
        {relatedItems.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold text-foreground mb-8">
              Related Items
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {relatedItems.map((relatedItem) => (
                <ItemCard key={relatedItem.id} item={relatedItem} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
