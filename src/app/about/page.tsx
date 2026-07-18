'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Diamond, Shield, Lightbulb, Users, Star, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorState } from '@/components/ui/ErrorState';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { getAboutData, type AboutData } from '@/services/about';

const valueIcons = [Shield, Lightbulb, Users, Star] as const;

export default function AboutPage() {
  const [data, setData] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  function fetchData() {
    setError(false);
    getAboutData()
      .then((res) => {
        if (res.success && res.data) {
          setData(res.data);
        } else {
          setError(true);
        }
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    let cancelled = false;
    getAboutData()
      .then((res) => {
        if (cancelled) return;
        if (res.success && res.data) {
          setData(res.data);
        } else {
          setError(true);
        }
      })
      .catch(() => { if (!cancelled) setError(true); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-24 space-y-8">
          <div className="space-y-4 text-center">
            <Skeleton className="h-12 w-64 mx-auto" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <Skeleton className="h-64 w-full" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
          <Separator />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardHeader className="space-y-2">
                  <Skeleton className="h-14 w-14 rounded-full mx-auto" />
                  <Skeleton className="h-5 w-32 mx-auto" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
          <Separator />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-56 w-full" />
                <CardContent className="space-y-2 pt-6">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-24" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <ErrorState onRetry={fetchData} />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="min-h-screen">
      <section className="relative bg-gradient-to-r from-primary/10 via-background to-accent/10 py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Diamond className="h-12 w-12 text-primary mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-6">
            {data.title}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {data.description}
          </p>
        </div>
      </section>

      <section className="py-20 px-4 bg-background">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-6">Our Story</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">{data.description}</p>
            <p className="text-muted-foreground leading-relaxed">{data.mission}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {data.statistics.map((stat) => (
              <Card key={stat.label} className="bg-primary/10 border-0">
                <CardContent className="p-6 text-center">
                  <p className="text-3xl font-bold text-primary">{stat.value}</p>
                  <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Separator />

      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto text-center mb-12">
          <Badge variant="secondary" className="mb-4">Our Purpose</Badge>
          <h2 className="text-3xl font-bold text-foreground mb-4">Our Mission</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">{data.mission}</p>
        </div>
      </section>

      <Separator />

      <section className="py-20 px-4 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">What We Stand For</Badge>
            <h2 className="text-3xl font-bold text-foreground mb-4">Our Values</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">These core principles guide every decision we make.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {data.values.map((value, i) => {
              const Icon = valueIcons[i] || Shield;
              return (
                <Card key={value.title} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="pt-8 pb-6 px-8">
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
                      <Icon className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">{value.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{value.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <Separator />

      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">The People</Badge>
            <h2 className="text-3xl font-bold text-foreground mb-4">Meet the Team</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">The passionate people behind Horizon.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {data.team.map((member) => (
              <Card key={member.name} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="flex justify-center pt-6">
                  <Avatar className="h-40 w-40">
                    <AvatarImage src={member.image} alt={member.name} className="object-cover" />
                    <AvatarFallback>{member.name.split(' ').map((n) => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                </div>
                <CardContent className="text-center pb-6">
                  <h3 className="text-lg font-semibold text-foreground">{member.name}</h3>
                  <p className="text-sm text-primary mt-1">{member.role}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Separator />

      <section className="py-20 px-4 bg-background">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">Join Our Community</h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Whether you are looking to discover unique products or grow your business, Horizon is the place for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/explore">
              <Button size="lg" className="text-base px-8 py-6">
                Explore Products
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg" className="text-base px-8 py-6">
                Get in Touch
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
