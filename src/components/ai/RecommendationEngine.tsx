'use client';

import { useState } from 'react';
import { ChevronRight, ChevronLeft, Check, Sparkles } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { aiApi } from '@/lib/api-services';
import { useCategories } from '@/hooks/use-categories';
import { useInterestTags } from '@/hooks/use-interest-tags';
import ItemCard from '@/components/ui/ItemCard';
import type { Item } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Progress, ProgressLabel, ProgressValue } from '@/components/ui/progress';

const analysisMessages = [
  'Analyzing your category preferences...',
  'Matching with similar users...',
  'Applying AI scoring algorithm...',
  'Generating personalized recommendations...',
  'Ranking results by relevance...',
  'Finalizing your recommendations...',
];

function mapItem(raw: Record<string, unknown>): Item {
  const cat = raw.category as Record<string, unknown> | string | undefined;
  const author = raw.author as Record<string, unknown> | string | undefined;
  return {
    id: String(raw._id ?? raw.id ?? ''),
    title: String(raw.title ?? ''),
    shortDescription: String(raw.shortDescription ?? ''),
    fullDescription: String(raw.fullDescription ?? ''),
    price: Number(raw.price ?? 0),
    category: typeof cat === 'object' ? String((cat as Record<string, unknown>)?.slug || (cat as Record<string, unknown>)?.name || '') : String(cat ?? ''),
    images: (raw.images as string[]) || [],
    rating: Number(raw.rating ?? 0),
    reviewCount: Number(raw.reviewCount ?? 0),
    location: String(raw.location ?? ''),
    seller: typeof author === 'object' ? String((author as Record<string, unknown>)?.name || '') : String(author ?? ''),
    createdAt: String(raw.createdAt ?? ''),
    tags: (raw.tags as string[]) || [],
    specifications: (raw.specifications as Record<string, string>) || {},
  };
}

export default function RecommendationEngine() {
  const [step, setStep] = useState(1);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<Item[]>([]);
  const [analysisMsgIndex, setAnalysisMsgIndex] = useState(0);
  const [analysisProgress, setAnalysisProgress] = useState(0);

  const { data: categoriesResponse } = useCategories();
  const categories = categoriesResponse?.data ?? [];

  const { data: interestTagsResponse } = useInterestTags();
  const interestTags = interestTagsResponse?.data ?? [];

  const totalSteps = 5;

  const handleCategoryToggle = (catId: string) => {
    if (selectedCategoryId === catId) {
      setSelectedCategoryId('');
    } else {
      setSelectedCategoryId(catId);
    }
  };

  const handleInterestToggle = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  const startAnalysis = async () => {
    setStep(4);
    setAnalysisProgress(0);
    setAnalysisMsgIndex(0);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setAnalysisProgress(Math.min(progress, 90));
      setAnalysisMsgIndex(Math.min(Math.floor(progress / 18), analysisMessages.length - 1));
    }, 200);

    try {
      const res = await aiApi.getRecommendations({
        categoryId: selectedCategoryId || undefined,
        priceRange: { min: priceRange[0], max: priceRange[1] },
        limit: 6,
      });
      clearInterval(interval);
      setAnalysisProgress(100);
      if (res.success && res.data) {
        const rawRecommendations = res.data.recommendations || res.data;
        if (Array.isArray(rawRecommendations)) {
          setRecommendations(rawRecommendations.map(mapItem));
        } else {
          setRecommendations([]);
        }
      } else {
        toast.error(res.message || 'Failed to get recommendations');
        setRecommendations([]);
      }
    } catch {
      clearInterval(interval);
      setAnalysisProgress(100);
      toast.error('Failed to get recommendations');
      setRecommendations([]);
    }
    setStep(5);
  };

  const resetWizard = () => {
    setStep(1);
    setSelectedCategoryId('');
    setPriceRange([0, 2000]);
    setSelectedInterests([]);
    setRecommendations([]);
    setAnalysisProgress(0);
    setAnalysisMsgIndex(0);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-muted-foreground">Step {Math.min(step, totalSteps)} of {totalSteps}</span>
          <span className="text-sm text-muted-foreground">{Math.round((Math.min(step, totalSteps) / totalSteps) * 100)}% complete</span>
        </div>
        <Progress value={(Math.min(step, totalSteps) / totalSteps) * 100}>
          <ProgressLabel>Step {Math.min(step, totalSteps)} of {totalSteps}</ProgressLabel>
          <ProgressValue />
        </Progress>
      </CardHeader>

      <CardContent className="min-h-[350px] sm:min-h-[420px]">
        {step === 1 && (
          <div className="animate-in fade-in">
            <h3 className="text-xl font-semibold text-foreground mb-2">What are you looking for?</h3>
            <p className="text-muted-foreground text-sm mb-6">Select a category to narrow down recommendations.</p>
            <div className="flex flex-wrap gap-3">
              {categories.map((cat) => (
                <Badge
                  key={cat.id}
                  variant={selectedCategoryId === cat.id ? 'default' : 'outline'}
                  className="cursor-pointer px-5 py-3 text-sm"
                  onClick={() => handleCategoryToggle(cat.id)}
                >
                  {selectedCategoryId === cat.id && <Check className="inline h-4 w-4 mr-1.5 -mt-0.5" />}
                  {cat.name}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-in fade-in">
            <h3 className="text-xl font-semibold text-foreground mb-2">What is your budget?</h3>
            <p className="text-muted-foreground text-sm mb-6">Set a price range to find products within your budget.</p>
            <div className="space-y-6">
              <div className="flex items-center justify-between text-sm text-foreground font-medium">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-muted-foreground">Minimum Price</label>
                  <input
                    type="range"
                    min={0}
                    max={2000}
                    step={10}
                    value={priceRange[0]}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (val <= priceRange[1]) setPriceRange([val, priceRange[1]]);
                    }}
                    className="w-full h-2 bg-secondary/20 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Maximum Price</label>
                  <input
                    type="range"
                    min={0}
                    max={2000}
                    step={10}
                    value={priceRange[1]}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (val >= priceRange[0]) setPriceRange([priceRange[0], val]);
                    }}
                    className="w-full h-2 bg-secondary/20 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                {[[0, 100], [100, 500], [500, 1000], [1000, 2000]].map(([min, max]) => (
                  <Badge
                    key={`${min}-${max}`}
                    variant={priceRange[0] === min && priceRange[1] === max ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => setPriceRange([min, max])}
                  >
                    ${min} - ${max}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-in fade-in">
            <h3 className="text-xl font-semibold text-foreground mb-2">Select your interests</h3>
            <p className="text-muted-foreground text-sm mb-6">Choose tags that match what you enjoy. This helps us refine recommendations.</p>
            <div className="flex flex-wrap gap-2">
              {interestTags.map((interest) => (
                <Badge
                  key={interest}
                  variant={selectedInterests.includes(interest) ? 'default' : 'outline'}
                  className="cursor-pointer px-4 py-2 text-sm"
                  onClick={() => handleInterestToggle(interest)}
                >
                  {interest}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="animate-in fade-in flex flex-col items-center justify-center py-8">
            <div className="relative mb-8">
              <div className="h-20 w-20 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
              <Sparkles className="absolute inset-0 m-auto h-8 w-8 text-primary animate-pulse" />
            </div>
            <p className="text-foreground font-medium text-lg mb-2">{analysisMessages[analysisMsgIndex]}</p>
            <div className="w-64 mt-4">
              <Progress value={analysisProgress}>
                <ProgressLabel>{analysisMessages[analysisMsgIndex]}</ProgressLabel>
                <ProgressValue />
              </Progress>
              <p className="text-center text-xs text-muted-foreground mt-2">{analysisProgress}% complete</p>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="animate-in fade-in">
            <h3 className="text-xl font-semibold text-foreground mb-1">Your Recommendations</h3>
            <p className="text-muted-foreground text-sm mb-6">Based on your preferences, we think you will love these.</p>
            {recommendations.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {recommendations.map((item) => (
                  <div key={item.id} className="relative">
                    <ItemCard item={item} />
                    <div className="mt-2 px-1">
                      <p className="text-xs text-muted-foreground italic">
                        <Sparkles className="inline h-3 w-3 mr-1 text-primary" />
                        Recommended for you
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No items match your criteria. Try adjusting your preferences.</p>
              </div>
            )}
          </div>
        )}
      </CardContent>

      <div className="px-4 sm:px-6 py-4 border-t border-border flex items-center justify-between">
        {step > 1 && step < 4 ? (
          <Button
            variant="outline"
            onClick={() => setStep(step - 1)}
            size="sm"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </Button>
        ) : step === 5 ? (
          <Button
            variant="outline"
            onClick={resetWizard}
            size="sm"
          >
            <Sparkles className="h-4 w-4" />
            Refine Results
          </Button>
        ) : (
          <div />
        )}

        {step < 4 && (
          <Button
            onClick={() => {
              if (step === 3) {
                startAnalysis();
              } else {
                setStep(step + 1);
              }
            }}
            size="sm"
          >
            {step === 3 ? 'Get Recommendations' : 'Continue'}
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </Card>
  );
}
