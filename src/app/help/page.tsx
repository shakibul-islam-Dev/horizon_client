'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Search,
  UserCog,
  ShoppingCart,
  Store,
  CreditCard,
  Truck,
  RotateCcw,
  HelpCircle,
  MessageCircle,
} from 'lucide-react';
import { useAbout } from '@/hooks/use-about';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  'Account & Login': UserCog,
  'Buying Guide': ShoppingCart,
  'Selling Guide': Store,
  'Payments': CreditCard,
  'Shipping': Truck,
  'Returns': RotateCcw,
};

export default function HelpPage() {
  const [search, setSearch] = useState('');
  const { data: aboutResponse } = useAbout();
  const topics = aboutResponse?.data?.helpTopics ?? [];
  const faqs = aboutResponse?.data?.helpFaq ?? [];

  const filteredTopics = topics.filter(
    (t) =>
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-r from-primary/10 via-background to-accent/10 py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Help Center
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Find answers to your questions and learn how to get the most out of
            Horizon.
          </p>
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search for help topics..."
              className="pl-11"
            />
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-background">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-8">Popular Topics</h2>
          <Accordion className="space-y-4">
            {filteredTopics.map((topic, index) => {
              const Icon = iconMap[topic.title] || HelpCircle;
              return (
                <AccordionItem
                  key={topic.title}
                  value={`topic-${index}`}
                  className="bg-card border border-border rounded-xl overflow-hidden px-5"
                >
                  <AccordionTrigger className="hover:no-underline py-5">
                    <div className="flex items-center gap-4 text-left">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold">{topic.title}</h3>
                        <p className="text-sm text-muted-foreground truncate">
                          {topic.description}
                        </p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pb-5">
                      {topic.details.map((detail, i) => {
                        const colonIndex = detail.indexOf(' \u2014 ');
                        const heading = colonIndex >= 0 ? detail.substring(0, colonIndex) : detail;
                        const body = colonIndex >= 0 ? detail.substring(colonIndex + 3) : '';
                        return (
                          <div key={i}>
                            <h4 className="font-medium text-sm">
                              {heading}
                            </h4>
                            {body && (
                              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                                {body}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
          {filteredTopics.length === 0 && (
            <div className="text-center py-12">
              <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">
                No topics found matching &ldquo;{search}&rdquo;
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-8">Frequently Asked Questions</h2>
          <Accordion className="space-y-3">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`faq-${index}`}
                className="bg-card border border-border rounded-xl overflow-hidden px-5"
              >
                <AccordionTrigger className="hover:no-underline py-5">
                  <h3 className="font-medium text-left">{faq.question}</h3>
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-muted-foreground leading-relaxed pb-5">
                    {faq.answer}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <section className="py-16 px-4 bg-background">
        <div className="max-w-2xl mx-auto text-center">
          <MessageCircle className="h-10 w-10 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-3">Still Need Help?</h2>
          <p className="text-muted-foreground mb-6">
            Our support team is available Monday through Friday, 9AM to 6PM EST.
            We typically respond within a few hours.
          </p>
          <Link href="/contact">
            <Button size="lg" className="px-8">
              Contact Support
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
