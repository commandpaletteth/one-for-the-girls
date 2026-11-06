import AdminNav from "@/components/admin/AdminNav";
import { requireAdmin } from "@/lib/auth";

// Every page inside (panel) needs a logged-in admin. Checked on the server, not in the browser.
export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const { user, preview } = await requireAdmin();
  return (
    <div className="min-h-screen lg:flex">
      <AdminNav email={user.email ?? ""} />
      <main className="min-w-0 flex-1 px-5 py-8 md:px-10 md:py-10">
        {preview && (
          <p className="mb-8 rounded-2xl border border-dashed border-primary/40 bg-blush px-4 py-3 text-sm text-primary-dark">
            <strong>Preview mode</strong> (local only): not connected to Supabase, showing sample data. Nothing is saved.
          </p>
        )}
        {children}
      </main>
    </div>
  );
}
