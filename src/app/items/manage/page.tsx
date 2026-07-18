'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from '@/components/ui/sonner';
import { useAuth } from '@/lib/auth-context';
import { useMyListings, useDeleteItem } from '@/hooks/use-items';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/EmptyState';

import { Eye, Trash2, Package, Plus, Search, LayoutGrid, List, Star, MapPin } from 'lucide-react';

export default function ManageItemsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const { data: listingsResponse, isLoading: listingsLoading } = useMyListings(1, 100);
  const deleteItem = useDeleteItem();

  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const allItems = listingsResponse?.data ?? [];
  const isLoading = listingsLoading;

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user) return null;

  const filteredItems = allItems.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  function handleDelete(id: string) {
    deleteItem.mutate(id, {
      onSuccess: () => {
        setDeleteTarget(null);
        toast.success('Item deleted successfully');
      },
      onError: (err) => {
        toast.error(err instanceof Error ? err.message : 'Failed to delete item');
      },
    });
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Package className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Manage Items</h1>
              <p className="text-sm text-muted-foreground">
                Showing {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <Link href="/items/add">
            <Button>
              <Plus className="h-4 w-4" />
              Add New Item
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : allItems.length === 0 ? (
          <EmptyState
            icon={Package}
            title="You haven't added any items yet"
            description="Start selling by listing your first item on the marketplace."
            action={{ label: 'Add Your First Item', onClick: () => router.push('/items/add') }}
          />
        ) : (
          <>
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center gap-1 rounded-lg border border-border p-1">
                <button
                  onClick={() => setViewMode('table')}
                  className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                    viewMode === 'table'
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent'
                  }`}
                >
                  <List className="h-4 w-4" />
                  Table
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent'
                  }`}
                >
                  <LayoutGrid className="h-4 w-4" />
                  Grid
                </button>
              </div>
            </div>

            {filteredItems.length === 0 ? (
              <div className="rounded-xl border border-border bg-card py-12 text-center">
                <Search className="mx-auto h-10 w-10 text-muted-foreground" />
                <h3 className="mt-3 text-lg font-semibold text-foreground">No items found</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Try adjusting your search query.
                </p>
              </div>
            ) : viewMode === 'table' ? (
              <div className="rounded-xl border border-border bg-card">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[72px]">Image</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div className="relative h-12 w-12 rounded-lg overflow-hidden">
                            <Image
                              src={item.images[0] || 'https://picsum.photos/seed/item/48/48'}
                              alt={item.title}
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          </div>
                        </TableCell>
                        <TableCell className="font-medium text-foreground max-w-[200px] truncate">
                          {item.title}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {item.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-semibold text-foreground">
                          ${item.price.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <span className="flex items-center gap-1 text-muted-foreground">
                            <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                            {item.rating.toFixed(1)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-1">
                            <Link href={`/items/${item.id}`}>
                              <button className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/10 transition-colors">
                                <Eye className="h-4 w-4" />
                                View
                              </button>
                            </Link>
                            <button
                              onClick={() => setDeleteTarget(item.id)}
                              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl border border-border bg-card overflow-hidden hover:shadow-lg transition-all duration-300"
                  >
                    <div className="relative h-44 w-full overflow-hidden">
                      <Image
                        src={item.images[0] || 'https://picsum.photos/seed/item/400/200'}
                        alt={item.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-foreground line-clamp-1">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                        {item.shortDescription}
                      </p>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-lg font-bold text-primary">
                          ${item.price.toFixed(2)}
                        </span>
                        <span className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          {item.rating.toFixed(1)}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5" />
                        {item.location}
                      </div>
                      <div className="mt-4 flex items-center gap-2">
                        <Link href={`/items/${item.id}`} className="flex-1">
                          <Button variant="outline" size="sm" className="w-full">
                            <Eye className="h-4 w-4" />
                            View
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:bg-destructive/10"
                          onClick={() => setDeleteTarget(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <Dialog open={deleteTarget !== null} onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Item</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this item? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" size="sm" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              disabled={deleteItem.isPending}
              onClick={() => deleteTarget && handleDelete(deleteTarget)}
            >
              <Trash2 className="h-4 w-4" />
              {deleteItem.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
