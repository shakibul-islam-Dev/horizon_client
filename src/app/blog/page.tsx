'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { useBlogPosts } from '@/hooks/use-blog-posts';
import type { BlogPost } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function BlogPage() {
  const { data: apiResponse, isLoading } = useBlogPosts();
  const allPosts: BlogPost[] = (apiResponse?.data as BlogPost[]) ?? [];

  const featured = allPosts[0];
  const remaining = allPosts.slice(1);

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <section className="bg-gradient-to-r from-primary/10 via-background to-accent/10 py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Skeleton className="h-12 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
        </section>
        <section className="py-16 px-4 bg-background">
          <div className="max-w-7xl mx-auto">
            <Skeleton className="h-[400px] w-full rounded-xl" />
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-r from-primary/10 via-background to-accent/10 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Horizon Blog
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Insights, tips, and updates from the Horizon team. Stay informed
            about the latest in e-commerce and our platform.
          </p>
        </div>
      </section>

      {featured && (
        <section className="py-16 px-4 bg-background">
          <div className="max-w-7xl mx-auto">
            <Link href={`/blog/${featured.id}`} className="block group">
              <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="relative overflow-hidden">
                    <Image
                      src={featured.image}
                      alt={featured.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <CardContent className="p-8">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {featured.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold mb-3 group-hover:text-primary transition-colors">
                      {featured.title}
                    </h2>
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      {featured.excerpt}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs">
                            {featured.author.split(' ').map((n) => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span>{featured.author}</span>
                      </div>
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        {formatDate(featured.publishedAt)}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        {featured.readTime} min read
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary group-hover:gap-2.5 transition-all">
                      Read More <ArrowRight className="h-4 w-4" />
                    </span>
                  </CardContent>
                </div>
              </Card>
            </Link>
          </div>
        </section>
      )}

      <Separator />

      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold mb-8">Latest Articles</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {remaining.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.id}`}
                className="group"
              >
                <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
                  <div className="relative overflow-hidden">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <CardContent className="p-5 flex flex-col flex-1">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {post.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground pt-3 border-t border-border">
                      <div className="flex items-center gap-1.5">
                        <Avatar className="h-5 w-5">
                          <AvatarFallback className="text-[10px]">
                            {post.author.split(' ').map((n) => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span>{post.author}</span>
                      </div>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(post.publishedAt)}
                      </span>
                      <span className="flex items-center gap-1 ml-auto">
                        <Clock className="h-3 w-3" />
                        {post.readTime} min
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
