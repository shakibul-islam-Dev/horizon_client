'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Diamond, Globe, MessageSquare, Camera, Briefcase, Send } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const quickLinks = [
  { href: '/', label: 'Home' },
  { href: '/explore', label: 'Explore' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/about', label: 'About' },
];

const companyLinks = [
  { href: '/about', label: 'About' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
  { href: '/help', label: 'Help' },
];

const supportLinks = [
  { href: '/help', label: 'Help Center' },
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/contact', label: 'Contact Support' },
  { href: '/explore', label: 'Browse Items' },
];

const socialLinks = [
  { icon: Globe, href: '#', label: 'Facebook' },
  { icon: MessageSquare, href: '#', label: 'Twitter' },
  { icon: Camera, href: '#', label: 'Instagram' },
  { icon: Briefcase, href: '#', label: 'LinkedIn' },
];

export default function Footer() {
  const [email, setEmail] = useState('');

  function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    setEmail('');
  }

  return (
    <footer className="bg-foreground/5 border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-12">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="flex-1"
            required
          />
          <Button type="submit">
            Subscribe
            <Send className="h-4 w-4" />
          </Button>
        </form>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 text-xl font-bold text-foreground">
              <Diamond className="h-6 w-6 text-primary" />
              Horizon
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your trusted marketplace for buying and selling quality products.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="rounded-lg bg-foreground/10 p-2 hover:bg-foreground/20 transition-colors text-muted-foreground hover:text-foreground"
                  aria-label={social.label}
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground mb-4">Company</h3>
            <ul className="space-y-2.5">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground mb-4">Support</h3>
            <ul className="space-y-2.5">
              {supportLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="my-12" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; 2025 Horizon Marketplace. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Built with Next.js
          </p>
        </div>
      </div>
    </footer>
  );
}
