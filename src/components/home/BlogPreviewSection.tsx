'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Clock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useBlogPosts } from '@/hooks/use-blog-posts';

export default function BlogPreviewSection() {
  const { data: postsResponse } = useBlogPosts({ limit: '3' });
  const posts = postsResponse?.data ?? [];

  if (posts.length === 0) return null;

  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-3">Latest from the Blog</h2>
            <p className="text-muted-foreground">Insights, guides, and marketplace news</p>
          </div>
          <Link href="/blog" className="hidden sm:block">
            <Button variant="outline" size="sm" className="gap-2">
              View All
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog`}
              className="group rounded-xl border border-border bg-card overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              <div className="relative aspect-[16/9] w-full overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <Badge variant="secondary" className="text-xs">
                    {post.readTime} min read
                  </Badge>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {new Date(post.publishedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                <h3 className="font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                  {post.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {post.excerpt}
                </p>
              </div>
            </Link>
          ))}
        </div>
        <div className="text-center mt-8 sm:hidden">
          <Link href="/blog">
            <Button variant="outline" size="sm" className="gap-2">
              View All Posts
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
