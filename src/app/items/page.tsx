"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { SlidersHorizontal, X, Sparkles } from "lucide-react";
import ItemCard from "@/components/ui/ItemCard";
import SearchBar from "@/components/ui/SearchBar";
import FilterPanel from "@/components/ui/FilterPanel";
import Pagination from "@/components/ui/Pagination";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useItems } from "@/hooks/use-items";
import { useCategories } from "@/hooks/use-categories";
import type { Item } from "@/types";

const ITEMS_PER_PAGE = 12;

const sortItems = (items: Item[], sortBy: string): Item[] => {
  const sorted = [...items];
  switch (sortBy) {
    case "price-low":
      return sorted.sort((a, b) => a.price - b.price);
    case "price-high":
      return sorted.sort((a, b) => b.price - a.price);
    case "rating":
      return sorted.sort((a, b) => b.rating - a.rating);
    case "newest":
      return sorted.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    case "popular":
      return sorted.sort((a, b) => b.reviewCount - a.reviewCount);
    default:
      return sorted;
  }
};

export default function ItemsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [priceRange, setPriceRange] = useState<[number, number]>([
    Number(searchParams.get("minPrice")) || 0,
    Number(searchParams.get("maxPrice")) || 0,
  ]);
  const [minRating, setMinRating] = useState(
    Number(searchParams.get("rating")) || 0,
  );
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "popular");
  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get("page")) || 1,
  );

  // Push state to URL
  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (category) params.set("category", category);
    if (priceRange[0] > 0) params.set("minPrice", String(priceRange[0]));
    if (priceRange[1] > 0) params.set("maxPrice", String(priceRange[1]));
    if (minRating > 0) params.set("rating", String(minRating));
    if (sortBy !== "popular") params.set("sort", sortBy);
    if (currentPage > 1) params.set("page", String(currentPage));

    const qs = params.toString();
    router.replace(`/items${qs ? `?${qs}` : ""}`, { scroll: false });
  }, [search, category, priceRange, minRating, sortBy, currentPage, router]);

  const apiParams: Record<string, string> = {};
  if (search) apiParams.search = search;
  if (category) apiParams.category = category;
  if (priceRange[0] > 0) apiParams.minPrice = String(priceRange[0]);
  if (priceRange[1] > 0) apiParams.maxPrice = String(priceRange[1]);
  if (minRating > 0) apiParams.rating = String(minRating);
  if (sortBy !== "popular") {
    const sortMap: Record<string, string> = {
      "price-low": "price",
      "price-high": "price",
      rating: "rating",
      newest: "createdAt",
    };
    if (sortMap[sortBy]) apiParams.sortBy = sortMap[sortBy];
    if (sortBy === "price-low") apiParams.order = "asc";
    else if (sortBy === "price-high") apiParams.order = "desc";
    else if (sortBy === "newest") apiParams.order = "desc";
  }
  apiParams.page = String(currentPage);
  apiParams.limit = String(ITEMS_PER_PAGE);

  const {
    data: apiItemsData,
    isLoading: itemsLoading,
    isError,
    error,
  } = useItems(apiParams);
  const { data: apiCategoriesData } = useCategories();

  const allItems: Item[] = useMemo(() => apiItemsData?.data ?? [], [apiItemsData]);
  const allCategories = apiCategoriesData?.data ?? [];

  const dynamicMaxPrice = useMemo(() => {
    if (allItems.length === 0) return 10000;
    const max = Math.max(...allItems.map((i) => i.price || 0));
    return max > 0 ? Math.ceil(max / 100) * 100 + 100 : 10000;
  }, [allItems]);

  const resolvedMaxPrice = priceRange[1] > 0 ? priceRange[1] : dynamicMaxPrice;

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const item of allItems) {
      if (item.category) counts[item.category] = (counts[item.category] || 0) + 1;
    }
    return counts;
  }, [allItems]);

  const filteredItems = useMemo(() => {
    let result = allItems;

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.shortDescription.toLowerCase().includes(q) ||
          item.fullDescription.toLowerCase().includes(q),
      );
    }

    if (category) {
      result = result.filter((item) => item.category === category);
    }

    result = result.filter(
      (item) => item.price >= priceRange[0] && item.price <= resolvedMaxPrice,
    );

    if (minRating > 0) {
      result = result.filter((item) => item.rating >= minRating);
    }

    return sortItems(result, sortBy);
  }, [allItems, search, category, priceRange, resolvedMaxPrice, minRating, sortBy]);

  const totalItems =
    apiItemsData?.meta && typeof apiItemsData.meta.total === "number"
      ? apiItemsData.meta.total
      : filteredItems.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const paginatedItems = (apiItemsData?.meta && typeof apiItemsData.meta.total === "number"
    ? filteredItems
    : filteredItems.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE,
      ));

  const activeFilterCount = [
    category !== "",
    priceRange[0] > 0,
    priceRange[1] > 0,
    minRating > 0,
  ].filter(Boolean).length;

  const handleSearch = (query: string) => {
    setSearch(query);
    setCurrentPage(1);
  };

  const handleReset = () => {
    setSearch("");
    setCategory("");
    setPriceRange([0, 0]);
    setMinRating(0);
    setSortBy("popular");
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
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 md:py-24 px-4">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-10 left-1/4 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute top-20 right-1/4 h-80 w-80 rounded-full bg-accent/5 blur-3xl" />
        </div>
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
              <Sparkles className="h-4 w-4" />
              Discover Products
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground mb-4">
              Browse Items
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Explore a curated collection of quality products from trusted
              sellers around the world.
            </p>
            <div className="max-w-2xl mx-auto">
              <SearchBar onSearch={handleSearch} initialValue={search} />
            </div>
          </motion.div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 pb-20">
        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden w-64 shrink-0 lg:block">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="sticky top-24 rounded-xl border border-border bg-card p-6"
            >
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
                maxPrice={dynamicMaxPrice}
                categoryCounts={categoryCounts}
              />
            </motion.div>
          </aside>

          <div className="flex-1">
            {/* Toolbar */}
            <div className="mb-6 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <p className="text-sm text-muted-foreground">
                  {itemsLoading
                    ? "Loading..."
                    : `${filteredItems.length} item${filteredItems.length !== 1 ? "s" : ""} found`}
                </p>
                {activeFilterCount > 0 && (
                  <Badge variant="secondary">
                    {activeFilterCount} filter
                    {activeFilterCount !== 1 ? "s" : ""} active
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setMobileFiltersOpen(true)}
                  className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-accent transition-colors lg:hidden"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters
                </button>

                <Select
                  value={sortBy}
                  onValueChange={(val) => {
                    if (val) {
                      setSortBy(val);
                      setCurrentPage(1);
                    }
                  }}
                >
                  <SelectTrigger className="w-48 hidden lg:flex">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="price-low">
                      Price: Low to High
                    </SelectItem>
                    <SelectItem value="price-high">
                      Price: High to Low
                    </SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Items Grid */}
            {itemsLoading ? (
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                  <div key={i} className="flex flex-col gap-3">
                    <Skeleton className="aspect-[4/3] w-full rounded-xl" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-6 w-1/3" />
                  </div>
                ))}
              </motion.div>
            ) : isError ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <div className="mb-6 text-6xl opacity-30">⚠️</div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Failed to load items
                </h3>
                <p className="text-muted-foreground max-w-md mb-6">
                  {error instanceof Error
                    ? error.message
                    : "Something went wrong. Please try again."}
                </p>
                <Button
                  variant="default"
                  onClick={() => {
                    setCurrentPage(1);
                    setSearch("");
                    setCategory("");
                  }}
                >
                  Try Again
                </Button>
              </motion.div>
            ) : paginatedItems.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <div className="mb-6 text-6xl opacity-30">🔍</div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  No items found
                </h3>
                <p className="text-muted-foreground max-w-md">
                  We couldn&apos;t find any items matching your search criteria.
                  Try adjusting your filters or search terms.
                </p>
                <Button
                  variant="default"
                  className="mt-6"
                  onClick={handleReset}
                >
                  Clear All Filters
                </Button>
              </motion.div>
            ) : (
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: { staggerChildren: 0.05 },
                  },
                }}
              >
                <AnimatePresence mode="popLayout">
                  {paginatedItems.map((item) => (
                    <motion.div
                      key={item.id}
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: {
                          opacity: 1,
                          y: 0,
                          transition: { duration: 0.4, ease: "easeOut" },
                        },
                      }}
                    >
                      <ItemCard item={item} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}

            {/* Pagination */}
            {!itemsLoading && totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-10 flex justify-center"
              >
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Mobile Filters */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] lg:hidden bg-black/50"
              onClick={() => setMobileFiltersOpen(false)}
            />
            <motion.div
              key="mobile-filters"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-80 max-w-[85vw] bg-card z-[60] overflow-y-auto shadow-xl lg:hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-foreground">
                    Filters
                  </h3>
                  <button
                    onClick={() => setMobileFiltersOpen(false)}
                    className="p-2 rounded-lg hover:bg-secondary transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
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
                  maxPrice={dynamicMaxPrice}
                  categoryCounts={categoryCounts}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
