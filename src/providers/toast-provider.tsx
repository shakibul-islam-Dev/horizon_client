'use client';

import { Toaster } from '@/components/ui/sonner';
import { useTheme } from '@/providers/theme-provider';

export function ToastProvider() {
  const { theme } = useTheme();

  return (
    <Toaster
      theme={theme}
      position="top-right"
      toastOptions={{
        duration: 3000,
      }}
    />
  );
}
