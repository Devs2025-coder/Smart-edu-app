
import Link from 'next/link';
import Image from 'next/image';
import { MoveRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { USER_ROLES } from '@/lib/constants';

export function Hero() {
  return (
    <section className="relative w-full h-[80vh] min-h-[600px] flex items-center justify-center text-center">
      <Image
        src="https://picsum.photos/seed/college-students/1800/1200"
        alt="Students in a college campus"
        fill
        className="object-cover -z-10 brightness-[0.4]"
        data-ai-hint="college students"
      />
      <div className="container px-4 md:px-6 text-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-headline font-bold md:text-6xl lg:text-7xl tracking-tighter mb-4 animate-fade-in-up">
            Smart Curriculum & Attendance Management for Schools & Colleges
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-8 animate-fade-in-up animation-delay-300">
            Automate attendance, suggest personalized tasks, and boost
            productivity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animation-delay-600">
            <Button size="lg" asChild>
              <Link href="/register">
                Register Your Institution <MoveRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="lg" variant="secondary">
                  Login
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center">
                {USER_ROLES.map((role) => (
                  <DropdownMenuItem key={role} asChild>
                    <Link
                      href={`/login?role=${role.toLowerCase().replace(' ', '-')}`}
                    >
                      {role}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </section>
  );
}
