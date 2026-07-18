'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Star, MapPin, Heart, ShoppingCart } from 'lucide-react';
import type { Item } from '@/types';
import { useWishlist } from '@/features/wishlist/wishlist-context';
import { useCart } from '@/features/cart/cart-context';

interface ItemCardProps {
  item: Item;
}

export default function ItemCard({ item }: ItemCardProps) {
  const { toggleItem, isInWishlist } = useWishlist();
  const { addItem } = useCart();
  const wishlisted = isInWishlist(item.id);

  return (
    <div className="group h-full flex flex-col bg-card rounded-xl border border-border hover:shadow-lg transition-all duration-300 overflow-hidden">
      <Link href={`/items/${item.id}`} className="relative h-48 overflow-hidden">
        <Image
          src={item.images[0]}
          alt={item.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleItem(item);
          }}
          className="absolute top-2 right-2 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors"
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart
            className={`h-4 w-4 ${wishlisted ? 'fill-destructive text-destructive' : 'text-muted-foreground'}`}
          />
        </button>
      </Link>
      <div className="flex flex-col flex-1 p-4">
        <Link href={`/items/${item.id}`}>
          <h3 className="text-lg font-semibold text-foreground line-clamp-1 hover:text-primary transition-colors">
            {item.title}
          </h3>
        </Link>
        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
          {item.shortDescription}
        </p>
        <div className="mt-auto flex flex-col gap-2 pt-3">
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-primary">
              ${item.price.toFixed(2)}
            </span>
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              {item.rating.toFixed(1)}
            </span>
          </div>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            {item.location}
          </span>
          <div className="flex gap-2 mt-1">
            <Link href={`/items/${item.id}`} className="flex-1">
              <button className="w-full rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary transition-colors">
                View Details
              </button>
            </Link>
            <button
              onClick={() => addItem(item)}
              className="px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
              aria-label="Add to cart"
            >
              <ShoppingCart className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
