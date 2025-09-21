import { RegisterForm } from '@/components/auth/register-form';

export default function RegisterPage() {
  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold font-headline tracking-tighter">
            Register Your Institution
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Create an admin account and get started with EduTrack.
          </p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}
