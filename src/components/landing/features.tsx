import { QrCode, Lightbulb, LineChart, MonitorSmartphone } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';

const features = [
  {
    icon: <QrCode className="w-8 h-8 text-primary" />,
    title: 'Automated Attendance',
    description: 'QR-based attendance tracking for colleges and schools, saving valuable time.',
  },
  {
    icon: <Lightbulb className="w-8 h-8 text-primary" />,
    title: 'Personalized Tasks',
    description: 'Suggests learning & productivity activities for students based on AI analysis.',
  },
  {
    icon: <LineChart className="w-8 h-8 text-primary" />,
    title: 'Reports & Analytics',
    description: 'Insights on attendance, task completion, and engagement for data-driven decisions.',
  },
  {
    icon: <MonitorSmartphone className="w-8 h-8 text-primary" />,
    title: 'Multi-Platform Access',
    description: 'Seamless experience on both mobile and web platforms for all users.',
  },
];

export function Features() {
  return (
    <section id="features" className="py-20 sm:py-32">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Core Features
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-muted-foreground md:text-xl">
            Everything you need to streamline your institution's daily operations.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="bg-card/80 backdrop-blur-sm border shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <div className="mb-4">{feature.icon}</div>
                <CardTitle className="font-headline">{feature.title}</CardTitle>
                <CardDescription className="pt-2">{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
