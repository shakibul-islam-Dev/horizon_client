'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { Mail, RefreshCw } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { authClient } from '@/lib/auth-client';

export default function EmailVerificationPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  function validate() {
    if (!email.trim()) return 'Email is required';
    if (!/\S+@\S+\.\S+/.test(email)) return 'Please enter a valid email';
    return '';
  }

  async function handleResend(e: FormEvent) {
    e.preventDefault();
    const err = validate();
    if (err) {
      toast.error(err);
      return;
    }

    setIsLoading(true);
    const { error } = await authClient.sendVerificationEmail({
      email,
      callbackURL: `${window.location.origin}/auth/login`,
    });
    setIsLoading(false);

    if (error) {
      toast.error(error.message ?? 'Failed to send verification email');
      return;
    }
    setSent(true);
    toast.success('Verification email sent');
  }

  if (sent) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md text-center">
          <Card>
            <CardContent className="pt-6">
              <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Mail className="h-7 w-7 text-primary" />
              </div>
              <h1 className="text-xl font-bold text-foreground mb-2">
                Check your email
              </h1>
              <p className="text-sm text-muted-foreground mb-6">
                We have sent a verification link to{' '}
                <strong className="text-foreground">{email}</strong>. Please
                check your inbox and click the link to activate your account.
              </p>
              <Link
                href="/auth/login"
                className="text-sm font-medium text-primary hover:underline"
              >
                Back to login
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold text-foreground">
            Horizon
          </Link>
          <h1 className="mt-4 text-2xl font-bold text-foreground">
            Verify your email
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Enter your email to resend the verification link
          </p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleResend} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                {isLoading ? 'Sending...' : 'Resend Verification Email'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          <Link
            href="/auth/login"
            className="font-medium text-primary hover:underline"
          >
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
}
