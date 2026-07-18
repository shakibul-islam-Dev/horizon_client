'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { SlidersHorizontal } from 'lucide-react';
import ItemCard from '@/components/ui/ItemCard';
import SearchBar from '@/components/ui/SearchBar';
import FilterPanel from '@/components/ui/FilterPanel';
import Pagination from '@/components/ui/Pagination';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { useItems } from '@/hooks/use-items';
import { useCategories } from '@/hooks/use-categories';
import type { Item } from '@/types';

const ITEMS_PER_PAGE = 8;

const sortItems = (items: Item[], sortBy: string): Item[] => {
  const sorted = [...items];
  switch (sortBy) {
    case 'price-low':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-high':
      return sorted.sort((a, b) => b.price - a.price);
    case 'rating':
      return sorted.sort((a, b) => b.rating - a.rating);
    case 'newest':
      return sorted.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    case 'popular':
      return sorted.sort((a, b) => b.reviewCount - a.reviewCount);
    default:
      return sorted;
  }
};

export default function ExploreContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [priceRange, setPriceRange] = useState<[number, number]>([
    Number(searchParams.get('minPrice')) || 0,
    Number(searchParams.get('maxPrice')) || 10000,
  ]);
  const [minRating, setMinRating] = useState(
    Number(searchParams.get('rating')) || 0
  );
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'popular');
  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get('page')) || 1
  );

  const apiParams: Record<string, string> = {};
  if (search) apiParams.search = search;
  if (category) apiParams.category = category;
  if (priceRange[0] > 0) apiParams.minPrice = String(priceRange[0]);
  if (priceRange[1] < 10000) apiParams.maxPrice = String(priceRange[1]);
  if (sortBy !== 'popular') {
    const sortMap: Record<string, string> = {
      'price-low': 'price',
      'price-high': 'price',
      'rating': 'rating',
      'newest': 'createdAt',
    };
    if (sortMap[sortBy]) apiParams.sortBy = sortMap[sortBy];
    if (sortBy === 'price-low') apiParams.order = 'asc';
    else if (sortBy === 'price-high') apiParams.order = 'desc';
    else if (sortBy === 'newest') apiParams.order = 'desc';
  }
  apiParams.page = String(currentPage);
  apiParams.limit = String(ITEMS_PER_PAGE);

  const { data: apiItemsData, isLoading: itemsLoading } = useItems(apiParams);
  const { data: apiCategoriesData } = useCategories();

  const allCategories = apiCategoriesData?.data ?? [];

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (category) params.set('category', category);
    if (priceRange[0] > 0) params.set('minPrice', String(priceRange[0]));
    if (priceRange[1] < 10000) params.set('maxPrice', String(priceRange[1]));
    if (minRating > 0) params.set('rating', String(minRating));
    if (sortBy !== 'popular') params.set('sort', sortBy);
    if (currentPage > 1) params.set('page', String(currentPage));

    const qs = params.toString();
    router.push(`/explore${qs ? `?${qs}` : ''}`, { scroll: false });
  }, [search, category, priceRange, minRating, sortBy, currentPage, router]);

  const filteredItems = useMemo(() => {
    const allItems: Item[] = apiItemsData?.data ?? [];
    let result = allItems;

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.shortDescription.toLowerCase().includes(q) ||
          item.fullDescription.toLowerCase().includes(q)
      );
    }

    if (category) {
      result = result.filter((item) => item.category === category);
    }

    result = result.filter(
      (item) => item.price >= priceRange[0] && item.price <= priceRange[1]
    );

    if (minRating > 0) {
      result = result.filter((item) => item.rating >= minRating);
    }

    return sortItems(result, sortBy);
  }, [apiItemsData, search, category, priceRange, minRating, sortBy]);

  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const activeFilterCount = [
    category !== '',
    priceRange[0] > 0,
    priceRange[1] < 10000,
    minRating > 0,
  ].filter(Boolean).length;

  const handleSearch = (query: string) => {
    setSearch(query);
    setCurrentPage(1);
  };

  const handleReset = () => {
    setSearch('');
    setCategory('');
    setPriceRange([0, 10000]);
    setMinRating(0);
    setSortBy('popular');
    setCurrentPage(1);
  };

  const handleCategoryChange = (cat: string) => {
    setCategory(cat);
    setCurrentPage(1);
  };

  const handleMinRatingChange = (rating: number) => {
    setMinRating(rating);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Explore Products
          </h1>
          <SearchBar onSearch={handleSearch} placeholder="Search for items..." />
        </div>

        <div className="flex gap-8">
          <aside className="hidden w-64 shrink-0 lg:block">
            <div className="sticky top-24 rounded-xl border border-border bg-card p-6">
              <FilterPanel
                category={category}
                priceRange={priceRange}
                minRating={minRating}
                sortBy={sortBy}
                onCategoryChange={handleCategoryChange}
                onPriceRangeChange={setPriceRange}
                onMinRatingChange={handleMinRatingChange}
                onSortChange={setSortBy}
                onReset={handleReset}
                categories={allCategories}
              />
            </div>
          </aside>

          <div className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <p className="text-sm text-muted-foreground">
                  {itemsLoading
                    ? 'Loading...'
                    : `${filteredItems.length} item${filteredItems.length !== 1 ? 's' : ''} found`}
                </p>
                {activeFilterCount > 0 && (
                  <Badge variant="secondary">
                    {activeFilterCount} filter{activeFilterCount !== 1 ? 's' : ''} active
                  </Badge>
                )}
              </div>

              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-accent transition-colors lg:hidden"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
              </button>

              <div className="lg:hidden">
                <Select value={sortBy} onValueChange={(val) => { if (val) setSortBy(val); setCurrentPage(1); }}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {itemsLoading ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="flex flex-col gap-3">
                    <Skeleton className="aspect-[4/3] w-full rounded-xl" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-6 w-1/3" />
                  </div>
                ))}
              </div>
            ) : paginatedItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="mb-6 text-6xl opacity-30">
                  <span>🔍</span>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  No items found
                </h3>
                <p className="text-muted-foreground max-w-md">
                  We couldn&apos;t find any items matching your search criteria.
                  Try adjusting your filters or search terms.
                </p>
                <Button variant="default" className="mt-6" onClick={handleReset}>
                  Clear All Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {paginatedItems.map((item) => (
                  <ItemCard key={item.id} item={item} />
                ))}
              </div>
            )}

            {!itemsLoading && totalPages > 1 && (
              <div className="mt-10">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-80 max-w-[85vw] bg-card p-6 overflow-y-auto shadow-xl">
            <FilterPanel
              category={category}
              priceRange={priceRange}
              minRating={minRating}
              sortBy={sortBy}
              onCategoryChange={handleCategoryChange}
              onPriceRangeChange={setPriceRange}
              onMinRatingChange={handleMinRatingChange}
              onSortChange={setSortBy}
              onReset={handleReset}
              onClose={() => setMobileFiltersOpen(false)}
              categories={allCategories}
            />
          </div>
        </div>
      )}
    </div>
  );
}
