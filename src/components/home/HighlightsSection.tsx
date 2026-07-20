'use client';

import { Zap, Shield, TrendingUp } from 'lucide-react';
import { useAbout } from '@/hooks/use-about';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Zap,
  Shield,
  TrendingUp,
};

export default function HighlightsSection() {
  const { data: aboutResponse } = useAbout();
  const highlights = aboutResponse?.data?.highlights ?? [];

  if (highlights.length === 0) return null;

  return (
    <section className="py-20 px-4 bg-secondary/5">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">Why Horizon?</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Built for modern marketplace experiences with performance and trust at the core
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {highlights.map((highlight) => {
            const Icon = iconMap[highlight.icon] || Zap;
            return (
              <div
                key={highlight.title}
                className="relative p-8 rounded-xl border border-border bg-card hover:shadow-lg transition-all duration-300 group"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg">{highlight.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                  {highlight.description}
                </p>
                <div className="pt-4 border-t border-border">
                  <p className="text-2xl font-bold text-primary">{highlight.stat}</p>
                  <p className="text-xs text-muted-foreground mt-1">{highlight.statLabel}</p>
              </div>
            </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
