'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Check, X, ArrowRight, Sparkles, Loader2, Crown, Star, Building2, Rocket, Zap } from 'lucide-react';
import { useCheckout } from '@/hooks/use-checkout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface PlanFeature {
  text: string;
  included: boolean;
}

interface PricingPlan {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  price: { monthly: number; yearly: number };
  cta: string;
  popular: boolean;
  highlight?: string;
  features: PlanFeature[];
}

const PLANS: PricingPlan[] = [
  {
    id: 'free',
    name: 'Free',
    description: 'Perfect for casual buyers and first-time sellers exploring the marketplace.',
    icon: <Rocket className="h-5 w-5" />,
    price: { monthly: 0, yearly: 0 },
    cta: 'Get Started',
    popular: false,
    features: [
      { text: 'Up to 5 active listings', included: true },
      { text: 'Standard search visibility', included: true },
      { text: 'Buyer protection on every order', included: true },
      { text: 'Community support', included: true },
      { text: 'Advanced analytics dashboard', included: false },
      { text: 'Featured placement', included: false },
      { text: 'Custom storefront', included: false },
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'For growing sellers who want more reach, insights, and lower fees.',
    icon: <Zap className="h-5 w-5" />,
    price: { monthly: 19, yearly: 182 },
    cta: 'Subscribe to Pro',
    popular: true,
    highlight: 'Most Popular',
    features: [
      { text: 'Up to 100 active listings', included: true },
      { text: 'Boosted search visibility', included: true },
      { text: 'Buyer protection on every order', included: true },
      { text: 'Priority email support', included: true },
      { text: 'Advanced analytics dashboard', included: true },
      { text: 'Featured placement (2/month)', included: true },
      { text: 'Custom storefront', included: false },
    ],
  },
  {
    id: 'business',
    name: 'Business',
    description: 'For established brands and high-volume sellers scaling their storefront.',
    icon: <Building2 className="h-5 w-5" />,
    price: { monthly: 49, yearly: 470 },
    cta: 'Subscribe to Business',
    popular: false,
    features: [
      { text: 'Unlimited active listings', included: true },
      { text: 'Maximum search visibility', included: true },
      { text: 'Buyer protection on every order', included: true },
      { text: 'Dedicated account manager', included: true },
      { text: 'Advanced analytics dashboard', included: true },
      { text: 'Featured placement (10/month)', included: true },
      { text: 'Custom storefront & branding', included: true },
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Tailored solutions, SLAs, and API access for large marketplaces.',
    icon: <Crown className="h-5 w-5" />,
    price: { monthly: 149, yearly: 1430 },
    cta: 'Contact Sales',
    popular: false,
    features: [
      { text: 'Everything in Business', included: true },
      { text: 'Dedicated infrastructure & SLA', included: true },
      { text: 'Full API & webhook access', included: true },
      { text: 'White-label checkout options', included: true },
      { text: 'Priority 24/7 phone support', included: true },
      { text: 'Onboarding & migration help', included: true },
      { text: 'Custom contract & invoicing', included: true },
    ],
  },
];

const COMPARISONS: { feature: string; free: string; pro: string; business: string; enterprise: string }[] = [
  { feature: 'Active listings', free: '5', pro: '100', business: 'Unlimited', enterprise: 'Unlimited' },
  { feature: 'Listing fee', free: '8%', pro: '5%', business: '3%', enterprise: 'Custom' },
  { feature: 'Search visibility', free: 'Standard', pro: 'Boosted', business: 'Maximum', enterprise: 'Maximum' },
  { feature: 'Featured placement', free: '—', pro: '2 / month', business: '10 / month', enterprise: 'Unlimited' },
  { feature: 'Analytics dashboard', free: 'Basic', pro: 'Advanced', business: 'Advanced', enterprise: 'Advanced + API' },
  { feature: 'Storefront', free: '—', pro: '—', business: 'Custom', enterprise: 'White-label' },
  { feature: 'Support', free: 'Community', pro: 'Priority email', business: 'Account manager', enterprise: '24/7 phone' },
];

const FAQS: { q: string; a: string }[] = [
  {
    q: 'How does billing work?',
    a: 'Plans are billed in advance on a monthly or annual basis through Stripe. You can switch or cancel anytime from your account settings, and annual plans are billed once per year at a discounted rate.',
  },
  {
    q: 'Can I change my plan later?',
    a: 'Yes. You can upgrade or downgrade at any time. Upgrades take effect immediately and we prorate the difference; downgrades apply at the start of your next billing cycle.',
  },
  {
    q: 'What happens to my listings if I downgrade?',
    a: 'If you move to a plan with a lower listing limit, your oldest listings beyond the new limit are paused (not deleted) until you upgrade again or remove active listings.',
  },
  {
    q: 'Do you offer refunds?',
    a: 'We offer a 14-day money-back guarantee on paid plans. If Horizon is not the right fit, contact support within 14 days of your first payment for a full refund.',
  },
  {
    q: 'Is there a contract or commitment?',
    a: 'No long-term contracts. Monthly plans are pay-as-you-go and can be cancelled at any time. Annual plans are committed for the year but save you ~20% versus paying monthly.',
  },
  {
    q: 'Which payment methods do you accept?',
    a: 'All major credit and debit cards are accepted through our secure Stripe Checkout. Enterprise customers can also pay by invoice.',
  },
];

export default function PricingPage() {
  const [yearly, setYearly] = useState(false);
  const { startCheckout, isCheckingOut } = useCheckout();

  const handleSubscribe = (plan: PricingPlan) => {
    if (plan.id === 'enterprise') {
      window.location.assign('/contact');
      return;
    }
    const amount = yearly ? plan.price.yearly : plan.price.monthly;
    void startCheckout([
      {
        title: `${plan.name} Plan${yearly ? ' (Annual)' : ' (Monthly)'}`,
        price: amount,
        quantity: 1,
      },
    ]);
  };

  const savings = (plan: PricingPlan) =>
    plan.price.monthly > 0
      ? plan.price.monthly * 12 - plan.price.yearly
      : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-10 left-1/4 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute top-20 right-1/4 h-80 w-80 rounded-full bg-accent/5 blur-3xl" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
            <Sparkles className="h-4 w-4" />
            Pricing Plans
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
            Simple, transparent pricing
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Choose the plan that fits your needs. No hidden fees, cancel anytime.
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
              Yearly <span className="text-xs opacity-80">(save up to 20%)</span>
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Plan tiers */}
      <section className="max-w-7xl mx-auto px-4 pb-20">
        <motion.div
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
          }}
        >
          {PLANS.map((plan) => (
            <motion.div
              key={plan.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
              }}
              className="flex"
            >
              <Card
                className={`relative flex flex-col w-full transition-shadow hover:shadow-lg ${
                  plan.popular ? 'border-primary shadow-md ring-1 ring-primary/30' : ''
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="gap-1">
                      <Star className="h-3 w-3" />
                      {plan.highlight}
                    </Badge>
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-center gap-2 text-primary mb-1">
                    {plan.icon}
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                  </div>
                  <p className="text-sm text-muted-foreground min-h-[40px]">{plan.description}</p>
                </CardHeader>
                <CardContent className="space-y-6 flex-1">
                  <div>
                    <span className="text-4xl font-bold text-foreground">
                      ${yearly ? plan.price.yearly : plan.price.monthly}
                    </span>
                    <span className="text-muted-foreground ml-1">
                      {plan.price.monthly === 0 ? 'forever' : yearly ? '/year' : '/mo'}
                    </span>
                    {yearly && plan.price.monthly > 0 && (
                      <p className="text-xs text-success mt-1">
                        Save ${savings(plan)} per year
                      </p>
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
                  <Button
                    variant={plan.popular ? 'default' : 'outline'}
                    className="w-full"
                    disabled={isCheckingOut}
                    onClick={() => handleSubscribe(plan)}
                  >
                    {isCheckingOut ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <ArrowRight className="h-4 w-4" />
                    )}
                    {plan.cta}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <Separator className="max-w-5xl mx-auto" />

      {/* Comparison table */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-2xl font-bold text-foreground text-center mb-8"
        >
          Compare Plans
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="overflow-x-auto"
        >
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary/50">
                <TableHead className="text-foreground font-semibold min-w-[160px]">Feature</TableHead>
                <TableHead className="text-foreground font-semibold text-center">Free</TableHead>
                <TableHead className="text-foreground font-semibold text-center">Pro</TableHead>
                <TableHead className="text-foreground font-semibold text-center">Business</TableHead>
                <TableHead className="text-foreground font-semibold text-center">Enterprise</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {COMPARISONS.map((row) => (
                <TableRow key={row.feature}>
                  <TableCell className="text-foreground font-medium">{row.feature}</TableCell>
                  <TableCell className="text-center text-muted-foreground">{row.free}</TableCell>
                  <TableCell className="text-center text-foreground font-medium">{row.pro}</TableCell>
                  <TableCell className="text-center text-foreground font-medium">{row.business}</TableCell>
                  <TableCell className="text-center text-foreground font-medium">{row.enterprise}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </motion.div>
      </section>

      <Separator className="max-w-3xl mx-auto" />

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 py-20">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-2xl font-bold text-foreground text-center mb-8"
        >
          Frequently Asked Questions
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Accordion className="space-y-4">
            {FAQS.map((faq, i) => (
              <AccordionItem key={faq.q} value={`faq-${i}`}>
                <AccordionTrigger>{faq.q}</AccordionTrigger>
                <AccordionContent>{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-4 pb-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl bg-gradient-to-r from-primary/10 via-background to-accent/10 border border-border p-10"
        >
          <h2 className="text-2xl font-bold text-foreground mb-3">Ready to get started?</h2>
          <p className="text-muted-foreground mb-6">Join thousands of sellers on Horizon today.</p>
          <Link href="/auth/register">
            <Button size="lg">
              Create Your Account
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
