'use client';

import { useState } from 'react';
import { checkoutApi } from '@/lib/api-services';
import { toast } from '@/components/ui/sonner';
import type { CheckoutLineItem } from '@/lib/api-services';

export function useCheckout() {
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  async function startCheckout(items: CheckoutLineItem[]) {
    if (!items.length) {
      toast.error('Nothing to check out');
      return;
    }

    setIsCheckingOut(true);
    try {
      const res = await checkoutApi.createSession(items);

      if (res.success && res.data?.url) {
        window.location.href = res.data.url;
        return;
      }

      toast.error(res.message || 'Failed to start checkout');
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Something went wrong. Please try again.',
      );
    } finally {
      setIsCheckingOut(false);
    }
  }

  return { startCheckout, isCheckingOut };
}
