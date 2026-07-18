'use client';

import { ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useCart } from './cart-context';

interface StickyCartButtonProps {
  onClick: () => void;
}

export function StickyCartButton({ onClick }: StickyCartButtonProps) {
  const { totalItems } = useCart();

  return (
    <AnimatePresence>
      {totalItems > 0 && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          onClick={onClick}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 rounded-full bg-primary text-primary-foreground shadow-lg hover:opacity-90 transition-opacity"
        >
          <ShoppingBag className="h-5 w-5" />
          <motion.span
            key={totalItems}
            initial={{ scale: 1.5 }}
            animate={{ scale: 1 }}
            className="font-bold text-sm"
          >
            {totalItems}
          </motion.span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
