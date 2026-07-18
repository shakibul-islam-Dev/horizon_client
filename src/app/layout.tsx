import type { Metadata } from 'next';
import { ThemeProvider } from '@/providers/theme-provider';
import { ToastProvider } from '@/providers/toast-provider';
import { AuthProvider } from '@/lib/auth-context';
import { QueryProvider } from '@/providers/query-provider';
import { CartProvider } from '@/features/cart/cart-context';
import { WishlistProvider } from '@/features/wishlist/wishlist-context';
import { TooltipProvider } from '@/components/ui/tooltip';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartButtonWrapper from './CartButtonWrapper';
import './globals.css';

export const metadata: Metadata = {
  title: 'Horizon Marketplace',
  description: 'Buy and sell quality products on Horizon',
};

const themeScript = `
  (function() {
    try {
      var t = localStorage.getItem('theme');
      var d = t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches);
      if (d) document.documentElement.classList.add('dark');
    } catch(e) {}
  })()
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen flex flex-col font-sans antialiased">
        <ThemeProvider>
          <TooltipProvider>
            <ToastProvider />
            <AuthProvider>
              <QueryProvider>
                <CartProvider>
                  <WishlistProvider>
                    <Navbar />
                    <main className="flex-1">{children}</main>
                    <Footer />
                    <CartButtonWrapper />
                  </WishlistProvider>
                </CartProvider>
              </QueryProvider>
            </AuthProvider>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
