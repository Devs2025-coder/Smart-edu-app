import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const testimonials = [
  {
    quote: "EduTrack has revolutionized how we manage attendance. It's saved our professors countless hours.",
    name: 'Dr. Emily Carter',
    title: 'Dean of Academics, Crestwood University',
    avatar: 'EC',
    imageSeed: '10'
  },
  {
    quote: "The personalized task suggestions are a game-changer for student engagement during free periods.",
    name: 'Mr. David Chen',
    title: 'Principal, Northwood High School',
    avatar: 'DC',
    imageSeed: '11'
  },
  {
    quote: "As a student, I love how easy it is to track my attendance and see what I need to work on. The UI is super clean!",
    name: 'Jessica Miller',
    title: 'Student, Lakeside College',
    avatar: 'JM',
    imageSeed: '12'
  },
];

export function Testimonials() {
  return (
    <section className="py-20 sm:py-32">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Loved by Institutions and Students
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-muted-foreground md:text-xl">
            Don't just take our word for it. Here's what people are saying.
          </p>
        </div>
        <Carousel
          opts={{
            align: 'start',
            loop: true,
          }}
          className="w-full max-w-4xl mx-auto"
        >
          <CarouselContent>
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-1 h-full">
                  <Card className="flex flex-col h-full justify-between shadow-md hover:shadow-lg transition-shadow">
                    <CardContent className="pt-6">
                      <p className="text-muted-foreground italic">"{testimonial.quote}"</p>
                    </CardContent>
                    <CardFooter className="flex items-center gap-4">
                       <Avatar>
                        <AvatarImage src={`https://picsum.photos/seed/${testimonial.imageSeed}/40/40`} data-ai-hint="person face" />
                        <AvatarFallback>{testimonial.avatar}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                      </div>
                    </CardFooter>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  );
}
