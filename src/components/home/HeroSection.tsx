'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAbout } from '@/hooks/use-about';

export default function HeroSection() {
  const { data: aboutResponse } = useAbout();
  const slides = aboutResponse?.data?.heroSlides ?? [];
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (slides.length === 0) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  if (slides.length === 0) return null;

  return (
    <section className="relative w-full h-[60vh] min-h-[400px] max-h-[600px] bg-gradient-to-r from-primary/10 via-background to-accent/10 flex items-center justify-center overflow-hidden">
      <div className="relative w-full h-full flex items-center justify-center">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 flex flex-col items-center justify-center text-center px-4 transition-opacity duration-500 ${
              index === current ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
              {slide.title}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-8">
              {slide.subtitle}
            </p>
            <Link href={slide.href}>
              <Button size="lg" className="text-lg px-8 py-6">
                {slide.cta}
              </Button>
            </Link>
          </div>
        ))}
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === current
                ? 'bg-primary scale-110'
                : 'bg-primary/30 hover:bg-primary/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
