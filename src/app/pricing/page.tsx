'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Check, X, ArrowRight } from 'lucide-react';
import { useAbout } from '@/hooks/use-about';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function PricingPage() {
  const [yearly, setYearly] = useState(false);
  const { data: aboutResponse } = useAbout();
  const plans = aboutResponse?.data?.pricingPlans ?? [];
  const comparisons = aboutResponse?.data?.pricingComparisons ?? [];
  const faqs = aboutResponse?.data?.pricingFaq ?? [];

  return (
    <div className="min-h-screen bg-background">
      <section className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-10 left-1/4 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute top-20 right-1/4 h-80 w-80 rounded-full bg-accent/5 blur-3xl" />
        </div>
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
            Simple, transparent pricing
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Choose the plan that fits your needs. No hidden fees.
          </p>
          <div className="inline-flex items-center gap-3 bg-card border border-border rounded-full p-1">
            <Button
              variant={!yearly ? 'default' : 'ghost'}
              onClick={() => setYearly(false)}
              className="rounded-full"
            >
              Monthly
            </Button>
            <Button
              variant={yearly ? 'default' : 'ghost'}
              onClick={() => setYearly(true)}
              className="rounded-full"
            >
              Yearly <span className="text-xs opacity-80">(save 20%)</span>
            </Button>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 pb-20">
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative transition-shadow hover:shadow-lg ${
                plan.popular
                  ? 'border-primary shadow-md'
                  : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge>Most Popular</Badge>
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <span className="text-4xl font-bold text-foreground">
                    ${(yearly ? plan.price.yearly / 12 : plan.price.monthly).toFixed(2)}
                  </span>
                  <span className="text-muted-foreground ml-1">/mo</span>
                  {yearly && plan.price.yearly > 0 && (
                    <p className="text-xs text-muted-foreground mt-1">${plan.price.yearly} billed annually</p>
                  )}
                </div>
                <ul className="space-y-3">
                  {plan.features.map((f) => (
                    <li key={f.text} className="flex items-start gap-2 text-sm">
                      {f.included ? (
                        <Check className="h-4 w-4 text-success mt-0.5 shrink-0" />
                      ) : (
                        <X className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                      )}
                      <span className={f.included ? 'text-foreground' : 'text-muted-foreground'}>{f.text}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Link href="/auth/register" className="w-full">
                  <Button
                    variant={plan.popular ? 'default' : 'outline'}
                    className="w-full"
                  >
                    {plan.cta}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      <Separator className="max-w-5xl mx-auto" />

      <section className="max-w-5xl mx-auto px-4 py-20">
        <h2 className="text-2xl font-bold text-foreground text-center mb-8">Feature Comparison</h2>
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary/50">
              <TableHead className="text-foreground font-semibold">Feature</TableHead>
              <TableHead className="text-foreground font-semibold text-center">Free</TableHead>
              <TableHead className="text-foreground font-semibold text-center">Pro</TableHead>
              <TableHead className="text-foreground font-semibold text-center">Business</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {comparisons.map((row) => (
              <TableRow key={row.feature}>
                <TableCell className="text-foreground">{row.feature}</TableCell>
                <TableCell className="text-center text-muted-foreground">{row.free}</TableCell>
                <TableCell className="text-center text-foreground font-medium">{row.pro}</TableCell>
                <TableCell className="text-center text-foreground font-medium">{row.business}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>

      <Separator className="max-w-3xl mx-auto" />

      <section className="max-w-3xl mx-auto px-4 py-20">
        <h2 className="text-2xl font-bold text-foreground text-center mb-8">Frequently Asked Questions</h2>
        <Accordion className="space-y-4">
          {faqs.map((faq, i) => (
            <AccordionItem key={faq.q} value={`faq-${i}`}>
              <AccordionTrigger>{faq.q}</AccordionTrigger>
              <AccordionContent>{faq.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <section className="max-w-3xl mx-auto px-4 pb-20 text-center">
        <div className="rounded-2xl bg-gradient-to-r from-primary/10 via-background to-accent/10 border border-border p-10">
          <h2 className="text-2xl font-bold text-foreground mb-3">Ready to get started?</h2>
          <p className="text-muted-foreground mb-6">Join thousands of sellers on Horizon today.</p>
          <Link href="/auth/register">
            <Button size="lg">
              Create Your Account
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
