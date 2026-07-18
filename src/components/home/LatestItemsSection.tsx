'use client';

import Link from 'next/link';
import { useItems } from '@/hooks/use-items';
import ItemCard from '@/components/ui/ItemCard';
import { Button } from '@/components/ui/button';

export default function LatestItemsSection() {
  const { data: apiResponse } = useItems({ sortBy: 'rating', order: 'desc', limit: '4' });
  const featuredItems = apiResponse?.data ?? [];

  if (featuredItems.length === 0) return null;

  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">Featured Items</h2>
          <p className="text-muted-foreground">Handpicked products just for you</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredItems.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
        <div className="text-center mt-10">
          <Link href="/explore">
            <Button variant="outline" size="lg">
              View All Products
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
