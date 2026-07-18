'use client';

import { useRouter } from 'next/navigation';
import { StickyCartButton } from '@/features/cart/StickyCartButton';

export default function CartButtonWrapper() {
  const router = useRouter();
  return <StickyCartButton onClick={() => router.push('/cart')} />;
}
