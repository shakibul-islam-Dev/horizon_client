'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Minus, Plus, ShoppingBag, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from '@/components/ui/sonner';
import { useCart } from '@/features/cart/cart-context';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

export default function CartPage() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, totalPrice } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  async function handleCheckout() {
    setIsCheckingOut(true);
    try {
      const res = await fetch('/api/checkout_sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(({ item, quantity }) => ({
            title: item.title,
            price: item.price,
            quantity,
          })),
        }),
      });
      const data = await res.json();
      if (data.success && data.data?.url) {
        window.location.href = data.data.url;
      } else {
        toast.error(data.error ?? 'Failed to start checkout');
      }
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsCheckingOut(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <EmptyState
          icon={ShoppingBag}
          title="Your cart is empty"
          description="Start exploring products to add items to your cart."
          action={{ label: 'Explore Products', onClick: () => router.push('/explore') }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/explore" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mb-2">
              <ArrowLeft className="h-3 w-3" /> Continue Shopping
            </Link>
            <h1 className="text-3xl font-bold text-foreground">Shopping Cart</h1>
          </div>
          <Badge variant="secondary">{items.length} {items.length === 1 ? 'item' : 'items'}</Badge>
        </div>

        <div className="space-y-0 mb-8">
          {items.map(({ item, quantity }, index) => (
            <div key={item.id}>
              <div className="rounded-xl border border-border bg-card p-4 flex items-center gap-4">
                <div className="relative h-20 w-20 rounded-lg bg-secondary shrink-0 overflow-hidden">
                  <Image
                    src={item.images[0]}
                    alt={item.title}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <Link href={`/items/${item.id}`} className="font-semibold text-foreground hover:text-primary transition-colors line-clamp-1">
                    {item.title}
                  </Link>
                  <p className="text-sm text-muted-foreground">${item.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateQuantity(item.id, quantity - 1)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center text-sm font-medium text-foreground">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateQuantity(item.id, quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <p className="font-semibold text-primary w-20 text-right">${(item.price * quantity).toFixed(2)}</p>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeItem(item.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
              {index < items.length - 1 && <Separator className="my-0" />}
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-lg font-semibold text-foreground">Total</span>
            <span className="text-2xl font-bold text-primary">${totalPrice.toFixed(2)}</span>
          </div>
          <Button size="lg" className="w-full" onClick={handleCheckout} disabled={isCheckingOut}>
            {isCheckingOut ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Redirecting to checkout...
              </>
            ) : (
              'Proceed to Checkout'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
