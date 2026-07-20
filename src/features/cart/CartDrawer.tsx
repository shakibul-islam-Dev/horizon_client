'use client';

import { Trash2, Minus, Plus, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from './cart-context';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, removeItem, updateQuantity, totalPrice, totalItems } = useCart();

  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <SheetContent side="right" showCloseButton={true}>
        <SheetHeader>
          <SheetTitle>Shopping Cart</SheetTitle>
          <SheetDescription>
            {totalItems > 0 ? `${totalItems} item${totalItems === 1 ? '' : 's'} in your cart` : 'Your cart is empty'}
          </SheetDescription>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex items-center justify-center px-4 py-12">
            <EmptyState
              icon={ShoppingBag}
              title="Your cart is empty"
              description="Start exploring products to add items to your cart."
              action={{ label: 'Explore Products', onClick: () => { onClose(); window.location.href = '/explore'; } }}
            />
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-4 space-y-3">
              {items.map(({ item, quantity }) => (
                <div key={item.id} className="flex items-center gap-3 py-2">
                  <div className="relative h-14 w-14 rounded-lg bg-secondary shrink-0 overflow-hidden">
                    {item.images[0] && (
                      <Image
                        src={item.images[0]}
                        alt={item.title}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/items/${item.id}`}
                      onClick={onClose}
                      className="text-sm font-medium text-foreground hover:text-primary transition-colors line-clamp-1"
                    >
                      {item.title}
                    </Link>
                    <p className="text-xs text-muted-foreground">${item.price.toFixed(2)}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => updateQuantity(item.id, quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-6 text-center text-xs font-medium text-foreground">{quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => updateQuantity(item.id, quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-primary">${(item.price * quantity).toFixed(2)}</p>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <Separator />

            <div className="px-4 py-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">Total</span>
                <span className="text-lg font-bold text-primary">${totalPrice.toFixed(2)}</span>
              </div>
              <Link href="/cart" onClick={onClose} className="block">
                <Button className="w-full" size="lg">
                  View Full Cart & Checkout
                </Button>
              </Link>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
