'use client';

import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FilterPanelProps {
  category: string;
  priceRange: [number, number];
  minRating: number;
  sortBy: string;
  onCategoryChange: (category: string) => void;
  onPriceRangeChange: (range: [number, number]) => void;
  onMinRatingChange: (rating: number) => void;
  onSortChange: (sort: string) => void;
  onReset: () => void;
  onClose?: () => void;
  categories: { id: string; name: string; slug: string; itemCount: number }[];
}

export default function FilterPanel({
  category,
  priceRange,
  minRating,
  sortBy,
  onCategoryChange,
  onPriceRangeChange,
  onMinRatingChange,
  onSortChange,
  onReset,
  onClose,
  categories,
}: FilterPanelProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Filters</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={onReset}
            className="text-sm text-primary hover:text-primary-dark transition-colors"
          >
            Reset All
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-accent transition-colors md:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {/* Sort */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-foreground">Sort By</label>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          <option value="popular">Most Popular</option>
          <option value="newest">Newest</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="rating">Highest Rated</option>
        </select>
      </div>

      {/* Category */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-foreground">Category</label>
        <div className="flex flex-col gap-1">
          <button
            onClick={() => onCategoryChange('')}
            className={`rounded-lg px-3 py-2 text-left text-sm transition-colors ${
              category === ''
                ? 'bg-primary/10 text-primary font-medium'
                : 'text-foreground hover:bg-accent'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => onCategoryChange(cat.slug)}
              className={`rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                category === cat.slug
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-foreground hover:bg-accent'
              }`}
            >
              {cat.name}
              <span className="ml-1 text-muted-foreground">({cat.itemCount})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="flex flex-col gap-3">
        <label className="text-sm font-medium text-foreground">
          Price Range
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={priceRange[0]}
            onChange={(e) =>
              onPriceRangeChange([Number(e.target.value), priceRange[1]])
            }
            min={0}
            max={priceRange[1]}
            className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            placeholder="Min"
          />
          <span className="text-muted-foreground">-</span>
          <input
            type="number"
            value={priceRange[1]}
            onChange={(e) =>
              onPriceRangeChange([priceRange[0], Number(e.target.value)])
            }
            min={priceRange[0]}
            className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            placeholder="Max"
          />
        </div>
        <input
          type="range"
          min={0}
          max={10000}
          step={50}
          value={priceRange[1]}
          onChange={(e) =>
            onPriceRangeChange([priceRange[0], Number(e.target.value)])
          }
          className="w-full accent-primary"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>${priceRange[0].toLocaleString()}</span>
          <span>${priceRange[1].toLocaleString()}</span>
        </div>
      </div>

      {/* Minimum Rating */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-foreground">
          Minimum Rating
        </label>
        <div className="flex flex-col gap-1">
          {[0, 3, 3.5, 4, 4.5].map((rating) => (
            <button
              key={rating}
              onClick={() => onMinRatingChange(rating)}
              className={`rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                minRating === rating
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-foreground hover:bg-accent'
              }`}
            >
              {rating === 0 ? 'Any Rating' : `${rating}+ Stars`}
            </button>
          ))}
        </div>
      </div>

      <Button variant="outline" onClick={onReset} className="w-full">
        Clear All Filters
      </Button>
    </div>
  );
}
