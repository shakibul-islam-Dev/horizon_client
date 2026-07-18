'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useAbout } from '@/hooks/use-about';

export default function FAQSection() {
  const { data: aboutResponse } = useAbout();
  const faqs = aboutResponse?.data?.homepageFaq ?? [];

  if (faqs.length === 0) return null;

  return (
    <section className="py-20 px-4 bg-secondary/5">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">
          Frequently Asked Questions
        </h2>
        <Accordion multiple className="space-y-3">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`faq-${index}`} className="border border-border rounded-xl overflow-hidden">
              <AccordionTrigger className="px-5 py-5">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="px-5">
                <p className="text-muted-foreground">{faq.answer}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
