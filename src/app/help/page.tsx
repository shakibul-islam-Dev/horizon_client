'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { HelpCircle, MessageCircle, ChevronDown, ChevronUp, ArrowRight, Clock, CalendarDays, Search, Mail, Phone, MapPin } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface HelpTopic {
  title: string;
  description: string;
  details: string[];
  icon: string;
}

interface HelpFaq {
  question: string;
  answer: string;
}

interface HelpArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  readTime: number;
  publishedAt: string;
  image: string;
  tags: string[];
}

const HELP_TOPICS: HelpTopic[] = [
  {
    title: 'Getting Started',
    description: 'Create your account, set up your profile, and make your first move.',
    details: ['Sign up and verify your email', 'Complete your seller or buyer profile', 'Browse and save items to your wishlist'],
    icon: 'rocket',
  },
  {
    title: 'Buying & Checkout',
    description: 'How to purchase items and pay securely with Stripe.',
    details: ['Add items to your cart', 'Review your order summary', 'Pay through secure Stripe Checkout'],
    icon: 'cart',
  },
  {
    title: 'Selling & Listings',
    description: 'List products, manage inventory, and track your sales.',
    details: ['Create a high-quality listing', 'Set pricing and shipping options', 'Manage orders from your dashboard'],
    icon: 'tag',
  },
  {
    title: 'Payments & Payouts',
    description: 'Understand when and how you get paid as a seller.',
    details: ['Funds release after delivery confirmation', 'Track payouts in your account', 'Resolve payment disputes'],
    icon: 'wallet',
  },
  {
    title: 'Account & Security',
    description: 'Keep your account safe and manage your settings.',
    details: ['Enable two-factor authentication', 'Update your password regularly', 'Recognize and report phishing'],
    icon: 'shield',
  },
  {
    title: 'Support & Disputes',
    description: 'Get help when something goes wrong with an order.',
    details: ['Open a support ticket', 'File a buyer protection claim', 'Contact our team directly'],
    icon: 'lifebuoy',
  },
];

const HELP_FAQ: HelpFaq[] = [
  {
    question: 'How do I create an account on Horizon Marketplace?',
    answer: 'Click "Sign Up" in the top navigation, enter your email and a strong password, then verify your email address through the link we send you. You can then complete your profile and start browsing or selling.',
  },
  {
    question: 'Is my payment information secure?',
    answer: 'Yes. All payments are processed through Stripe, a PCI-DSS compliant provider. We never store your full card details on our servers, and every checkout happens over an encrypted connection.',
  },
  {
    question: 'How does buyer protection work?',
    answer: 'Every purchase is covered by Buyer Protection. If an item arrives damaged, differs from its description, or never arrives, you can open a dispute within 14 days of delivery for a full or partial refund.',
  },
  {
    question: 'When do sellers get paid?',
    answer: 'Seller payouts are released once the order is confirmed as delivered. You can track the status of every payout from your account dashboard under Transactions.',
  },
  {
    question: 'Can I cancel an order after purchasing?',
    answer: 'You can request a cancellation before the seller ships the item. Once an item is shipped, cancellations are handled through our refund and dispute process.',
  },
  {
    question: 'How do I contact support?',
    answer: 'Use the Contact Support button below to reach our team, or email support@horizonmarket.example. We typically respond within one business day.',
  },
];

const HELP_ARTICLES: HelpArticle[] = [
  {
    id: 'getting-started',
    title: 'Getting Started with Horizon Marketplace',
    excerpt: 'Learn how to create an account, set up your profile, and list your first item in minutes.',
    content:
      'Horizon Marketplace makes it easy to buy and sell with confidence. After signing up, complete your profile with a photo and a short bio so buyers know who they are purchasing from. To list an item, head to "Add Item", upload clear photos, write an honest description, and set a competitive price. Our search and filter tools help buyers discover your listing faster, while verified reviews build trust on both sides of every transaction.',
    category: 'Getting Started',
    author: 'Horizon Team',
    readTime: 4,
    publishedAt: '2026-01-12',
    image: 'https://picsum.photos/seed/help-getting-started/800/450',
    tags: ['basics', 'account', 'selling'],
  },
  {
    id: 'safe-payments',
    title: 'Understanding Secure Payments',
    excerpt: 'How Stripe-powered checkout keeps your money and data safe on every purchase.',
    content:
      'All payments on Horizon are processed through Stripe, a PCI-DSS compliant payment provider. We never store your card details on our servers. When you check out, a dedicated Stripe Checkout session is created and you are redirected to a secure, encrypted page to complete the payment. Funds are only released to the seller once the order is confirmed, giving buyers peace of mind and sellers reliable payouts.',
    category: 'Payments',
    author: 'Horizon Team',
    readTime: 5,
    publishedAt: '2026-02-03',
    image: 'https://picsum.photos/seed/help-payments/800/450',
    tags: ['stripe', 'security', 'checkout'],
  },
  {
    id: 'writing-great-listings',
    title: 'Tips for Writing Listings That Sell',
    excerpt: 'Photography, pricing, and description strategies that boost your conversion rate.',
    content:
      'Great listings share three things: strong photos, clear descriptions, and fair pricing. Use natural lighting and a clean background for product shots, and include at least three images from different angles. In your description, lead with the benefits, then list specifications. Price competitively by checking similar items, and enable free shipping when possible to increase visibility in search results.',
    category: 'Selling',
    author: 'Maya Patel',
    readTime: 6,
    publishedAt: '2026-02-20',
    image: 'https://picsum.photos/seed/help-listings/800/450',
    tags: ['selling', 'marketing', 'photos'],
  },
  {
    id: 'buyer-protection',
    title: 'Buyer Protection & Refunds',
    excerpt: 'What to do if an item arrives damaged or never shows up.',
    content:
      'Every purchase on Horizon is covered by Buyer Protection. If your item arrives damaged, doesn’t match the description, or never arrives, open a dispute within 14 days of delivery. Our support team reviews the evidence, coordinates with the seller, and issues a full or partial refund when appropriate. Keep photos of the packaging and item to speed up the resolution process.',
    category: 'Buying',
    author: 'Horizon Team',
    readTime: 4,
    publishedAt: '2026-03-08',
    image: 'https://picsum.photos/seed/help-buyer/800/450',
    tags: ['buyer', 'refunds', 'support'],
  },
  {
    id: 'wishlist-cart',
    title: 'Using Your Wishlist and Cart',
    excerpt: 'Save items for later and manage a smooth multi-item checkout.',
    content:
      'Tap the heart icon on any item to save it to your wishlist for later. Your cart lets you bundle multiple items and check out once. When you’re ready, the cart computes your total and redirects to Stripe Checkout. You can adjust quantities or remove items before paying, and your cart persists across devices as long as you stay signed in.',
    category: 'Shopping',
    author: 'Liam Chen',
    readTime: 3,
    publishedAt: '2026-03-22',
    image: 'https://picsum.photos/seed/help-wishlist/800/450',
    tags: ['cart', 'wishlist', 'shopping'],
  },
  {
    id: 'account-security',
    title: 'Keeping Your Account Secure',
    excerpt: 'Enable strong passwords and recognize phishing attempts.',
    content:
      'Protect your account with a unique, strong password and never share it. Horizon will never ask for your password by email. Be cautious of messages that link to login pages outside our official domain. If you notice unfamiliar activity, reset your password immediately and contact support. Enabling two-factor authentication adds an extra layer of security to your transactions.',
    category: 'Security',
    author: 'Horizon Team',
    readTime: 4,
    publishedAt: '2026-04-15',
    image: 'https://picsum.photos/seed/help-security/800/450',
    tags: ['security', 'account', 'privacy'],
  },
];

const CONTACT = {
  email: 'support@horizonmarket.example',
  phone: '+1 (555) 012-3456',
  address: '120 Market Street, Suite 400, San Francisco, CA 94105',
};

function topicIcon(icon: string) {
  switch (icon) {
    case 'rocket':
      return '🚀';
    case 'cart':
      return '🛒';
    case 'tag':
      return '🏷️';
    case 'wallet':
      return '👛';
    case 'shield':
      return '🛡️';
    case 'lifebuoy':
      return '🆘';
    default:
      return '📘';
  }
}

function formatArticleDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function HelpPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeArticle, setActiveArticle] = useState<HelpArticle | null>(null);
  const [articleCategory, setArticleCategory] = useState<string>('All');

  const filteredTopics = HELP_TOPICS.filter((topic) =>
    topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    topic.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    topic.details.some((d) => d.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  const filteredFaqs = HELP_FAQ.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const articleCategories = ['All', ...Array.from(new Set(HELP_ARTICLES.map((a) => a.category)))];

  const filteredArticles = HELP_ARTICLES.filter((article) => {
    const matchesCategory = articleCategory === 'All' || article.category === articleCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      article.title.toLowerCase().includes(q) ||
      article.excerpt.toLowerCase().includes(q) ||
      article.content.toLowerCase().includes(q) ||
      article.tags.some((t) => t.toLowerCase().includes(q));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 md:py-24 px-4">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-10 left-1/4 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute top-20 right-1/4 h-80 w-80 rounded-full bg-accent/5 blur-3xl" />
        </div>
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
              <HelpCircle className="h-4 w-4" />
              Help Center
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground mb-4">
              How Can We Help?
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Find answers to common questions and learn how to get the most out of Horizon Marketplace.
            </p>
            <div className="max-w-2xl mx-auto relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for help..."
                className="w-full rounded-full border border-border bg-card px-6 py-3 pl-12 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            </div>
          </motion.div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 pb-20">
        {/* Help Topics */}
        {filteredTopics.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-foreground mb-6">Help Topics</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredTopics.map((topic, index) => (
                <motion.div
                  key={topic.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                >
                  <Card className="h-full hover:shadow-lg transition-all duration-300 border-border hover:border-primary/20">
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 text-xl">
                          {topicIcon(topic.icon)}
                        </div>
                        <CardTitle className="text-lg">{topic.title}</CardTitle>
                      </div>
                      <p className="text-sm text-muted-foreground">{topic.description}</p>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {topic.details.map((detail, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Help Articles / Dummy Blog Content */}
        {filteredArticles.length > 0 && (
          <div className="mb-16">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
              <h2 className="text-2xl font-bold text-foreground">Help Articles</h2>
              <div className="flex flex-wrap gap-2">
                {articleCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setArticleCategory(cat)}
                    className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                      articleCategory === cat
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border text-muted-foreground hover:bg-accent'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredArticles.map((article, index) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.4 }}
                >
                  <button
                    onClick={() => setActiveArticle(article)}
                    className="group h-full w-full text-left rounded-xl border border-border bg-card overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-primary/20"
                  >
                    <div className="relative h-40 overflow-hidden">
                      <Image
                        src={article.image}
                        alt={article.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="secondary" className="text-xs">{article.category}</Badge>
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {article.readTime} min read
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3">
                        {article.excerpt}
                      </p>
                      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                        Read Article <ArrowRight className="h-4 w-4" />
                      </span>
                    </div>
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* FAQ Section */}
        {filteredFaqs.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-foreground mb-6">Frequently Asked Questions</h2>
            <div className="max-w-3xl mx-auto space-y-3">
              {filteredFaqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  className="rounded-xl border border-border bg-card overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full flex items-center justify-between p-5 text-left hover:bg-accent/50 transition-colors"
                  >
                    <span className="font-medium text-foreground pr-4">{faq.question}</span>
                    {openFaq === index ? (
                      <ChevronUp className="h-5 w-5 text-muted-foreground shrink-0" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground shrink-0" />
                    )}
                  </button>
                  <motion.div
                    initial={false}
                    animate={{
                      height: openFaq === index ? 'auto' : 0,
                      opacity: openFaq === index ? 1 : 0,
                    }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {filteredTopics.length === 0 && filteredArticles.length === 0 && filteredFaqs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-6 text-6xl opacity-30">🔍</div>
            <h3 className="text-xl font-semibold text-foreground mb-2">No results found</h3>
            <p className="text-muted-foreground max-w-md">
              We couldn&apos;t find anything matching &quot;{searchQuery}&quot;. Try a different search term.
            </p>
            <Button variant="default" className="mt-6" onClick={() => setSearchQuery('')}>
              Clear Search
            </Button>
          </div>
        )}

        {/* Article Reader Modal */}
        {activeArticle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setActiveArticle(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border bg-card shadow-xl"
            >
              <button
                onClick={() => setActiveArticle(null)}
                className="absolute right-4 top-4 z-10 rounded-full bg-background/80 p-2 hover:bg-background transition-colors"
                aria-label="Close article"
              >
                <ChevronDown className="h-5 w-5 rotate-45" />
              </button>
              <div className="relative h-48 w-full overflow-hidden">
                <Image
                  src={activeArticle.image}
                  alt={activeArticle.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 42rem"
                  className="object-cover"
                />
              </div>
              <div className="p-6 md:p-8">
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <Badge variant="secondary">{activeArticle.category}</Badge>
                  {activeArticle.tags.map((tag) => (
                    <span key={tag} className="text-xs text-muted-foreground">#{tag}</span>
                  ))}
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-3">{activeArticle.title}</h2>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                  <span>{activeArticle.author}</span>
                  <span className="flex items-center gap-1.5">
                    <CalendarDays className="h-3.5 w-3.5" />
                    {formatArticleDate(activeArticle.publishedAt)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    {activeArticle.readTime} min read
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
                  {activeArticle.content}
                </p>
                <div className="mt-8">
                  <Link href="/contact" onClick={() => setActiveArticle(null)}>
                    <Button className="w-full sm:w-auto">
                      Still need help? Contact us
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl bg-gradient-to-r from-primary/10 via-background to-accent/10 border border-border p-8 md:p-12 text-center"
        >
          <div className="max-w-2xl mx-auto">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-primary/10 mb-6">
              <MessageCircle className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
              Still need help?
            </h2>
            <p className="text-muted-foreground mb-6">
              Can&apos;t find what you&apos;re looking for? Our support team is here to help you with any questions.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/contact" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto">
                  Contact Support
                </Button>
              </Link>
              <div className="flex flex-col items-start gap-2 text-sm text-muted-foreground sm:items-start">
                <span className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-primary" />
                  {CONTACT.email}
                </span>
                <span className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-primary" />
                  {CONTACT.phone}
                </span>
                <span className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  {CONTACT.address}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
