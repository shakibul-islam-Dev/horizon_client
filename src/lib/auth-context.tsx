'use client';

import { createContext, useContext, useCallback, type ReactNode } from 'react';
import { toast } from '@/components/ui/sonner';
import { authClient } from '@/lib/auth-client';
import type { User } from '@/types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function mapSessionUser(sessionUser: Record<string, unknown>): User {
  return {
    id: String(sessionUser.id ?? ''),
    name: String(sessionUser.name ?? sessionUser.email ?? ''),
    email: String(sessionUser.email ?? ''),
    avatar: String(sessionUser.image ?? sessionUser.avatar ?? ''),
    role: (sessionUser.role as 'user' | 'admin') ?? 'user',
    joinDate: String(sessionUser.createdAt ?? new Date().toISOString()),
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, isPending } = authClient.useSession();

  const user = session?.user ? mapSessionUser(session.user as Record<string, unknown>) : null;

  const login = useCallback(async (email: string, password: string) => {
    const { error } = await authClient.signIn.email({
      email,
      password,
    });
    if (error) {
      toast.error(error.message ?? 'Login failed');
      throw new Error(error.message);
    }
    toast.success('Welcome back!');
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const { error } = await authClient.signUp.email({
      name,
      email,
      password,
    });
    if (error) {
      toast.error(error.message ?? 'Registration failed');
      throw new Error(error.message);
    }
    toast.success('Account created successfully!');
  }, []);

  const loginWithGoogle = useCallback(async () => {
    const { error } = await authClient.signIn.social({
      provider: 'google',
    });
    if (error) {
      toast.error(error.message ?? 'Google sign-in failed');
      throw new Error(error.message);
    }
  }, []);

  const logout = useCallback(async () => {
    await authClient.signOut();
    toast.success('Logged out successfully');
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, loginWithGoogle, logout, isLoading: isPending }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
