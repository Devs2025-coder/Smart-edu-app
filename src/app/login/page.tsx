import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md">
        <LoginForm />
      </div>
    </div>
  );
}
