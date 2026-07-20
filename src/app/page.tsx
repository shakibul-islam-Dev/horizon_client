"use client";
import { Suspense, lazy } from "react";
import { motion } from "motion/react";

const HeroSection = lazy(() => import("@/components/home/HeroSection"));
const FeaturesSection = lazy(() => import("@/components/home/FeaturesSection"));
const HighlightsSection = lazy(() => import("@/components/home/HighlightsSection"));
const CategoriesSection = lazy(() => import("@/components/home/CategoriesSection"));
const LatestItemsSection = lazy(() => import("@/components/home/LatestItemsSection"));
const StatsSection = lazy(() => import("@/components/home/StatsSection"));
const TestimonialsSection = lazy(() => import("@/components/home/TestimonialsSection"));
const BlogPreviewSection = lazy(() => import("@/components/home/BlogPreviewSection"));
const FAQSection = lazy(() => import("@/components/home/FAQSection"));
const PartnersSection = lazy(() => import("@/components/home/PartnersSection"));
const NewsletterSection = lazy(() => import("@/components/home/NewsletterSection"));
const CTASection = lazy(() => import("@/components/home/CTASection"));

const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

function Section({ children }: { children: React.ReactNode }) {
  return (
    <motion.section
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
    >
      {children}
    </motion.section>
  );
}

function SectionSkeleton() {
  return <div className="py-20 px-4"><div className="max-w-7xl mx-auto h-64 rounded-xl bg-muted/30 animate-pulse" /></div>;
}

export default function HomePage() {
  return (
    <>
      <Suspense fallback={<SectionSkeleton />}>
        <HeroSection />
      </Suspense>
      <Section>
        <Suspense fallback={<SectionSkeleton />}>
          <FeaturesSection />
        </Suspense>
      </Section>
      <Section>
        <Suspense fallback={<SectionSkeleton />}>
          <HighlightsSection />
        </Suspense>
      </Section>
      <Section>
        <Suspense fallback={<SectionSkeleton />}>
          <CategoriesSection />
        </Suspense>
      </Section>
      <Section>
        <Suspense fallback={<SectionSkeleton />}>
          <LatestItemsSection />
        </Suspense>
      </Section>
      <Section>
        <Suspense fallback={<SectionSkeleton />}>
          <StatsSection />
        </Suspense>
      </Section>
      <Section>
        <Suspense fallback={<SectionSkeleton />}>
          <TestimonialsSection />
        </Suspense>
      </Section>
      <Section>
        <Suspense fallback={<SectionSkeleton />}>
          <BlogPreviewSection />
        </Suspense>
      </Section>
      <Section>
        <Suspense fallback={<SectionSkeleton />}>
          <FAQSection />
        </Suspense>
      </Section>
      <Section>
        <Suspense fallback={<SectionSkeleton />}>
          <PartnersSection />
        </Suspense>
      </Section>
      <Section>
        <Suspense fallback={<SectionSkeleton />}>
          <NewsletterSection />
        </Suspense>
      </Section>
      <Section>
        <Suspense fallback={<SectionSkeleton />}>
          <CTASection />
        </Suspense>
      </Section>
    </>
  );
}
