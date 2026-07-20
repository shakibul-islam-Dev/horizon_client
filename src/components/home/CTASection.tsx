import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CTASection() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto bg-gradient-to-r from-primary to-primary/70 text-primary-foreground rounded-xl p-16 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Start?</h2>
        <p className="text-lg text-primary-foreground/80 mb-10 max-w-xl mx-auto">
          Join thousands of buyers and sellers on Horizon today
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/explore">
            <Button
              variant="secondary"
              size="lg"
              className="text-base px-8 py-6"
            >
              Explore Products
            </Button>
          </Link>
          <Link href="/items/add">
            <Button
              variant="outline"
              size="lg"
              className="text-base px-8 py-6 border-primary-foreground text-base hover:bg-primary-foreground hover:text-primary"
            >
              Become a Seller
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
