'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { useWishlist } from '@/features/wishlist/wishlist-context';
import { useCart } from '@/features/cart/cart-context';
import { EmptyState } from '@/components/ui/EmptyState';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function WishlistPage() {
  const router = useRouter();
  const { items: wishlistItems, toggleItem, clearWishlist } = useWishlist();
  const { addItem } = useCart();

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <EmptyState
          icon={Heart}
          title="Your wishlist is empty"
          description="Save your favorite items to your wishlist."
                  action={{ label: 'Explore Products', onClick: () => router.push('/explore') }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-foreground">My Wishlist</h1>
            <Badge variant="secondary">{wishlistItems.length}</Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearWishlist}
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-3 w-3" />
            Clear all
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistItems.map((item) => (
            <Card key={item.id} className="group overflow-hidden hover:shadow-lg transition-shadow">
              <Link href={`/items/${item.id}`}>
                <div className="relative h-48 bg-secondary flex items-center justify-center overflow-hidden">
                  <Image
                    src={item.images[0]}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </Link>
              <CardContent className="p-4">
                <Link href={`/items/${item.id}`}>
                  <h3 className="font-semibold text-foreground line-clamp-1 hover:text-primary transition-colors">{item.title}</h3>
                </Link>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{item.shortDescription}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-lg font-bold text-primary">${item.price.toFixed(2)}</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => toggleItem(item)}
                      className="p-2 rounded-lg text-destructive hover:bg-destructive/10 transition-colors"
                      aria-label="Remove from wishlist"
                    >
                      <Heart className="h-4 w-4 fill-current" />
                    </button>
                    <button
                      onClick={() => addItem(item)}
                      className="p-2 rounded-lg text-primary hover:bg-primary/10 transition-colors"
                      aria-label="Add to cart"
                    >
                      <ShoppingBag className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
