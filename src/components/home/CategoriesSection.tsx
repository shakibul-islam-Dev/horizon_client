'use client';

import Link from 'next/link';
import { useCategories } from '@/hooks/use-categories';
import {
  Laptop,
  Smartphone,
  Home,
  Shirt,
  Gamepad2,
  BookOpen,
  Bike,
  Camera,
  Music,
  Dumbbell,
  Armchair,
  Baby,
  Dog,
  Flower2,
  ToolCase,
  Heart,
} from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  laptop: Laptop,
  smartphone: Smartphone,
  home: Home,
  shirt: Shirt,
  gamepad: Gamepad2,
  book: BookOpen,
  bike: Bike,
  camera: Camera,
  music: Music,
  dumbbell: Dumbbell,
  armchair: Armchair,
  baby: Baby,
  dog: Dog,
  flower: Flower2,
  tool: ToolCase,
  heart: Heart,
};

export default function CategoriesSection() {
  const { data: apiResponse } = useCategories();
  const allCategories = apiResponse?.data ?? [];

  if (allCategories.length === 0) return null;

  return (
    <section className="py-20 px-4 bg-secondary/5">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Browse Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {allCategories.map((category) => {
            const Icon = iconMap[category.icon] || Laptop;
            return (
              <Link
                key={category.slug}
                href={`/explore?category=${category.slug}`}
                className="group p-6 rounded-xl border border-border bg-card hover:scale-105 hover:bg-primary/5 transition-all duration-200"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-1">{category.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {category.itemCount} items
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
