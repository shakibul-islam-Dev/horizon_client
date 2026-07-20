'use client';

import { Brain } from 'lucide-react';
import RecommendationEngine from '@/components/ai/RecommendationEngine';

export default function RecommendationsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-1/3 h-72 w-72 rounded-full bg-secondary/5 blur-3xl" />
          <div className="absolute top-40 right-1/3 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        </div>

        <div className="max-w-5xl mx-auto px-4 pt-16 pb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0">
              <Brain className="h-5 w-5 text-secondary" />
            </div>
            <h1 className="text-xl sm:text-3xl font-bold text-foreground">Smart Recommendations</h1>
          </div>
          <p className="text-muted-foreground text-sm sm:text-lg max-w-2xl">
            Let AI find the perfect products for you
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 pb-20">
        <RecommendationEngine />
      </div>
    </div>
  );
}
