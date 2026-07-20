'use client';

import { useState } from 'react';
import { StickyCartButton } from '@/features/cart/StickyCartButton';
import { CartDrawer } from '@/features/cart/CartDrawer';

export default function CartButtonWrapper() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <StickyCartButton onClick={() => setOpen(true)} />
      <CartDrawer open={open} onClose={() => setOpen(false)} />
    </>
  );
}
