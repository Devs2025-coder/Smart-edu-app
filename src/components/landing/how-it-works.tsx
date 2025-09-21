import Image from 'next/image';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';

const collegeSteps = [
  { title: "Register College", description: "An administrator creates the main account for the institution.", imageId: 2 },
  { title: "Add Users", description: "Admin adds professors and students to the system.", imageId: 3 },
  { title: "QR Attendance", description: "Professors take QR-code based attendance in seconds.", imageId: 4 },
  { title: "View Progress", description: "Students view their attendance and personalized tasks.", imageId: 5 },
];

const schoolSteps = [
  { title: "Register School", description: "An administrator sets up the school's profile.", imageId: 6 },
  { title: "Add Users", description: "Admin adds teachers, students, and parents.", imageId: 7 },
  { title: "Assign Tasks", description: "Teachers assign personalized tasks to students.", imageId: 8 },
  { title: "Monitor Progress", description: "Students complete tasks, and parents monitor progress.", imageId: 9 },
];

const StepCard = ({ step, index }: { step: { title: string; description: string, imageId: number }, index: number }) => (
    <div className="flex items-start space-x-4">
        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold">
            {index + 1}
        </div>
        <div className="flex-grow">
            <h3 className="text-lg font-headline font-semibold">{step.title}</h3>
            <p className="text-muted-foreground">{step.description}</p>
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
        <Tabs defaultValue="college" className="w-full max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="college">For Colleges</TabsTrigger>
            <TabsTrigger value="school">For Schools</TabsTrigger>
          </TabsList>
          <TabsContent value="college">
            <Card className="mt-6">
              <CardContent className="p-6 md:p-8 grid gap-8">
                {collegeSteps.map((step, index) => (
                    <StepCard key={index} step={step} index={index} />
                ))}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="school">
             <Card className="mt-6">
              <CardContent className="p-6 md:p-8 grid gap-8">
                {schoolSteps.map((step, index) => (
                    <StepCard key={index} step={step} index={index} />
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
