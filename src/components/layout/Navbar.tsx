'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Diamond, LogOut, User, LayoutDashboard, Heart, Menu, ShoppingCart,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import MobileDrawer from './MobileDrawer';
import { useCart } from '@/features/cart/cart-context';

const loggedOutRoutes = [
  { href: '/', label: 'Home' },
  { href: '/explore', label: 'Explore' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/about', label: 'About' },
  { href: '/blog', label: 'Blog' },
  { href: '/help', label: 'Help' },
];

const loggedInRoutes = [
  { href: '/', label: 'Home' },
  { href: '/explore', label: 'Explore' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/items/add', label: 'Add Item' },
  { href: '/items/manage', label: 'Manage Items' },
  { href: '/ai/chat', label: 'AI Tools' },
  { href: '/about', label: 'About' },
  { href: '/profile', label: 'Profile' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const routes = user ? loggedInRoutes : loggedOutRoutes;

  function isActive(href: string) {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  }

  return (
    <>
      <nav className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur-md border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-xl font-bold text-foreground">
              <Diamond className="h-6 w-6 text-primary" />
              Horizon
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {routes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className={`relative px-3 py-2 text-sm font-medium transition-colors ${
                    isActive(route.href)
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {route.label}
                  {isActive(route.href) && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-primary rounded-full" />
                  )}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Link href="/cart" className="relative p-2 rounded-lg hover:bg-secondary transition-colors">
                <ShoppingCart className="h-5 w-5 text-foreground" />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                    {totalItems}
                  </span>
                )}
              </Link>
              <div className="hidden md:flex items-center gap-2">
                {user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={<button className="flex items-center gap-2 rounded-full px-3 py-1.5 hover:bg-secondary transition-colors" />}
                    >
                        <Avatar size="sm">
                          {user.avatar && <AvatarImage src={user.avatar} alt={user.name} />}
                          <AvatarFallback>
                            {user.name?.charAt(0)?.toUpperCase() || <User className="h-4 w-4" />}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium text-foreground hidden lg:block">{user.name}</span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem
                        render={<Link href="/profile" />}
                      >
                        <User className="h-4 w-4" />
                        Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        render={<Link href="/dashboard" />}
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        render={<Link href="/wishlist" />}
                      >
                        <Heart className="h-4 w-4" />
                        Wishlist
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem variant="destructive" onClick={logout}>
                        <LogOut className="h-4 w-4" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <>
                    <Link href="/auth/login">
                      <Button variant="ghost" size="sm">Login</Button>
                    </Link>
                    <Link href="/auth/register">
                      <Button size="sm">Register</Button>
                    </Link>
                  </>
                )}
              </div>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <button
                      onClick={() => setMobileOpen(true)}
                      className="md:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
                      aria-label="Open menu"
                    />
                  }
                >
                    <Menu className="h-5 w-5 text-foreground" />
                </TooltipTrigger>
                <TooltipContent>Menu</TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      </nav>

      <MobileDrawer
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        routes={routes}
      />
    </>
  );
}
