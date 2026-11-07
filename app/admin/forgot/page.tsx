import type { Metadata } from "next";
import Link from "next/link";
import ForgotForm from "./ForgotForm";
import { hasSupabase } from "@/lib/supabase/env";

export const metadata: Metadata = { title: "Reset password" };

export default function ForgotPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-16">
      <div className="w-full max-w-sm rounded-[2rem] border border-border/50 bg-white p-8 shadow-sm">
        <p className="font-serif text-2xl text-primary">Reset password</p>
        <p className="mt-2 text-sm text-muted">Enter your admin email and we&apos;ll send you a link to choose a new password.</p>
        <div className="mt-8">
          <ForgotForm disabled={!hasSupabase()} />
        </div>
        <Link href="/admin/login" className="mt-6 block text-center text-sm text-muted hover:text-primary">
          Back to sign in
        </Link>
      </div>
    </main>
  );
}
