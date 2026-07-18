'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { authClient } from '@/lib/auth-client';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  function validate() {
    if (!email.trim()) return 'Email is required';
    if (!/\S+@\S+\.\S+/.test(email)) return 'Please enter a valid email';
    return '';
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const err = validate();
    setError(err);
    if (err) return;

    setIsLoading(true);
    const { error: resetError } = await authClient.requestPasswordReset({
      email,
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
    setIsLoading(false);

    if (resetError) {
      toast.error(resetError.message ?? 'Failed to send reset link');
      return;
    }
    setSent(true);
    toast.success('Reset link sent to your email');
  }

  if (sent) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md text-center">
          <Card>
            <CardContent className="pt-6">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <h1 className="text-xl font-bold text-foreground mb-2">Check your email</h1>
              <p className="text-sm text-muted-foreground mb-6">
                We have sent a password reset link to <strong className="text-foreground">{email}</strong>
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
          <h1 className="mt-4 text-2xl font-bold text-foreground">Forgot password?</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Enter your email and we will send you a reset link
          </p>
        </div>

        <Card>
          <CardContent className="pt-6">
            {error && (
              <div className="mb-4 rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
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
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          <Link href="/auth/login" className="inline-flex items-center gap-1 font-medium text-primary hover:underline">
            <ArrowLeft className="h-3 w-3" />
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
}
