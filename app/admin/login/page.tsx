import type { Metadata } from "next";
import LoginForm from "./LoginForm";
import Link from "next/link";
import { hasSupabase, isAdminPreview } from "@/lib/supabase/env";

export const metadata: Metadata = { title: "Sign in" };

export default function AdminLoginPage() {
  const connected = hasSupabase();
  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-16">
      <div className="w-full max-w-sm rounded-[2rem] border border-border/50 bg-white p-8 shadow-sm">
        <p className="font-serif text-2xl text-primary">One For The Girls</p>
        <h1 className="mt-1 text-sm font-medium uppercase tracking-[0.2em] text-muted">Admin</h1>
        {isAdminPreview() && (
          <Link
            href="/admin"
            className="mt-6 block rounded-2xl border border-dashed border-primary/40 px-4 py-3 text-sm font-medium text-primary hover:bg-blush"
          >
            Preview: open the admin without logging in →
          </Link>
        )}
        {!connected && (
          <p className="mt-6 rounded-2xl bg-blush px-4 py-3 text-sm text-primary-dark">
            Not connected to the database yet. Add the Supabase keys to the environment variables.
          </p>
        )}
        <div className="mt-8">
          <LoginForm disabled={!connected} />
        </div>
      </div>
    </main>
  );
}
