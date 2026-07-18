'use client';

import { Shield, Truck, Headphones, Zap } from 'lucide-react';
import { useAbout } from '@/hooks/use-about';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Shield,
  Truck,
  Headphones,
  Zap,
};

export default function FeaturesSection() {
  const { data: aboutResponse } = useAbout();
  const features = aboutResponse?.data?.features ?? [];

  if (features.length === 0) return null;

  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {features.map((feature) => {
            const Icon = iconMap[feature.icon] || Shield;
            return (
              <div
                key={feature.title}
                className="p-6 rounded-xl border border-border hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
