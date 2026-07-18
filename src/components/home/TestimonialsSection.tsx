'use client';

import { useState, useEffect } from 'react';
import { Quote } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';
import { useAbout } from '@/hooks/use-about';

export default function TestimonialsSection() {
  const { data: aboutResponse } = useAbout();
  const testimonials = aboutResponse?.data?.testimonials ?? [];
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (testimonials.length === 0) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  if (testimonials.length === 0) return null;

  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-12">What Our Users Say</h2>

        <div className="relative min-h-[300px] flex items-center justify-center">
          {testimonials.map((t, index) => (
            <div
              key={index}
              className={`absolute inset-0 flex flex-col items-center transition-opacity duration-500 ${
                index === current ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              <Card className="max-w-2xl w-full">
                <CardContent className="flex flex-col items-center text-center pt-6">
                  <Quote className="w-10 h-10 text-primary/20 mb-6" />
                  <p className="text-lg md:text-xl italic text-muted-foreground mb-6 max-w-2xl">
                    &ldquo;{t.quote}&rdquo;
                  </p>

                  <Badge variant="secondary" className="mb-6 gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </Badge>

                  <Avatar size="lg" className="mb-3">
                    <AvatarImage src={t.avatar} alt={t.name} />
                    <AvatarFallback>{t.name.split(' ').map((n) => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <p className="font-semibold">{t.name}</p>
                  <p className="text-sm text-muted-foreground">{t.role}</p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        <div className="flex justify-center gap-3 mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === current
                  ? 'bg-primary scale-110'
                  : 'bg-primary/30 hover:bg-primary/50'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
