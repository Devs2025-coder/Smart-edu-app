
import Image from 'next/image';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const collegeSteps = [
  { title: "Register College", description: "An administrator creates the main account for the institution.", imageId: 2, imageHint: "person computer" },
  { title: "Add Users", description: "Admin adds professors and students to the system.", imageId: 3, imageHint: "team working" },
  { title: "QR Attendance", description: "Professors take QR-code based attendance in seconds.", imageId: 4, imageHint: "phone qr" },
  { title: "View Progress", description: "Students view their attendance and personalized tasks.", imageId: 5, imageHint: "student phone" },
];

const StepCard = ({ step, index }: { step: { title: string; description: string, imageId: number, imageHint: string }, index: number }) => (
    <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6 p-4">
        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold">
            {index + 1}
        </div>
        <div className="flex-grow">
            <h3 className="text-lg font-headline font-semibold">{step.title}</h3>
            <p className="text-muted-foreground">{step.description}</p>
        </div>
        <div className="flex-shrink-0 w-full sm:w-32 md:w-40">
           <Image
                src={`https://picsum.photos/seed/${step.imageId}/400/300`}
                alt={step.title}
                width={400}
                height={300}
                className="rounded-lg object-cover"
                data-ai-hint={step.imageHint}
            />
        </div>
    </div>
);


export function HowItWorks() {
  return (
    <section className="py-20 sm:py-32 bg-secondary/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-4xl md:text-5xl">
            How It Works
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-muted-foreground md:text-xl">
            A simple, step-by-step process to get your institution running.
          </p>
        </div>
        <div className="w-full max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">For Colleges</CardTitle>
            </CardHeader>
            <CardContent className="p-6 md:p-8 grid gap-4 divide-y divide-border">
              {collegeSteps.map((step, index) => (
                  <StepCard key={index} step={step} index={index} />
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
