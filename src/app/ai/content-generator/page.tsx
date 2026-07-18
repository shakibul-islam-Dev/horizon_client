'use client';

import { Sparkles } from 'lucide-react';
import ContentGenerator from '@/components/ai/ContentGenerator';

export default function ContentGeneratorPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-1/4 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute top-40 right-1/4 h-96 w-96 rounded-full bg-secondary/5 blur-3xl" />
        </div>

        <div className="max-w-5xl mx-auto px-4 pt-16 pb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">AI Content Generator</h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Generate compelling content for your listings and marketing
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 pb-20">
        <ContentGenerator />
      </div>
    </div>
  );
}
