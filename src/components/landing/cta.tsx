import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { MoveRight } from 'lucide-react';

export function Cta() {
  return (
    <section className="py-20 sm:py-32 bg-secondary/50">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-4xl md:text-5xl">
          Ready to Transform Your Institution?
        </h2>
        <p className="mt-4 max-w-2xl mx-auto text-muted-foreground md:text-xl">
          Join over 20+ institutions that are already benefiting from a smarter workflow.
        </p>
        <div className="mt-8">
          <Button size="lg" asChild>
            <Link href="/register">
              Get Started Now <MoveRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
