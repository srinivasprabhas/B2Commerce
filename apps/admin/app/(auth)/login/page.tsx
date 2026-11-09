import Image from "next/image";
import { LoginForm } from "./login-form";

export const metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-sm rounded-xl border border-border bg-card p-8">
        <Image src="/brand/logo.png" alt="Tech Commerce" width={1200} height={335} priority className="mb-6 h-11 w-auto" />
        <h1 className="text-xl font-semibold">Admin sign in</h1>
        <p className="mt-1 mb-6 text-sm text-muted-foreground">Staff accounts only.</p>
        <LoginForm />
      </div>
    </div>
  );
}
