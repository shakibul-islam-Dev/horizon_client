'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Heart, LogOut, User, ShoppingCart } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

interface NavRoute {
  href: string;
  label: string;
}

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
  routes: NavRoute[];
}

export default function MobileDrawer({ open, onClose, routes }: MobileDrawerProps) {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  function isActive(href: string) {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  }

  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <SheetContent side="right" showCloseButton={false} className="w-80 p-0">
        <SheetHeader className="border-b border-border px-4 h-16 flex flex-row items-center justify-between">
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>

        <div className="p-4 space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={`block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive(route.href)
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              }`}
            >
              {route.label}
            </Link>
          ))}
          {user && (
            <>
              <Link
                href="/dashboard"
                className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive('/dashboard')
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`}
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
              <Link
                href="/wishlist"
                className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive('/wishlist')
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`}
              >
                <Heart className="h-4 w-4" />
                Wishlist
              </Link>
              <Link
                href="/cart"
                className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive('/cart')
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`}
              >
                <ShoppingCart className="h-4 w-4" />
                Cart
              </Link>
            </>
          )}
        </div>

        <div className="absolute bottom-0 left-0 right-0 border-t border-border p-4">
          {user ? (
            <div className="space-y-2">
              <div className="flex items-center gap-3 px-3 py-2">
                <Avatar size="default">
                  {user.avatar && <AvatarImage src={user.avatar} alt={user.name} />}
                  <AvatarFallback>
                    {user.name?.charAt(0)?.toUpperCase() || <User className="h-4 w-4" />}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-foreground">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                className="w-full justify-start text-destructive hover:text-destructive"
                onClick={logout}
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <Link href="/auth/login" className="block">
                <Button variant="outline" className="w-full">Login</Button>
              </Link>
              <Link href="/auth/register" className="block">
                <Button className="w-full">Register</Button>
              </Link>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
