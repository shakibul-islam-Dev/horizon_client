'use client';

import { createContext, useContext, useCallback, type ReactNode } from 'react';
import { toast } from '@/components/ui/sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cartApi } from '@/lib/api-services';
import { mapCartItem } from '@/lib/mappers';
import type { Item, CartItem } from '@/types';

interface CartContextType {
  items: CartItem[];
  addItem: (item: Item) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

function mapCartItems(raw: unknown): CartItem[] {
  if (!raw || typeof raw !== 'object') return [];
  const data = raw as Record<string, unknown>;
  const rawItems = data.items as Array<Record<string, unknown>> | undefined;
  if (!Array.isArray(rawItems)) return [];
  return rawItems.map((ci) => ({
    item: mapCartItem(ci.item),
    quantity: Number(ci.quantity ?? 1),
  }));
}

export function CartProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  const { data: cartResponse, isLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: () => cartApi.get(),
    retry: false,
  });

  const items = mapCartItems(cartResponse?.data);

  const addMutation = useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity?: number }) =>
      cartApi.addItem(itemId, quantity),
    onSuccess: (res) => {
      queryClient.setQueryData(['cart'], res);
      toast.success('Added to cart');
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to add to cart');
    },
  });

  const removeMutation = useMutation({
    mutationFn: cartApi.removeItem,
    onSuccess: (res) => {
      queryClient.setQueryData(['cart'], res);
      toast.success('Removed from cart');
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to remove from cart');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) =>
      cartApi.updateItem(itemId, quantity),
    onSuccess: (res) => {
      queryClient.setQueryData(['cart'], res);
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to update cart');
    },
  });

  const clearMutation = useMutation({
    mutationFn: cartApi.clear,
    onSuccess: (res) => {
      queryClient.setQueryData(['cart'], res);
      toast.success('Cart cleared');
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to clear cart');
    },
  });

  const addItem = useCallback(
    (item: Item) => {
      const existing = items.find((ci) => ci.item.id === item.id);
      if (existing) {
        updateMutation.mutate({ itemId: item.id, quantity: existing.quantity + 1 });
      } else {
        addMutation.mutate({ itemId: item.id, quantity: 1 });
      }
    },
    [items, addMutation, updateMutation]
  );

  const removeItem = useCallback(
    (itemId: string) => {
      removeMutation.mutate(itemId);
    },
    [removeMutation]
  );

  const updateQuantity = useCallback(
    (itemId: string, quantity: number) => {
      if (quantity <= 0) {
        removeMutation.mutate(itemId);
        return;
      }
      updateMutation.mutate({ itemId, quantity });
    },
    [updateMutation, removeMutation]
  );

  const clearCart = useCallback(() => {
    clearMutation.mutate();
  }, [clearMutation]);

  const totalItems = items.reduce((sum, ci) => sum + ci.quantity, 0);
  const totalPrice = items.reduce((sum, ci) => sum + ci.item.price * ci.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice, isLoading }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
}
