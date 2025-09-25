import { ForgotPasswordForm } from '@/components/auth/forgot-password-form';

export default function ForgotPasswordPage() {
  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md">
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
