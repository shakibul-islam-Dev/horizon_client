'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail('');
    }
  }

  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto bg-primary text-primary-foreground rounded-xl p-12">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-3">Stay in the Loop</h2>
          <p className="text-primary-foreground/80 mb-8">
            Get the latest deals and updates delivered to your inbox
          </p>

          {submitted ? (
            <p className="text-lg font-medium">Thanks for subscribing!</p>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="flex-1 h-10 bg-white/10 border-white/20 text-primary-foreground placeholder:text-primary-foreground/50"
              />
              <Button type="submit" variant="secondary" className="whitespace-nowrap">
                Subscribe
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
