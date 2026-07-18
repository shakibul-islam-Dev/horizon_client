'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Lock, CheckCircle } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { authClient } from '@/lib/auth-client';

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [reset, setReset] = useState(false);
  const [error, setError] = useState('');

  function validate() {
    if (!token) return 'Invalid or missing reset token';
    if (!password) return 'Password is required';
    if (password.length < 6) return 'Password must be at least 6 characters';
    if (password !== confirmPassword) return 'Passwords do not match';
    return '';
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const err = validate();
    setError(err);
    if (err) return;

    setIsLoading(true);
    const { error: resetError } = await authClient.resetPassword({
      newPassword: password,
      token: token ?? undefined,
    });
    setIsLoading(false);

    if (resetError) {
      toast.error(resetError.message ?? 'Failed to reset password');
      return;
    }
    setReset(true);
    toast.success('Password reset successfully');
  }

  if (!token) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md text-center">
          <Card>
            <CardContent className="pt-6">
              <h1 className="text-xl font-bold text-foreground mb-2">Invalid Link</h1>
              <p className="text-sm text-muted-foreground mb-6">
                This password reset link is invalid or has expired.
              </p>
              <Link href="/auth/forgot-password">
                <Button className="w-full">Request a new link</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (reset) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md text-center">
          <Card>
            <CardContent className="pt-6">
              <div className="h-12 w-12 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-6 w-6 text-success" />
              </div>
              <h1 className="text-xl font-bold text-foreground mb-2">Password reset</h1>
              <p className="text-sm text-muted-foreground mb-6">
                Your password has been reset successfully.
              </p>
              <Link href="/auth/login">
                <Button className="w-full">Sign in</Button>
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
          <h1 className="mt-4 text-2xl font-bold text-foreground">Reset password</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Enter your new password
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
                <Label htmlFor="password">New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="At least 6 characters"
                    className="pl-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    className="pl-10"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Resetting...' : 'Reset Password'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
