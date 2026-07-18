'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useAbout } from '@/hooks/use-about';

function formatNumber(value: number): string {
  if (value >= 1000) {
    return value.toLocaleString();
  }
  return String(value);
}

export default function StatsSection() {
  const { data: aboutResponse } = useAbout();
  const aboutStats = aboutResponse?.data?.statistics ?? [];
  const stats = aboutStats.map((s) => ({
    label: s.label,
    value: parseInt(s.value.replace(/[^0-9]/g, ''), 10) || 0,
    suffix: s.suffix || s.value.replace(/[0-9]/g, ''),
  }));

  const [counts, setCounts] = useState(stats.map(() => 0));
  const [hasAnimated, setHasAnimated] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const animateCounters = useCallback(() => {
    const duration = 2000;
    const startTime = performance.now();

    function update(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      setCounts(stats.map((stat) => Math.floor(eased * stat.value)));

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }, [stats]);

  useEffect(() => {
    if (stats.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          animateCounters();
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated, animateCounters, stats.length]);

  if (stats.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      className="py-20 px-4 bg-secondary/5"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, index) => (
            <div key={stat.label}>
              <div className="text-4xl md:text-5xl font-bold text-accent mb-2">
                {formatNumber(counts[index])}{stat.suffix}
              </div>
              <div className="text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
