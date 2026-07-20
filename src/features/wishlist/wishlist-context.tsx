'use client';

import { createContext, useContext, useCallback, type ReactNode } from 'react';
import { toast } from '@/components/ui/sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { wishlistApi } from '@/lib/api-services';
import { mapCartItem } from '@/lib/mappers';
import type { Item } from '@/types';

interface WishlistContextType {
  items: Item[];
  toggleItem: (item: Item) => void;
  isInWishlist: (itemId: string) => boolean;
  clearWishlist: () => void;
  isLoading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

function mapWishlistItems(raw: unknown): Item[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((entry: Record<string, unknown>) => mapCartItem(entry.item));
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  const { data: wishlistResponse, isLoading } = useQuery({
    queryKey: ['wishlist'],
    queryFn: () => wishlistApi.get(1, 50),
    retry: false,
  });

  const items = mapWishlistItems(wishlistResponse?.data);

  const addMutation = useMutation({
    mutationFn: wishlistApi.add,
    onSuccess: (res) => {
      queryClient.setQueryData(['wishlist'], res);
      toast.success('Added to wishlist');
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to add to wishlist');
    },
  });

  const removeMutation = useMutation({
    mutationFn: wishlistApi.remove,
    onSuccess: (res) => {
      queryClient.setQueryData(['wishlist'], res);
      toast.success('Removed from wishlist');
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to remove from wishlist');
    },
  });

  const clearMutation = useMutation({
    mutationFn: wishlistApi.clear,
    onSuccess: (res) => {
      queryClient.setQueryData(['wishlist'], res);
      toast.success('Wishlist cleared');
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to clear wishlist');
    },
  });

  const toggleItem = useCallback(
    (item: Item) => {
      const exists = items.some((i) => i.id === item.id);
      if (exists) {
        removeMutation.mutate(item.id);
      } else {
        addMutation.mutate(item.id);
      }
    },
    [items, addMutation, removeMutation]
  );

  const isInWishlist = useCallback(
    (itemId: string) => {
      return items.some((i) => i.id === itemId);
    },
    [items]
  );

  const clearWishlist = useCallback(() => {
    clearMutation.mutate();
  }, [clearMutation]);

  return (
    <WishlistContext.Provider value={{ items, toggleItem, isInWishlist, clearWishlist, isLoading }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within a WishlistProvider');
  return context;
}
