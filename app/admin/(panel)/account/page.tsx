import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth";
import Notice from "@/components/admin/Notice";
import { card } from "@/lib/admin-ui";
import PasswordForm from "./PasswordForm";

export const metadata: Metadata = { title: "Account" };

export default async function AccountPage({ searchParams }: { searchParams: Promise<{ reset?: string }> }) {
  const { user } = await requireAdmin();
  const { reset } = await searchParams;
  return (
    <div className="max-w-xl">
      {reset && <Notice>You&apos;re signed in. Choose a new password below.</Notice>}
      <h1 className="font-serif text-3xl md:text-4xl">Account</h1>
      <p className="mt-2 mb-8 text-muted">Signed in as {user.email}</p>
      <div className={card}>
        <h2 className="mb-4 font-serif text-xl">Change password</h2>
        <PasswordForm />
      </div>
    </div>
  );
}
