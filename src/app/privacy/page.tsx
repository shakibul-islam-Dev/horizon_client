'use client';

import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

const sections = [
  { id: 'information-we-collect', number: '1', title: 'Information We Collect' },
  { id: 'how-we-use-your-information', number: '2', title: 'How We Use Your Information' },
  { id: 'information-sharing', number: '3', title: 'Information Sharing' },
  { id: 'data-security', number: '4', title: 'Data Security' },
  { id: 'cookies', number: '5', title: 'Cookies' },
  { id: 'your-rights', number: '6', title: 'Your Rights' },
  { id: 'changes-to-this-policy', number: '7', title: 'Changes to This Policy' },
  { id: 'contact-us', number: '8', title: 'Contact Us' },
];

function BackToTop() {
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="inline-flex items-center gap-1.5 text-xs text-primary hover:text-primary-dark transition-colors mt-6"
    >
      <ArrowUp className="h-3 w-3" />
      Back to top
    </button>
  );
}

export default function PrivacyPage() {
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: '-100px 0px -60% 0px' }
    );

    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <section className="bg-gradient-to-r from-primary/10 via-background to-accent/10 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Privacy Policy
          </h1>
          <p className="text-sm text-muted-foreground">
            Last updated: March 15, 2025
          </p>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-[240px_1fr] gap-12">
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <h2 className="text-sm font-semibold mb-4">Table of Contents</h2>
              <ScrollArea className="max-h-[70vh]">
                <nav className="space-y-1 pr-4">
                  {sections.map((section) => (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      className={`block text-sm py-1.5 pl-3 border-l-2 transition-colors ${
                        activeSection === section.id
                          ? 'border-primary text-primary font-medium'
                          : 'border-transparent text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {section.title}
                    </a>
                  ))}
                </nav>
              </ScrollArea>
            </div>
          </aside>

          <Card>
            <CardContent className="max-w-3xl prose-custom p-8">
              <p className="text-muted-foreground leading-relaxed mb-8">
                At Horizon Marketplace (&quot;we,&quot; &quot;our,&quot; or
                &quot;us&quot;), we are committed to protecting your privacy and
                personal information. This Privacy Policy explains how we collect,
                use, disclose, and safeguard your information when you use our
                website, mobile applications, and related services (collectively,
                the &quot;Platform&quot;). Please read this policy carefully. By
                using our Platform, you agree to the collection and use of
                information in accordance with this policy.
              </p>

              <Separator className="my-8" />

              <div id="information-we-collect" className="scroll-mt-24 mb-10">
                <h2 className="text-2xl font-bold mb-4">
                  1. Information We Collect
                </h2>
                <div className="space-y-3 text-muted-foreground leading-relaxed text-sm">
                  <p>
                    <strong className="text-foreground">Personal Information:</strong>{' '}
                    When you create an account, we collect your name, email address,
                    phone number, shipping and billing addresses, and payment
                    information. This information is necessary to process
                    transactions, communicate with you, and provide our services.
                  </p>
                  <p>
                    <strong className="text-foreground">Usage Data:</strong>{' '}
                    We automatically collect information about how you interact with
                    our Platform, including your IP address, browser type, operating
                    system, pages visited, time spent on pages, search queries, and
                    referring URLs. This data helps us understand user behavior and
                    improve our services.
                  </p>
                  <p>
                    <strong className="text-foreground">Device Information:</strong>{' '}
                    We may collect information about the device you use to access
                    our Platform, including hardware model, unique device
                    identifiers, and mobile network information.
                  </p>
                  <p>
                    <strong className="text-foreground">Seller Information:</strong>{' '}
                    If you register as a seller, we additionally collect your tax
                    identification number, bank account details for payouts, business
                    name, and business address as required for compliance and payment
                    processing.
                  </p>
                </div>
              </div>

              <Separator className="my-8" />

              <div id="how-we-use-your-information" className="scroll-mt-24 mb-10">
                <h2 className="text-2xl font-bold mb-4">
                  2. How We Use Your Information
                </h2>
                <div className="space-y-3 text-muted-foreground leading-relaxed text-sm">
                  <p>We use the information we collect for the following purposes:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>
                      <strong className="text-foreground">To provide and maintain our services,</strong> including processing transactions, managing your account, and facilitating communication between buyers and sellers.
                    </li>
                    <li>
                      <strong className="text-foreground">To personalize your experience,</strong> including providing AI-powered product recommendations, customizing search results, and displaying relevant content.
                    </li>
                    <li>
                      <strong className="text-foreground">To improve our Platform,</strong> by analyzing usage patterns, conducting research, developing new features, and enhancing existing functionality.
                    </li>
                    <li>
                      <strong className="text-foreground">To communicate with you,</strong> about your orders, account updates, security alerts, promotional offers, and changes to our services. You can opt out of marketing communications at any time.
                    </li>
                    <li>
                      <strong className="text-foreground">To detect and prevent fraud,</strong> unauthorized access, and other illegal activities. We use automated systems to monitor transactions for suspicious activity.
                    </li>
                    <li>
                      <strong className="text-foreground">To comply with legal obligations,</strong> including tax reporting, responding to legal requests, and enforcing our terms of service.
                    </li>
                  </ul>
                </div>
              </div>

              <Separator className="my-8" />

              <div id="information-sharing" className="scroll-mt-24 mb-10">
                <h2 className="text-2xl font-bold mb-4">
                  3. Information Sharing
                </h2>
                <div className="space-y-3 text-muted-foreground leading-relaxed text-sm">
                  <p>
                    We do not sell your personal information. We may share your
                    information in the following circumstances:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>
                      <strong className="text-foreground">With other users:</strong>{' '}
                      When you make a purchase, the seller receives your name and
                      shipping address to fulfill your order. When you make a sale,
                      the buyer sees your seller name and shipping origin city.
                    </li>
                    <li>
                      <strong className="text-foreground">With service providers:</strong>{' '}
                      We share information with trusted third-party vendors who assist
                      in operating our Platform, including payment processors, shipping
                      carriers, cloud hosting providers, and analytics services. These
                      providers are contractually obligated to protect your data.
                    </li>
                    <li>
                      <strong className="text-foreground">For legal compliance:</strong>{' '}
                      We may disclose information if required by law, regulation, legal
                      process, or governmental request. We may also share information
                      to protect the rights, property, or safety of Horizon, our users,
                      or the public.
                    </li>
                    <li>
                      <strong className="text-foreground">In business transfers:</strong>{' '}
                      If Horizon is involved in a merger, acquisition, or sale of assets,
                      your information may be transferred as part of that transaction.
                      We will notify you of any such change and any choices you may have.
                    </li>
                  </ul>
                </div>
              </div>

              <Separator className="my-8" />

              <div id="data-security" className="scroll-mt-24 mb-10">
                <h2 className="text-2xl font-bold mb-4">
                  4. Data Security
                </h2>
                <div className="space-y-3 text-muted-foreground leading-relaxed text-sm">
                  <p>
                    We implement industry-standard security measures to protect your
                    personal information, including:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>SSL/TLS encryption for all data transmitted between your browser and our servers.</li>
                    <li>Encrypted storage of sensitive data including payment information and passwords.</li>
                    <li>Regular security audits and penetration testing conducted by independent firms.</li>
                    <li>Role-based access controls limiting employee access to personal data on a need-to-know basis.</li>
                    <li>Continuous monitoring of our systems for unauthorized access or suspicious activity.</li>
                  </ul>
                  <p>
                    While we strive to use commercially acceptable means to protect
                    your personal information, no method of transmission over the
                    Internet or electronic storage is 100% secure. We cannot
                    guarantee absolute security but will promptly notify affected
                    users in the event of a data breach.
                  </p>
                </div>
              </div>

              <Separator className="my-8" />

              <div id="cookies" className="scroll-mt-24 mb-10">
                <h2 className="text-2xl font-bold mb-4">
                  5. Cookies
                </h2>
                <div className="space-y-3 text-muted-foreground leading-relaxed text-sm">
                  <p>
                    We use cookies and similar tracking technologies to enhance your
                    experience on our Platform. Cookies are small text files stored
                    on your device that help us recognize your browser and remember
                    certain information.
                  </p>
                  <p>
                    <strong className="text-foreground">Essential Cookies:</strong>{' '}
                    Required for the Platform to function properly. These include
                    session cookies, authentication cookies, and cookies that
                    remember your preferences.
                  </p>
                  <p>
                    <strong className="text-foreground">Analytics Cookies:</strong>{' '}
                    Help us understand how visitors interact with our Platform by
                    collecting anonymous usage data. We use this information to
                    improve our services and user experience.
                  </p>
                  <p>
                    <strong className="text-foreground">Marketing Cookies:</strong>{' '}
                    Used to deliver relevant advertisements and track the
                    effectiveness of our marketing campaigns. These may be set by
                    third-party advertising partners.
                  </p>
                  <p>
                    You can control cookies through your browser settings. Disabling
                    certain cookies may affect the functionality of our Platform.
                  </p>
                </div>
              </div>

              <Separator className="my-8" />

              <div id="your-rights" className="scroll-mt-24 mb-10">
                <h2 className="text-2xl font-bold mb-4">
                  6. Your Rights
                </h2>
                <div className="space-y-3 text-muted-foreground leading-relaxed text-sm">
                  <p>
                    Depending on your location, you may have the following rights
                    regarding your personal data:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>
                      <strong className="text-foreground">Access:</strong>{' '}
                      Request a copy of the personal data we hold about you.
                    </li>
                    <li>
                      <strong className="text-foreground">Correction:</strong>{' '}
                      Request that we correct inaccurate or incomplete information.
                    </li>
                    <li>
                      <strong className="text-foreground">Deletion:</strong>{' '}
                      Request that we delete your personal data, subject to certain
                      legal exceptions.
                    </li>
                    <li>
                      <strong className="text-foreground">Portability:</strong>{' '}
                      Request a copy of your data in a structured, machine-readable
                      format.
                    </li>
                    <li>
                      <strong className="text-foreground">Opt-out:</strong>{' '}
                      Opt out of marketing communications at any time by clicking
                      &quot;Unsubscribe&quot; in our emails or updating your
                      account preferences.
                    </li>
                    <li>
                      <strong className="text-foreground">Restriction:</strong>{' '}
                      Request that we restrict processing of your data in certain
                      circumstances.
                    </li>
                  </ul>
                  <p>
                    To exercise any of these rights, please contact us at{' '}
                    <strong className="text-foreground">privacy@horizon.com</strong>.
                    We will respond to your request within 30 days.
                  </p>
                </div>
              </div>

              <Separator className="my-8" />

              <div id="changes-to-this-policy" className="scroll-mt-24 mb-10">
                <h2 className="text-2xl font-bold mb-4">
                  7. Changes to This Policy
                </h2>
                <div className="space-y-3 text-muted-foreground leading-relaxed text-sm">
                  <p>
                    We may update this Privacy Policy from time to time to reflect
                    changes in our practices, technology, legal requirements, or
                    other factors. When we make material changes, we will notify you
                    through the Platform, via email, or by other appropriate means
                    before the changes take effect.
                  </p>
                  <p>
                    We encourage you to review this policy periodically to stay
                    informed about how we protect your information. Your continued
                    use of our Platform after any changes constitutes your acceptance
                    of the updated policy.
                  </p>
                  <p>
                    The date at the top of this page indicates when this policy was
                    last revised. We will maintain records of all prior versions of
                    this policy and make them available upon request.
                  </p>
                </div>
              </div>

              <Separator className="my-8" />

              <div id="contact-us" className="scroll-mt-24 mb-10">
                <h2 className="text-2xl font-bold mb-4">
                  8. Contact Us
                </h2>
                <div className="space-y-3 text-muted-foreground leading-relaxed text-sm">
                  <p>
                    If you have any questions, concerns, or requests regarding this
                    Privacy Policy or our data practices, please contact us:
                  </p>
                  <Card className="mt-4">
                    <CardContent className="p-6 space-y-3 text-sm">
                      <p>
                        <strong className="text-foreground">Email:</strong>{' '}
                        privacy@horizon.com
                      </p>
                      <p>
                        <strong className="text-foreground">Mailing Address:</strong>{' '}
                        Horizon Marketplace, Inc. &mdash; Privacy Team
                        <br />
                        123 Marketplace Street
                        <br />
                        Tech City, TC 12345
                      </p>
                      <p>
                        <strong className="text-foreground">Phone:</strong>{' '}
                        +1 (555) 123-4567
                      </p>
                    </CardContent>
                  </Card>
                  <p className="mt-4">
                    If you are not satisfied with our response, you have the right
                    to lodge a complaint with your local data protection authority.
                  </p>
                </div>
              </div>

              <Separator className="my-8" />

              <BackToTop />
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
