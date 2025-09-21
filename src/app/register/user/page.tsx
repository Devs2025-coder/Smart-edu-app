import { UserRegistrationForm } from '@/components/auth/user-registration-form';

export default function UserRegisterPage({
  searchParams,
}: {
  searchParams: { role?: string };
}) {
  const role = searchParams.role || 'Student';
  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <UserRegistrationForm role={role} />
      </div>
    </div>
  );
}
