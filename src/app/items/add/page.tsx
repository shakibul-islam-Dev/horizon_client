'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from '@/components/ui/sonner';
import { useAuth } from '@/lib/auth-context';
import { useCreateItem } from '@/hooks/use-items';
import { useCategories } from '@/hooks/use-categories';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';

import { Package, Plus, X, ImagePlus } from 'lucide-react';

interface FormErrors {
  title?: string;
  shortDescription?: string;
  fullDescription?: string;
  price?: string;
  category?: string;
  location?: string;
}

export default function AddItemPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const createItem = useCreateItem();
  const { data: categoriesResponse } = useCategories();
  const categories = categoriesResponse?.data ?? [];

  const [title, setTitle] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [fullDescription, setFullDescription] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [location, setLocation] = useState('');
  const [imageUrls, setImageUrls] = useState<string[]>(['']);
  const [tags, setTags] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});

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

  function addImageUrl() {
    setImageUrls([...imageUrls, '']);
  }

  function removeImageUrl(index: number) {
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  }

  function updateImageUrl(index: number, value: string) {
    const updated = [...imageUrls];
    updated[index] = value;
    setImageUrls(updated);
  }

  function validate(): boolean {
    const newErrors: FormErrors = {};

    if (!title.trim() || title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }
    if (!shortDescription.trim() || shortDescription.trim().length < 10) {
      newErrors.shortDescription = 'Short description must be at least 10 characters';
    }
    if (!fullDescription.trim() || fullDescription.trim().length < 20) {
      newErrors.fullDescription = 'Full description must be at least 20 characters';
    }
    if (!price.trim() || isNaN(Number(price)) || Number(price) < 0) {
      newErrors.price = 'Please enter a valid price (0 or more)';
    }
    if (!categoryId) {
      newErrors.category = 'Please select a category';
    }
    if (!location.trim()) {
      newErrors.location = 'Location is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    const filteredImages = imageUrls.filter((url) => url.trim());
    const tagsArray = tags.split(',').map((t) => t.trim()).filter(Boolean);

    try {
      await createItem.mutateAsync({
        title: title.trim(),
        shortDescription: shortDescription.trim(),
        fullDescription: fullDescription.trim(),
        price: Number(price),
        category: categoryId,
        location: location.trim(),
        images: filteredImages.length > 0 ? filteredImages : ['https://picsum.photos/seed/item/600/400'],
        tags: tagsArray,
      });
      toast.success('Item added successfully!');
      router.push('/items/manage');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to add item');
    }
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="mx-auto max-w-2xl px-4">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Package className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Add New Item</h1>
            <p className="text-sm text-muted-foreground">List your item on the Horizon marketplace</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="e.g. Vintage Leather Jacket"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                {errors.title && (
                  <p className="text-xs text-destructive">{errors.title}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="shortDescription">Short Description</Label>
                <Textarea
                  id="shortDescription"
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  placeholder="A brief summary of your item..."
                />
                {errors.shortDescription && (
                  <p className="text-xs text-destructive">{errors.shortDescription}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="fullDescription">Full Description</Label>
                <Textarea
                  id="fullDescription"
                  value={fullDescription}
                  onChange={(e) => setFullDescription(e.target.value)}
                  placeholder="Provide a detailed description of your item..."
                  className="min-h-[120px]"
                />
                {errors.fullDescription && (
                  <p className="text-xs text-destructive">{errors.fullDescription}</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pricing & Category</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="0.00"
                  min={0}
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
                {errors.price && (
                  <p className="text-xs text-destructive">{errors.price}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label>Category</Label>
                <Select value={categoryId} onValueChange={(val) => { if (val) setCategoryId(val); }}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && <p className="text-xs text-destructive">{errors.category}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="e.g. New York, NY"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
                {errors.location && (
                  <p className="text-xs text-destructive">{errors.location}</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Images</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {imageUrls.map((url, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="flex-1">
                    <div className="relative">
                      <ImagePlus className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="https://example.com/image.jpg"
                        value={url}
                        onChange={(e) => updateImageUrl(index, e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  {imageUrls.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeImageUrl(index)}
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border text-muted-foreground hover:border-destructive hover:text-destructive transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addImageUrl}
                className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add another image
              </button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1.5">
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input
                  id="tags"
                  placeholder="e.g. vintage, leather, handmade"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createItem.isPending}
            >
              <Plus className="h-4 w-4" />
              {createItem.isPending ? 'Adding...' : 'Add Item'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
