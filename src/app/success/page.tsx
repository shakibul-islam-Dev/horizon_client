import Link from "next/link";
import { CheckCircle, ArrowLeft } from "lucide-react";
import { stripe } from "@/lib/stripe";
import { Button } from "@/components/ui/button";

interface SuccessPageProps {
  searchParams: Promise<{ session_id?: string }>;
}

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const { session_id } = await searchParams;

  if (!session_id) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Invalid session</h1>
          <p className="text-muted-foreground mb-6">
            No session ID provided. Please try again.
          </p>
          <Link href="/cart">
            <Button>
              <ArrowLeft className="h-4 w-4" />
              Back to Cart
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  let session;
  try {
    session = await stripe.checkout.sessions.retrieve(session_id);
  } catch {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Session not found</h1>
          <p className="text-muted-foreground mb-6">
            Could not retrieve your checkout session. Please try again.
          </p>
          <Link href="/cart">
            <Button>
              <ArrowLeft className="h-4 w-4" />
              Back to Cart
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (session.status === "open") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Payment pending</h1>
          <p className="text-muted-foreground mb-6">
            Your payment is still being processed. Please wait.
          </p>
          <Link href="/cart">
            <Button>
              <ArrowLeft className="h-4 w-4" />
              Back to Cart
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md text-center">
        <div className="h-16 w-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="h-8 w-8 text-success" />
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-4">
          Payment Successful!
        </h1>
        <p className="text-muted-foreground mb-2">
          Thank you for your purchase. A confirmation email will be sent to{" "}
          <strong className="text-foreground">{session.customer_details?.email ?? "your email"}</strong>.
        </p>
        <p className="text-sm text-muted-foreground mb-8">
          Order ID: <code className="text-foreground">{session.id}</code>
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/explore">
            <Button size="lg" className="w-full sm:w-auto">
              Continue Shopping
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
