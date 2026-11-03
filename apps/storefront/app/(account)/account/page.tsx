import type { Metadata } from "next";
import { AccountForm } from "@/app/(account)/account/account-form";

export const metadata: Metadata = { title: "Account", robots: { index: false } };

export default function AccountPage() {
  return (
    <div className="mx-auto flex min-h-[70dvh] max-w-md flex-col justify-center px-4 py-16">
      <AccountForm />
    </div>
  );
}
